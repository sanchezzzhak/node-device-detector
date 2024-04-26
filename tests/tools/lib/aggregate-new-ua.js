const fs = require('fs')

const DeviceDetect = require('../../../index')
const ClientHints = require('../../../client-hints')
const { YAMLLoad, getFixtureFolder } = require('./../../functions')

const clientHints = new ClientHints();
const detector = new DeviceDetect({
  deviceIndexes: true,
  clientIndexes: true,
  deviceAliasCode: true,
})

aliasDevice = detector.getParseAliasDevice();
aliasDevice.setReplaceBrand(false);

let outputExist = {}
let fixtures = {}

class AggregateNewUa {
  folderFixturePath = ''
  uniqueOutput = false

  constructor (options) {
    if (options) {
      this.folderFixturePath = options.folderFixturePath || ''
      this.uniqueOutput = options.uniqueOutput || false
    }
    this.init()
  }

  getFixtureDir () {
    if (this.folderFixturePath === '') {
      return getFixtureFolder() + 'devices/'
    }
    return this.folderFixturePath
  }

  init () {
    let excludeFilesNames = ['bots.yml', 'alias_devices.yml']
    const folderFixturePath = this.getFixtureDir()

    let ymlDeviceFiles = fs.readdirSync(folderFixturePath)
    ymlDeviceFiles.forEach((file) => {
      if (excludeFilesNames.indexOf(file) !== -1) {
        return
      }
      let fixtureData = YAMLLoad(folderFixturePath + file)
      fixtureData.forEach((fixture, pos) => {
        let aliasResult = aliasDevice.parse(fixture.user_agent)
        if (fixture.headers) {
          let clientHintData = clientHints.parse(fixture.headers);
          if (clientHintData?.device?.model) {
            aliasResult = {name: clientHintData.model}
          }
        }

        if (!fixture.device) {
          return
        }

        if (fixture.device && !fixture.device.brand) {
          return
        }

        let brand = String(fixture.device.brand)
        let model = String(fixture.device.model)

        let deviceCode = aliasResult.name
          ? aliasResult.name.toLowerCase()
          : void 0
        fixtures[deviceCode] = {brand, model}
      })
    })
  }

  /**
   *
   * @param {string} useragent
   * @param {{}} clientHintJson
   * @returns {boolean}
   */
  check (useragent, clientHintJson = {}) {
    const clientHintData = clientHints.parse(
      clientHintJson.hints ?? clientHintJson,
      clientHintJson.meta ?? clientHintJson
    );
    let result = detector.detect(useragent, clientHintData)
    let deviceCode = result.device && result.device.code ? result.device.code.toLowerCase() : void 0


    let isFoundModel = result.device && result.device.model
    let isFoundBrand = result.device && result.device.brand

    // to find new device code for fixtures (unique mode on)
    if (
      this.uniqueOutput &&
      fixtures[deviceCode] === void 0 &&
      outputExist[deviceCode] === void 0
    ) {
      outputExist[deviceCode] = 1
      return true
    }
    // to find new device code for fixtures (unique mode off)
    if (!this.uniqueOutput && fixtures[deviceCode] === void 0) {
      return true
    }
    // to find unknown device model or brand
    if (deviceCode && (!isFoundModel || !isFoundBrand)) {
      return true
    }

    return false

  }

}

module.exports = AggregateNewUa
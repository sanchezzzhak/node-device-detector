const fs = require('fs')

const DeviceDetect = require('../../../index')
const ClientHints = require('../../../client-hints')
const { YAMLLoad, getFixtureFolder } = require('./../../functions')

const outputExist = {}
const fixtures = {}
const clientHints = new ClientHints();
const detector = new DeviceDetect({ deviceIndexes: true, clientIndexes: true, deviceAliasCode: true})
const aliasDevice = detector.getParseAliasDevice();

aliasDevice.setReplaceBrand(false);

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
    const excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
    const folderFixturePath = this.getFixtureDir();
    const ymlDeviceFiles = fs.readdirSync(folderFixturePath);

    ymlDeviceFiles.forEach((file) => {
      if (excludeFilesNames.indexOf(file) !== -1) {
        return
      }

      const fixtureData = YAMLLoad(folderFixturePath + file);

      fixtureData.forEach((fixture, pos) => {
        let aliasResult = aliasDevice.parse(fixture.user_agent)
        if (fixture.headers) {
          const clientHintData = clientHints.parse(fixture.headers);
          if (clientHintData.device && clientHintData.device.model) {
            aliasResult.name = '' + clientHintData.device.model;
          }
        }

        if (!fixture.device) {
          return
        }

        if (fixture.device && !fixture.device.brand) {
          return
        }

        const brand = String(fixture.device.brand)
        const model = String(fixture.device.model)
        const deviceCode = aliasResult.name
          ? aliasResult.name.toLowerCase()
          : void 0
        fixtures[deviceCode] = {brand, model}
      })
    })
  }

  /**
   *
   * @param {string} useragent
   * @param {JSONObject|{}} clientHintJson
   * @returns {boolean}
   */
  check (useragent, clientHintJson = {}) {
    const clientHintData = clientHints.parse(
      clientHintJson.hints ?? clientHintJson,
      clientHintJson.meta ?? clientHintJson
    );

    const result = detector.detect(useragent, clientHintData)
    const deviceCode = result.device && result.device.code ? result.device.code.toLowerCase() : void 0
    const isFoundModel = result.device && result.device.model
    const isFoundBrand = result.device && result.device.brand

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

new AggregateNewUa();



module.exports = AggregateNewUa
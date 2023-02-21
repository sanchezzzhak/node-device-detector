const fs = require('fs')
const AliasDevice = require('../../../parser/device/alias-device')
const DeviceDetect = require('../../../index')
const { YAMLLoad, getFixtureFolder } = require('./../../functions')

const aliasDevice = new AliasDevice()
aliasDevice.setReplaceBrand(false);

const detector = new DeviceDetect({
  deviceIndexes: true,
  clientIndexes: true,
})

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

        if (!fixture.device) {
          return
        }

        if (!fixture.device.brand) {
          return
        }

        let brand = String(fixture.device.brand)
        let model = String(fixture.device.model)
        let deviceCode = aliasResult.name
          ? aliasResult.name.toLowerCase()
          : void 0
        fixtures[deviceCode] = { brand, model }
      })
    })
  }

  get(deviceCode) {
    let code = deviceCode.toLowerCase()
    return fixtures[code] ? fixtures[code]: null;
  }

  /**
   *
   * @param {string} useragent
   * @returns {boolean}
   */
  check (useragent) {
    let aliasResult = aliasDevice.parse(useragent)
    let deviceCode = aliasResult.name ? aliasResult.name.toLowerCase() : void 0

    let result = detector.detect(useragent)
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
const fs = require('fs')
const AliasDevice = require('../../../parser/device/alias-device')
const DeviceDetect = require('../../../index')
const { YAMLLoad, getFixtureFolder } = require('./../../functions')

const aliasDevice = new AliasDevice()
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

        if (fixture.device && !fixture.device.brand) {
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

  check (useragent) {
    let aliasResult = aliasDevice.parse(useragent)
    let deviceCode = aliasResult.name ? aliasResult.name.toLowerCase() : void 0

    let result = detector.detect(useragent)
    let isFoundModel = result.device && result.device.model !== void 0
    let isFoundBrand = result.device && result.device.brand !== void 0

    if (
      this.uniqueOutput &&
      fixtures[deviceCode] === void 0 &&
      outputExist[deviceCode] === void 0
    ) {
      outputExist[deviceCode] = 1
      return true
    } else if (!this.uniqueOutput && fixtures[deviceCode] === void 0) {
      return true
    }
    // } else if(fixtures[deviceCode] === void 0 && !isFoundModel && isFoundBrand) {
    //   console.log(useragent)
    // } else if(deviceCode && !isFoundBrand) {
    //   console.log(useragent)
    // }
    return false

  }

}

module.exports = AggregateNewUa
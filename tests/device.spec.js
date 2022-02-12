// show console petty table set env DEBUG_TABLE=true

const fs = require('fs');
const { should, assert, expect } = require('chai');
const {
  perryJSON,
  perryTable,
  isObjNotEmpty,
  getFixtureFolder,
  YAMLLoad,
} = require('./functions');

const DeviceDetector = require('../index');
const fixtureFolder = getFixtureFolder();
const excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
const ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');
const TIMEOUT = 6000;

const detector = new DeviceDetector();

// set result regex in detect model
detector.getParseDevice('Mobile').resultModelRegex = true;

const DATA_DEVICE_MOBILES = YAMLLoad(
    __dirname + '/../regexes/device/mobiles.yml'
);

function normalizationFixture(fixture) {
  if(fixture.client === null) {
    fixture.client = {};
  }
  if(fixture.os === null || Array.isArray(fixture.os)) {
    fixture.os = {};
  }
  if(fixture.os !== void 0 && fixture.os.platform === null) {
    fixture.os.platform = "";
  }
}

function testsFromFixtureDeviceMobile(fixture) {
  // test device data
  if (!isObjNotEmpty(fixture.device)) {
    return;
  }
  if (
      !isObjNotEmpty(fixture.device.model) ||
      !isObjNotEmpty(fixture.device.brand)
  ) {
    return;
  }
  let { brand, regex } = fixture.device;

  if (DATA_DEVICE_MOBILES[brand] === void 0) {
    return;
  }
  if (!Array.isArray(DATA_DEVICE_MOBILES[brand].models)) {
    return;
  }
  // marks regex in tests exists
  for (let i = 0, l = DATA_DEVICE_MOBILES[brand].models.length; i < l; i++) {
    if (DATA_DEVICE_MOBILES[brand].models[i].regex === regex) {
      if (DATA_DEVICE_MOBILES[brand].models[i].count === undefined) {
        DATA_DEVICE_MOBILES[brand].models[i].count = 0;
      }
      DATA_DEVICE_MOBILES[brand].models[i].count += 1;
      break;
    }
  }
}

describe('tests devices', function () {
  this.timeout(TIMEOUT);
  const runTest = (result, fixture) => {
    let messageError = 'fixture data\n' + perryJSON(fixture);
    if(result.client) {
      delete result.client.short_name;
      if(fixture.browser_family !== void 0) {
        result.browser_family = result.client.family;
      }
      delete result.client.family;
      if(fixture.browser_family === 'Unknown' && result.browser_family === '') {
        result.browser_family = 'Unknown';
      }
      if(fixture.browser_family === 'Unknown') {
        result.browser_family = fixture.browser_family;
      }

    }
    let regex;
    if(result.device) {
      delete result.device.id;
      regex = result.device.regex;
      delete result.device.regex;
    }

    if(result.os.family !== void 0) {
      result.os_family = result.os.family;
      delete result.os.family;
      delete result.os.short_name;
    }
    if(fixture.os_family === 'Unknown' && result.os_family === void 0) {
      result.os_family = fixture.os_family;
    }

    expect(fixture, `${messageError} device regex: ${regex}`).to.deep.equal(result);
    if(result.device) {
      result.device.regex = regex;
    }

    if(result.device && result.device.brand) {
      expect(detector.hasBrand(result.device.brand))
      .to.equal(true, `brand not found from short list, ${messageError} `);
    }
  }

  detector.discardDeviceAliasCode = true;

  ymlDeviceFiles.forEach(function (file) {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    describe('file fixture ' + file, function () {
      let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
      let total = fixtureData.length;
      // =====
      describe('not used indexes', () => {
        fixtureData.forEach((fixture, pos) => {
          normalizationFixture(fixture);
          it(pos + '/' + total, function () {
            detector.discardDeviceIndexes = true;
            let result = detector.detect(fixture.user_agent);
            result.user_agent = fixture.user_agent;
            perryTable(fixture, result);
            runTest(result, fixture);

            testsFromFixtureDeviceMobile(result);
          });
        });
      });
      // =====
      describe('used indexes', () => {
        fixtureData.forEach((fixture, pos) => {
          normalizationFixture(fixture);
          it(pos + '/' + total, function () {
            detector.discardDeviceIndexes = false;
            let result = detector.detect(fixture.user_agent);
            result.user_agent = fixture.user_agent;
            perryTable(fixture, result);
            runTest(result, fixture);
          });
        });
      });
      // =====
    });
  });
});
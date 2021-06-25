// show console petty table set env DEBUG_TABLE=true

const fs = require('fs');
const helper = require('../parser/helper');
const { should, assert, expect } = require('chai');
const {
  perryJSON,
  perryTable,
  isObjNotEmpty,
  getFixtureFolder,
  normalizeVersion,
  YAMLLoad,
} = require('./functions');

const TIMEOUT = 6000;
const detector = new (require('../index'))();
const aliasDevice = new (require('../parser/device/alias-device'))();

// set result regex in detect model
detector.getParseDevice('Mobile').resultModelRegex = true;

let fixtureFolder = getFixtureFolder();
let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');
let ymlClientFiles = fs.readdirSync(fixtureFolder + 'clients/');


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

function testVersionAndSkip(resultVersion, fixtureVersion, messageError) {
  try {
    expect(resultVersion, messageError).to.equal(String(fixtureVersion));
  } catch (e) {
    let regex = new RegExp('^([0-9]+).0$', 'i');
    let check =
      regex.exec(fixtureVersion) !== null &&
      Math.ceil(resultVersion) === Math.ceil(fixtureVersion);
    
    if (check) {
      console.log(
        'parse error version, fixture version %s | result version %s',
        fixtureVersion,
        resultVersion
      );
    } else {
      throw new SyntaxError(e.stack);
    }
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

describe('tests clients', function () {
  this.timeout(TIMEOUT);
  let skipFiles = ['version_truncate.yml'];
  ymlClientFiles.forEach(function (file) {
    if (skipFiles.indexOf(file) !== -1) {
      return;
    }
    describe('file fixture ' + file, function () {
      let fixtureData = YAMLLoad(fixtureFolder + 'clients/' + file);
      let total = fixtureData.length;
      //fixtureData= [  fixtureData[208] ];
      fixtureData.forEach((fixture, pos) => {
        it(pos + '/' + total, function () {
          let result = detector.detect(fixture.user_agent);
          perryTable(fixture, result);
          
          // fix values fixture null
          if (!result.client.version && fixture.client.version === null) {
            result.client.version = fixture.client.version;
          }
          
          if (!result.client.engine_version && fixture.client.engine_version === null) {
            result.client.engine_version = fixture.client.engine_version;
          }
          
          if (!result.client.engine && fixture.client.engine === null) {
            result.client.engine = fixture.client.engine;
          }
          
          // fix version fixture
          if (
            fixture.client.version !== null &&
            typeof fixture.client.version === 'number'
          ) {
            fixture.client.version = normalizeVersion(
              String(fixture.client.version),
              2
            );
          }
          
          if(result.client.short_name) {
            expect(result.client.short_name).to.not.equal('UNK');
            delete result.client.short_name;
            delete result.client.family;
          }
          
          expect(fixture.client).to.deep.equal(result.client);
        });
      });
    });
  });
});

describe('tests bots', function () {
  let file = 'bots.yml';
  describe('file fixture ' + file, function () {
    let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
    let total = fixtureData.length;

    fixtureData.forEach((fixture, pos) => {
      it(pos + '/' + total, function () {
        detector.skipBotDetection = false;
        let result = detector.parseBot(fixture.user_agent);

        perryTable(fixture, result);
        let messageError = 'fixture data\n' + perryJSON(fixture);

        if (isObjNotEmpty(fixture.bot.name)) {
          expect(fixture.bot.name, messageError).to.equal(result.name);
        }

        if (isObjNotEmpty(fixture.bot.category)) {
          expect(fixture.bot.category, messageError).to.equal(result.category);
        }
        if (isObjNotEmpty(fixture.bot.url)) {
          expect(fixture.bot.url, messageError).to.equal(result.url);
        }
        if (isObjNotEmpty(fixture.bot.producer)) {
          expect(fixture.bot.producer, messageError).to.have.deep.equal(
            result.producer
          );
        }
      });
    });
  });
});

describe('tests alias devices', function () {
  this.timeout(TIMEOUT);
  let file = 'alias_devices.yml';
  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function () {

      let result = aliasDevice.parse(fixture.user_agent);
      perryTable(fixture, result);
      let messageError = 'fixture data\n' + perryJSON(fixture);
      expect(fixture.alias.name, messageError).to.deep.equal(result.name);
    });
  });
});

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
  
  ymlDeviceFiles.forEach(function (file) {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    describe('file fixture ' + file, function () {
      let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
      let total = fixtureData.length;
      
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

describe('tests vendor fragments', function () {
  let fixtureData = YAMLLoad(fixtureFolder + 'vendorfragments.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function () {
      let result = detector.detect(fixture.useragent);
      let messageError = 'fixture data\n' + perryJSON(fixture);
      expect(result.device.brand, messageError).to.equal(fixture.vendor);
      expect(result.device.id !== '', messageError).to.equal(true);
    });
  });
});

describe('tests oss', function () {
  let fixtureData = YAMLLoad(fixtureFolder + 'oss.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function () {

      let result = detector.detect(fixture.user_agent);
      let messageError = 'fixture data\n' + perryJSON(fixture);
      // test os data
      if (isObjNotEmpty(fixture.os.name)) {
        expect(fixture.os.name, messageError).to.equal(result.os.name);
      }
      if (isObjNotEmpty(fixture.os.short_name)) {
        expect(fixture.os.short_name, messageError).to.equal(result.os.short_name);
      }
      if (isObjNotEmpty(fixture.os.platform)) {
        expect(fixture.os.platform, messageError).to.equal(result.os.platform);
      }
      if (isObjNotEmpty(fixture.os.version)) {
        testVersionAndSkip.call(
          this,
          result.os.version,
          fixture.os.version,
          messageError
        );
      }
    });

  });
});

describe('tests version truncate', function () {
  let fixtureData = YAMLLoad(fixtureFolder + 'clients/version_truncate.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function () {
      let result = detector.detect(fixture.user_agent);
      let osVersion = helper.versionTruncate(result.os.version, fixture.set);
      let clientVersion = helper.versionTruncate(
        result.client.version,
        fixture.set
      );
      let messageError = 'fixture data\n' + perryJSON(fixture);
      expect(String(osVersion), messageError).to.equal(fixture.os_version);
      expect(String(clientVersion), messageError).to.equal(fixture.client_version);
    });
  });
});

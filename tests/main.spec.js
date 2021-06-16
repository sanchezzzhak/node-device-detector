// show console petty table set env DEBUG_TABLE=true

const fs = require('fs');
const helper = require('../parser/helper');
const { should, assert, expect } = require('chai');
const {
  perryJSON,
  perryTable,
  isObjNotEmpty,
  revertKeysForObjects,
  normalizeVersion,
  YAMLLoad,
} = require('./functions');

const TIMEOUT = 6000;
const detector = new (require('../index'))();
const aliasDevice = new (require('../parser/device/alias-device'))();

const infoDevice = new (require('../parser/device/info-device'))();

const collectionBrand = revertKeysForObjects(
  require('../parser/device/brand-short')
);
const collectionBrowser = revertKeysForObjects(
  require('../parser/client/browser-short')
);
const collectionOs = revertKeysForObjects(require('../parser/os/os_systems'));

// set result regex in detect model
detector.getParseDevice('Mobile').resultModelRegex = true;

let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let ymlDeviceFiles = [];
let ymlClientFiles = [];
let ymlDeviceInfoFiles = [];
let fixtureFolder = __dirname + '/fixtures/';

ymlClientFiles = fs.readdirSync(fixtureFolder + 'clients/');
ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');
ymlDeviceInfoFiles = fs.readdirSync(fixtureFolder + 'devices-info/');

const DATA_DEVICE_INFO = YAMLLoad(
  __dirname + '/../regexes/device-info/device.yml'
);
const DATA_DEVICE_MOBILES = YAMLLoad(
  __dirname + '/../regexes/device/mobiles.yml'
);


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


function testVersionAndSkip(resultVersion, fixtureVersion, messageError) {
  try {
    expect(resultVersion, messageError).to.equal(String(fixtureVersion));
  } catch (e) {
    let regex = new RegExp('^([0-9]+).0$', 'i');
    let check =
      regex.exec(fixtureVersion) !== null &&
      Math.ceil(resultVersion) == Math.ceil(fixtureVersion);

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

function checkRegexRuleForDoubleOr(regex) {
  return regex.indexOf('||') === -1;
}

function checkRegexVerticalLineClosingGroup(regex) {
  let pattern = '(?<!\\)(|))';
  if (regex.indexOf('|)') !== -1) {
    return new RegExp(pattern, 'is').test(regex);
  }
  return true;
}

function checkRegexRestrictionEndCondition(regex) {
  let regexPattern = /(\[[);\\\ ]{4}\])/;
  // get conditions [;)\ ]
  if (new RegExp(regexPattern, 'm').exec(regex) !== null) {
    return false;
  }

  // get conditions [);/ ] and check format
  let regexPatternCheck1 = /(?<!(?:\(\[\^[;/)]{3}\][+*]\)))(\[[);\/ ]{3,4}\])/;
  let matchConditionFormat1 = new RegExp(regexPatternCheck1, 'm').exec(regex);
  if (matchConditionFormat1 !== null) {
    // get conditions (?:[);/ ]|$)
    let regexPatternCheck2 = /(?:(?<=(?:\?:))(\[[);/ ]{3,4}\])(?=\|\$))/;
    let matchConditionFormat2 = new RegExp(regexPatternCheck2, 'm').exec(regex);
    if (matchConditionFormat2 === null) {
      return false;
    }
    return matchConditionFormat1[0].length === matchConditionFormat2[1].length;
  }
  return true;
}

function testsRegexStructureDevice(file, brand, regexData) {
  expect(regexData).to.property('regex');
  let regex = regexData['regex'];

  let prefixErrorFileBrand = `file ${file}, brand ${brand}, `;

  let errorMessageDoubleOr = `Detect \`||\` in regex ${prefixErrorFileBrand}`;
  expect(checkRegexRuleForDoubleOr(regex)).to.equal(
    true,
    errorMessageDoubleOr + `common regex ${regex}`
  );

  let errorMessageVerticalLineCloseGroup = `Detect \`|)\` in regex, ${prefixErrorFileBrand}`;
  expect(checkRegexVerticalLineClosingGroup(regex)).to.equal(
    true,
    errorMessageVerticalLineCloseGroup + `common regex ${regex}`
  );

  let errorMessageEndCondition = `Detect end of regular expression does not match the format \`(?:[);/ ]|$)\`, ${prefixErrorFileBrand}`;
  expect(checkRegexRestrictionEndCondition(regex)).to.equal(
    true,
    errorMessageEndCondition + `common regex ${regex}`
  );

  if (regexData.models !== undefined) {
    expect(Array.isArray(regexData.models)).to.equal(true);
    regexData.models.forEach((model, pos) => {
      expect(model).to.property('regex');
      expect(model).to.property('model');
      let regex = model.regex;
      expect(checkRegexRuleForDoubleOr(regex)).to.equal(
        true,
        errorMessageDoubleOr + `model regex ${regex}`
      );
      expect(checkRegexVerticalLineClosingGroup(regex)).to.equal(
        true,
        errorMessageVerticalLineCloseGroup + `model regex ${regex}`
      );
      expect(checkRegexRestrictionEndCondition(regex)).to.equal(
        true,
        errorMessageEndCondition + `model regex ${regex}`
      );
    });
  } else {
    expect(regexData).to.property('device');
    expect(regexData).to.property('model');
    expect(typeof regexData['model'] === 'string').to.equal(true);
  }
}

describe('tests device fixtures', function () {
  this.timeout(TIMEOUT);
  let skipFiles = [
    'alias-device.yml',
    'info-device.yml',
    'info-device-hardware.yml',
    'info-device-hardware-cpu.yml',
    'info-device-hardware-gpu.yml',
    'device-manufacturer-info.yml',
  ];
  let pathRegexData = fixtureFolder + '../../regexes/device/';
  let deviceRegexFiles = fs.readdirSync(pathRegexData);
  deviceRegexFiles.forEach(function (file) {
    if (skipFiles.indexOf(file) !== -1) {
      return;
    }
    describe('file fixture ' + file, function () {
      let fixtureData = YAMLLoad(pathRegexData + file);
      for (let brand in fixtureData) {
        it(brand, function () {
          testsRegexStructureDevice.call(
            this,
            pathRegexData + file,
            brand,
            fixtureData[brand]
          );
        });
      }
    });
  });
});

describe('tests clients fixtures', function () {
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

          // fix fixture is short_name numeric
          if (fixture.client.short_name && isFinite(fixture.client.short_name)) {
            fixture.client.short_name = String(fixture.client.short_name);
          }

          // copy family to fixture check
          // fixture.client.family = result.client.family;
          expect(result.client.short_name).to.not.equal('UNK');
          if (fixture.client.family) {
            expect(result.client.family).to.equal(fixture.client.family);
          }
          expect(result.client.type).to.equal(fixture.client.type);
          expect(result.client.name).to.equal(fixture.client.name);
          expect(result.client.version).to.equal(fixture.client.version);
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

describe('tests alias devices fixtures', function () {
  this.timeout(TIMEOUT);
  let file = 'alias_devices.yml';
  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function () {

      let result = aliasDevice.parse(fixture.user_agent);
      perryTable(fixture, result);
      let messageError = 'fixture data\n' + perryJSON(fixture);
      expect(fixture.alias.name, messageError).to.have.deep.equal(result.name);

    });
  });
});

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

describe('tests devices fixtures', function () {
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


describe('tests devices info', function () {
  this.timeout(TIMEOUT);

  it('test get unknown result', () => {
    let result = infoDevice.info('unknown', 'unknown');
    expect(result).to.equal(null);
  });

  it('test get results', () => {
    infoDevice.setResolutionConvertObject(false);
    infoDevice.setSizeConvertObject(false);
    let result = infoDevice.info('Asus', 'ZenFone 4');
    expect(result.display.size).to.equal('5.5');
    expect(result.display.ratio).to.equal('16:9');
    expect(result.display.resolution).to.equal('1080x1920');
    expect(result.size).to.equal('75.2x155.4x7.7');
    expect(result.weight).to.equal('165');
    expect(result.release).to.equal('2017.08');
  });

  it('test get redirect result', () => {
    let result = infoDevice.info('Bravis', 'B501 Easy');
    expect(result !== null).to.equal(true);
  });

  it('test case size', () => {
    infoDevice.setResolutionConvertObject(true);
    infoDevice.setSizeConvertObject(true);
    let result = infoDevice.info('Asus', 'ZenFone 4');

    expect(result.display.resolution).to.deep.equal({
      width: '1080',
      height: '1920',
    });
    expect(result.size.width).to.equal('75.2');
    expect(result.size.height).to.equal('155.4');
    expect(result.size.thickness).to.equal('7.7');
  });

  for (let brand in DATA_DEVICE_INFO) {
    for (let model in DATA_DEVICE_INFO[brand]) {
      let rawSource = DATA_DEVICE_INFO[brand][model];
      it(brand + ' - ' + model, () => {


        infoDevice.setSizeConvertObject(true);
        infoDevice.setResolutionConvertObject(true);
        let result = infoDevice.info(brand, model);

        if (result === null) {
          expect(rawSource !== void 0).to.equal(true);
          return;
        }

        let patternNumber = /^[0-9\.]+$/i;
        let patternFloat = /^[0-9\.]+$/i;
        let patternRatio = /^[0-9\.]+:[0-9\.]+$/i;
        let patternYear = /^([0-9]{4}\.(1[0-2]|0[1-9])|[0-9]{4})$/i;

        let formatMessageFloat = `brand (${brand})  model (${model}) value does not match format ^[0-9.]+$ result: ${perryJSON(
          result
        )}`;
        let formatMessageRatio = `brand (${brand})  model (${model}) value does not match format ^[0-9.]+:[0-9.]+$ result: ${perryJSON(
          result
        )}`;
        let formatMessageNumber = `brand (${brand})  model (${model}) value does not match format ^[0-9]+$  result: ${perryJSON(
          result
        )}`;
        let formatMessageYear = `brand (${brand})  model (${model}) value does not match format ^[0-9]{4}\.(1[0-2]|0[1-9])|[0-9]{4})$  result: ${perryJSON(
          result
        )}`;

        if (result.display) {
          if (result.display.size) {
            expect(
              result.display.size,
              'display.size(DS) ' + formatMessageFloat
            ).to.match(patternFloat);
          }
          if (result.display.resolution) {
            expect(result.display.ratio, formatMessageRatio).to.match(patternRatio);
            expect(
              result.display.resolution.width,
              'display.width(RS) ' + formatMessageFloat
            ).to.match(patternFloat);
            expect(
              result.display.resolution.height,
              'display.height(RS) ' + formatMessageFloat
            ).to.match(patternFloat);
            expect(result.display.ppi, formatMessageFloat).to.match(patternFloat);
          }
        }
        if (result.size) {
          expect(result.size.width, 'size.width(SZ) ' + formatMessageFloat).to.match(
            patternFloat
          );
          expect(
            result.size.height,
            'size.height(SZ) ' + formatMessageFloat
          ).to.match(patternFloat);
          expect(
            result.size.thickness,
            'size.thickness(SZ) ' + formatMessageFloat
          ).to.match(patternFloat);
        }

        if (result.weight !== void 0 && result.weight !== '') {
          expect(result.weight, formatMessageFloat).to.match(patternFloat);
        }
        if (result.release !== void 0 && result.release !== '') {
          expect(result.release, formatMessageYear).to.match(patternYear);
        }
        if (result.sim !== void 0) {
          expect(result.sim, formatMessageNumber).to.match(patternNumber);
        }

        if (result.hardware !== void 0) {
          if (result.hardware.ram) {
            expect(result.hardware.ram, formatMessageNumber).to.match(patternNumber);
          }

          if (result.hardware.cpu_id) {
            expect(result.hardware.cpu_id, formatMessageNumber).to.match(
              patternNumber
            );
            expect(result.hardware.cpu).to.property('name');
            expect(result.hardware.cpu).to.property('type');
            expect(result.hardware.cpu).to.property('cores');
            expect(result.hardware.cpu).to.property('clock_rate');
          }
          if (result.hardware.gpu !== void 0) {
            expect(result.hardware.gpu).to.property('name');
            expect(result.hardware.gpu).to.property('clock_rate');
          }
        }
      });
    }
  }

  ymlDeviceInfoFiles.forEach(function (file) {
    describe('file fixture ' + file, function () {
      let fixtureData = YAMLLoad(fixtureFolder + 'devices-info/' + file);
      let total = fixtureData.length;

      fixtureData.forEach((fixture, pos) => {
        let itName = fixture.brand + ' - ' + fixture.model;

        it(itName, function () {
          infoDevice.setResolutionConvertObject(true);
          infoDevice.setSizeConvertObject(true);
          let result = infoDevice.info(fixture.brand, fixture.model);
          expect(fixture.result, 'Error in ' + itName).to.deep.equal(result);
        });
      });
    });
  });
});

describe('tests vendor fragment', function () {
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

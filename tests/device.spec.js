// show console petty table set env DEBUG_TABLE=true

const fs = require('fs');
const {should, assert, expect} = require('chai');
const {
  perryJSON,
  perryTable,
  isObjNotEmpty,
  getFixtureFolder,
  YAMLLoad,
} = require('./functions');

const DeviceDetector = require('../index');
const ClientHint = require('../client-hints');
const fixtureFolder = getFixtureFolder();
const excludeFilesNames = [
  'bots.yml',
  'alias_devices.yml',
  'clienthints-app.yml',
  'clienthints.yml',
  'device-hash.yml',
];
const ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');
const TIMEOUT = 6000;

const detector = new DeviceDetector();
const clientHints = new ClientHint();

// set result regex in detect model
detector.getParseDevice('Mobile').resultModelRegex = true;

const DATA_DEVICE_MOBILES = YAMLLoad(
  __dirname + '/../regexes/device/mobiles.yml',
);

function normalizationFixture(fixture) {
  if (fixture.client === null) {
    fixture.client = {};
  }
  
  if (fixture.os === null || Array.isArray(fixture.os)) {
    fixture.os = {};
  }
  if (fixture.os !== void 0 && fixture.os.platform === null) {
    fixture.os.platform = '';
  }
  
  if (fixture.device !== void 0 && fixture.device.brand === null) {
    fixture.device.brand = '';
  }
  if (fixture.device !== void 0 && fixture.device.model === null) {
    fixture.device.model = '';
  }
  if (fixture.device !== void 0 && fixture.device.type === null) {
    fixture.device.type = '';
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
  let {brand, regex} = fixture.device;
  
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

const runTest = (fixture, result) => {

  let messageError = 'fixture data\n' + perryJSON(fixture);

  // remove client hints for diff result
  if (fixture.headers !== void 0) {
    delete fixture.headers;
  }
  // remove client meta for diff result
  if (fixture.meta !== void 0) {
    delete fixture.meta;
  }

  if (result.client) {
    delete result.client.short_name;
    if (fixture.browser_family !== void 0) {
      result.browser_family = result.client.family;
    }
    delete result.client.family;
    if (fixture.browser_family === 'Unknown' &&
      (result.browser_family === '' || result.browser_family === void 0)) {
      result.browser_family = 'Unknown';
    }
    
    if (fixture.client.version === null && result.client.version === '') {
      fixture.client.version = '';
    }
  }
  
  let regex;
  if (result.device) {
    delete result.device.id;
    regex = result.device.regex;
    delete result.device.regex;
  }
  
  if (result.os.family !== void 0) {
    result.os_family = result.os.family;
    delete result.os.family;
    delete result.os.short_name;
  }
  if (fixture.os_family === 'Unknown' && result.os_family === void 0) {
    result.os_family = fixture.os_family;
  }
  
  expect(fixture, `${messageError} device regex: ${regex}`).
  to.
  deep.
  equal(result);
  if (result.device) {
    result.device.regex = regex;
  }
  
  if (result.device && result.device.brand) {
    expect(detector.hasBrand(result.device.brand)).
    to.
    equal(true, `brand not found from short list, ${messageError} `);
  }
};

const createTestForFile = (file) => {
  describe('file fixture ' + file, function() {
    let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
    
    let total = fixtureData.length;
    let firstTestFixture = false;
    
    const createSubTests = (fixture, forAsync = false, pos) => {
      it(pos + '/' + total, async function() {
        if (fixture['bot'] !== void 0) {
          return this.skip();
        }
        let cloneFixture = Object.assign({}, fixture);
        let headers = cloneFixture.headers;
        let meta = cloneFixture.meta;
        let clientHintData = clientHints.parse(headers, meta);
        let result = null;
        
        if (forAsync) {
          result = await detector.detectAsync(cloneFixture.user_agent,
            clientHintData);
        } else {
          result = await detector.detect(cloneFixture.user_agent,
            clientHintData);
        }
        result.user_agent = cloneFixture.user_agent;
        perryTable(cloneFixture, result);
        runTest(cloneFixture, result);
        if (!firstTestFixture) {
          testsFromFixtureDeviceMobile(result);
          firstTestFixture = true;
        }
      
      });
    };
    
    // =====
    
    describe('not used indexes', function() {
      before(() => {
        detector.deviceIndexes = false;
        detector.clientIndexes = false;
      });
      
      fixtureData.forEach((fixture, pos) => {
        normalizationFixture(fixture);
        createSubTests(fixture, false, pos);
      });
    });
    // =====
    describe('used indexes', function() {
      before(() => {
        detector.deviceIndexes = true;
        detector.clientIndexes = true;
      });
      fixtureData.forEach((fixture, pos) => {
        normalizationFixture(fixture);
        createSubTests(fixture, false, pos);
      });
    });
    
    // describe('not used indexes + async', function() {
    //   before(() => {
    //     detector.deviceIndexes = false;
    //     detector.clientIndexes = false;
    //   });
    //   fixtureData.forEach((fixture, pos) => {
    //     normalizationFixture(fixture);
    //     createSubTests(fixture, true, pos);
    //   });
    // });
    //
    // describe('used indexes + async', function() {
    //   before(() => {
    //     detector.deviceIndexes = true;
    //     detector.clientIndexes = true;
    //   });
    //   fixtureData.forEach((fixture, pos) => {
    //     normalizationFixture(fixture);
    //     createSubTests(fixture, true, pos);
    //   });
    // });
    
    // =====
  });
};

describe('tests devices', function() {
  this.timeout(TIMEOUT);
  detector.deviceAliasCode = false;
  
  ymlDeviceFiles.forEach(function(file) {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    createTestForFile(file);
  });
});

describe('tests devices clienthints-app', function() {
  createTestForFile('clienthints-app.yml');
});

describe('tests devices device-hash', function() {
  createTestForFile('device-hash.yml');
});

describe('tests devices clienthints', function() {
  createTestForFile('clienthints.yml');
});
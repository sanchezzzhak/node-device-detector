// show console petty table set env DEBUG_TABLE=true

const fs = require('fs');
const helper = require('../parser/helper');
const {should, assert, expect} = require('chai');
const {
  perryJSON,
  getFixtureFolder,
  YAMLLoad,
} = require('./functions');

const DeviceDetector = require('../index');
const DeviceHelper = require('../helper');

const TIMEOUT = 6000;
const detector = new DeviceDetector();
const fixtureFolder = getFixtureFolder();
describe('tests single parse camera', function() {
  let parser = new (require('../parser/device/camera'))();
  let fixtureData = YAMLLoad(fixtureFolder + 'device-parsers/camera.yml');
  for (let i = 0, total = fixtureData.length; i < total; i++) {
    it(i + '/' + total, function() {
      let fixture = fixtureData[i];
      let result = parser.parse(fixture.user_agent);
      delete result.id;
      expect(fixture.device).to.deep.equal(result);
    });
  }
});

describe('tests single parse console', function() {
  let parser = new (require('../parser/device/console'))();
  let fixtureData = YAMLLoad(fixtureFolder + 'device-parsers/console.yml');
  for (let i = 0, total = fixtureData.length; i < total; i++) {
    it(i + '/' + total, function() {
      let fixture = fixtureData[i];
      let result = parser.parse(fixture.user_agent);
      delete result.id;
      expect(fixture.device).to.deep.equal(result);
    });
  }
});

describe('tests single parse car', function() {
  let parser = new (require('../parser/device/car-browser'))();
  let fixtureData = YAMLLoad(fixtureFolder + 'device-parsers/car_browser.yml');
  for (let i = 0, total = fixtureData.length; i < total; i++) {
    it(i + '/' + total, function() {
      let fixture = fixtureData[i];
      let result = parser.parse(fixture.user_agent);
      delete result.id;
      expect(fixture.device).to.deep.equal(result);
    });
  }
});

describe('tests single parse nootebook', function() {
  let parser = new (require('../parser/device/notebook'))();
  let fixtureData = YAMLLoad(fixtureFolder + 'device-parsers/notebook.yml');
  for (let i = 0, total = fixtureData.length; i < total; i++) {
    it(i + '/' + total, function() {
      let fixture = fixtureData[i];
      let result = parser.parse(fixture.user_agent);
      delete result.id;
      expect(fixture.device).to.deep.equal(result);
    });
  }
});

describe('test maxUserAgentSize option', function() {
  this.timeout(TIMEOUT);
  detector.maxUserAgentSize = 10;
  expect(detector.maxUserAgentSize).to.equal(10);
  let UA = 'Mozilla/5.0 (Linux; Android 5.1; Primo ZX2 Lite) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.110 Mobile Safari/537.36';
  let result = detector.detect(UA);
  expect(result.device.model).to.equal('');
  expect(result.device.type).to.equal('');
  expect(result.device.brand).to.equal('');
  detector.maxUserAgentSize = null;
});

describe('test deviceAliasCode option', function() {
  this.timeout(TIMEOUT);
  let UA = 'Mozilla/5.0 (Linux; Android 5.1; Primo ZX2 Lite) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.110 Mobile Safari/537.36';
  it('test deviceAliasCode enable', () => {
    detector.deviceAliasCode = true;
    let result = detector.detect(UA);
    expect(result.device.code).to.equal('Primo ZX2 Lite');
  });
  it('test deviceAliasCode disable', () => {
    detector.deviceAliasCode = false;
    let result = detector.detect(UA);
    expect(result.device.code).to.equal(void 0);
  });

});

describe('tests vendor fragments', function() {
  let fixtureData = YAMLLoad(fixtureFolder + 'vendorfragments.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function() {
      let result = detector.detect(fixture.useragent);
      let messageError = 'fixture data\n' + perryJSON(fixture);
      expect(result.device.brand, messageError).to.equal(fixture.vendor);
      expect(result.device.id !== '', messageError).to.equal(true);
    });
  });
});

describe('test duplicates', function() {
  this.timeout(TIMEOUT);
  const find = (array, count = {}) => {
    array.forEach(el => count[el] ? count[el]++ : count[el] = 1);
    return Object.keys(count).filter(key => count[key] > 1);
  };

  it('brand names', () => {
    const deviceBrands = require('./../parser/device/brand-short');
    const duplicates = find(
        Object.values(deviceBrands).map(val => String(val).toLowerCase()),
    );
    expect(duplicates).to.have.lengthOf(0);
  });

  it('browser names', () => {
    const clientBrowsers = require('./../parser/client/browser-short');
    const duplicates = find(
        Object.values(clientBrowsers).map(val => String(val).toLowerCase()),
    );
    expect(duplicates).to.have.lengthOf(0);
  });
});

describe('tests detect device type', function() {
  let fixtures = YAMLLoad(fixtureFolder + 'type-methods.yml');
  fixtures.forEach((item, index) => {
    it('test ' + index, () => {
      let user_agent = item.user_agent;
      let [isBot, isMobile, isDesktop, isTablet, isTV, isWearable] = item.check;
      let result = detector.detect(user_agent);
      // skip test isBot or is type empty
      if (isBot || '' === result.device.type) {
        return;
      }
      let messageError = 'fixture data\n' + perryJSON({item, result});
      expect([
        isMobile,
        isDesktop,
        isTablet,
        isTV,
        isWearable,
      ], messageError).to.deep.equal([
        // for compatibility with matomo tests
        (DeviceHelper.isTablet(result) || DeviceHelper.isMobile(result)),
        DeviceHelper.isDesktop(result),
        DeviceHelper.isTablet(result),
        DeviceHelper.isTv(result),
        DeviceHelper.isWearable(result),
      ]);

    });
  });

});

describe('tests build by match replaces', function() {
  it('replace count', () => {
    let test = 'Device.set.0.1';
    let item = '$1-$2-$3-$4';
    let regex = /([a-z]+)\.([a-z]+)\.(\d+)\.(\d+)/i;
    let matches = regex.exec(test);
    let parser = detector.getParseClient('Browser');
    let result = parser.buildByMatch(item, matches);
    expect(result).to.equal('Device-set-0-1');
  });
});

describe('tests version truncate', function() {
  let fixtureData = YAMLLoad(fixtureFolder + 'clients/version_truncate.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function() {
      let result = detector.detect(fixture.user_agent);
      let osVersion = helper.versionTruncate(result.os.version, fixture.set);
      let clientVersion = helper.versionTruncate(
          result.client.version,
          fixture.set,
      );
      let messageError = 'fixture data\n' + perryJSON(fixture);
      expect(String(osVersion), messageError).to.equal(fixture.os_version);
      expect(String(clientVersion), messageError).
      to.
      equal(fixture.client_version);
    });
  });
});

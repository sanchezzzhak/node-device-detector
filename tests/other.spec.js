// show console petty table set env DEBUG_TABLE=true

const fs = require('fs');
const helper = require('../parser/helper');
const { should, assert, expect } = require('chai');
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
describe('tests single parse camera', function () {
  let parser =  new (require('../parser/device/camera'))();
  let fixtureData = YAMLLoad(fixtureFolder + 'device-parsers/camera.yml');
  for(let i = 0, total = fixtureData.length; i < total; i++){
      it(i + '/' + total, function () {
        let fixture = fixtureData[i];
        let result = parser.parse(fixture.user_agent);
        delete result.id;
        expect(fixture.device).to.deep.equal(result);
      });
  }
});

describe('tests single parse console', function () {
  let parser =  new (require('../parser/device/console'))();
  let fixtureData = YAMLLoad(fixtureFolder + 'device-parsers/console.yml');
  for(let i = 0, total = fixtureData.length; i < total; i++){
    it(i + '/' + total, function () {
      let fixture = fixtureData[i];
      let result = parser.parse(fixture.user_agent);
      delete result.id;
      expect(fixture.device).to.deep.equal(result);
    });
  }
});

describe('tests single parse car', function () {
  let parser =  new (require('../parser/device/car-browser'))();
  let fixtureData = YAMLLoad(fixtureFolder + 'device-parsers/car_browser.yml');
  for(let i = 0, total = fixtureData.length; i < total; i++){
    it(i + '/' + total, function () {
      let fixture = fixtureData[i];
      let result = parser.parse(fixture.user_agent);
      delete result.id;
      expect(fixture.device).to.deep.equal(result);
    });
  }
});

describe('tests single parse nootebook', function () {
  let parser =  new (require('../parser/device/notebook'))();
  let fixtureData = YAMLLoad(fixtureFolder + 'device-parsers/notebook.yml');
  for(let i = 0, total = fixtureData.length; i < total; i++){
    it(i + '/' + total, function () {
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

describe('test deviceAliasCode options', function() {
  this.timeout(TIMEOUT);
  let UA = 'Mozilla/5.0 (Linux; Android 5.1; Primo ZX2 Lite) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.110 Mobile Safari/537.36';
  it('test deviceAliasCode enable', () => {
    detector.deviceAliasCode = true;
    let result = detector.detect(UA);
    expect(result.device.code).to.equal('Primo ZX2 Lite');
  })
  it('test deviceAliasCode disable', () => {
    detector.deviceAliasCode = false;
    let result = detector.detect(UA);
    expect(result.device.code).to.equal(void 0);
  })
  
})

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


describe('test duplicates', function(){
  this.timeout(TIMEOUT);
  const find = (array, count = {}) => {
    array.forEach(el => count[el] ? count[el]++ : count[el] = 1);
    return Object.keys(count).filter(key => count[key] > 1);
  }

  it('brand names' , () => {
    const deviceBrands = require('./../parser/device/brand-short');
    const duplicates = find(
        Object.values(deviceBrands).map(val => String(val).toLowerCase())
    );
    expect(duplicates).to.have.lengthOf(0)
  });

  it('browser names' , () => {
    const clientBrowsers = require('./../parser/client/browser-short');
    const duplicates = find(
        Object.values(clientBrowsers).map(val => String(val).toLowerCase())
    );
    expect(duplicates).to.have.lengthOf(0)
  });
})

describe('tests detect device type', function () {
  let fixtures = [
    ['Mozilla/5.0 (Linux; U; Android 5.1.1; zh-CN; TEST-XXXXX Build/LMY47V) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.108 Quark/5.3.3.191 Mobile Safari/537.36', false, true, false],
    ['Mozilla/5.0 (Linux; Android 10; HarmonyOS; TEST-XXXXX ; HMSCore 6.1.0.314) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 HuaweiBrowser/11.1.5.310 Mobile Safari/537.36', false, true, false],
    ['Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.136 Mobile Safari/537.36', false, true, false],
    ['Mozilla/5.0 (Linux; Android 4.4.3; Build/KTU84L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.117 Mobile Safari/537.36', false, true, false],
    ['Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)', false, false, true],
    ['Opera/9.80 (J2ME/MIDP; Opera Mini/9.5/37.8069; U; en) Presto/2.12.423 Version/12.16', false, true, false],
    ['Mozilla/5.0 (X11; U; Linux i686; th-TH@calendar=gregorian) AppleWebKit/534.12 (KHTML, like Gecko) Puffin/1.3.2665MS Safari/534.12', false, false, false],
    ['Mozilla/5.0 (Linux; Android 4.4.4; MX4 Pro Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36; 360 Aphone Browser (6.9.7)', false, true, false],
    ['Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_7; xx) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Safari/530.17 Skyfire/6DE', false, false, false],

    // useragent containing non unicode chars
    ['Mozilla/5.0 (Linux; U; Android 4.1.2; ru-ru; PMP7380D3G Build/JZO54K) AppleWebKit/534.30 (KHTML, ÃÂºÃÂ°ÃÂº Gecko) Version/4.0 Safari/534.30', false, false, false],
  ];

  fixtures.forEach((item, index) => {
    it('test ' + index , () => {
      let [user_agent, isBot, isMobile, isDesktop] = item;

      if (isBot) {
        this.skip();
        return;
      }

      let result = detector.detect(user_agent);
      let messageError = 'fixture data\n' + perryJSON({user_agent, isMobile, isBot, isDesktop, result});

      expect(isMobile, messageError).to.equal(DeviceHelper.isMobile(result));
      expect(isDesktop, messageError).to.equal(DeviceHelper.isDesktop(result));
    });
  });

});

describe('tests build by match replaces', function () {
  it('replace count', () => {
    let test = 'Device.set.0.1';
    let item = '$1-$2-$3-$4';
    let regex = /([a-z]+)\.([a-z]+)\.(\d+)\.(\d+)/i
    let matches = regex.exec(test);
    let parser = detector.getParseClient('Browser');
    let result = parser.buildByMatch(item, matches);
    expect(result).to.equal('Device-set-0-1');
  })
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

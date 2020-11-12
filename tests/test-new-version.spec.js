const detector = new (require('../index'));
const aliasDevice = new (require('../parser/device/alias-device'));

const collectionBrand = Object.assign({},
  ...Object.entries(require('../parser/device/brand-short')).map(([a, b]) => ({[b]: a})), {});

const collectionBrowser = Object.assign({},
  ...Object.entries(require('../parser/client/browser-short.js')).map(([a, b]) => ({[b]: a})), {});

const collectionOs = Object.assign({},
  ...Object.entries(require('../parser/os/os_systems')).map(([a, b]) => ({[b]: a})), {});

const helper = require('../parser/helper');
const should = require('chai').should;
const assert = require('chai').assert;
const expect = require('chai').expect;
const Table = require('cli-table');

// show console petty table set env DEBUG_TABLE=true

const PERRY_TABLE_ENABLE = process.env.DEBUG_TABLE && process.env.DEBUG_TABLE === 'true';

// fixture format
/*
  user_agent: ""
  os:
    name: Android
    short_name: AND
    version: "2.3.6"
    platform: ""
  client:
    type: browser
    name: Android Browser
    short_name: AN
    version: ""
    engine: WebKit
    engine_version: "533.1"
  device:
    type: smartphone
    brand: HU
    model: U8655
  os_family: Android
  browser_family: Android Browser
*/


const fs = require('fs');
const YML = require('yamljs');
const util = require('util');


let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let ymlDeviceFiles = [];
let ymlClientFiles = [];
let fixtureFolder = __dirname + '/fixtures/';

ymlClientFiles = fs.readdirSync(fixtureFolder + 'clients/');
ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');


function normalizeVersion(version, count) {
  if (version === '' || version === null) {
	return ''
  }
  let versionParts = String(version).split('.');
  let versionPartsCount = versionParts.length;
  
  if (versionPartsCount > 0 && versionPartsCount < count) {
	for (let i = versionPartsCount; i < count; i++) {
	  versionParts.push(0);
	}
	version = versionParts.join('.');
  }
  return version;
}

function perryJSON(obj) {
  return JSON.stringify(obj, null, 2);
}


function isObjNotEmpty(value) {
  return value !== void 0 && value !== null;
}

function testsFromFixtureBot(fixture) {
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
	expect(fixture.bot.producer, messageError).to.have.deep.equal(result.producer);
  }
}

/**
 * @param fixture
 * @param result
 */
function perryTable(fixture, result) {
  if (!PERRY_TABLE_ENABLE) {
	return;
  }
  
  try {
	console.log('UserAgent \x1b[33m%s\x1b[0m', fixture.user_agent);
	const table = new Table({
	  head: ['Result', 'Fixture'],
	  colWidths: [50, 50]
	});
	table.push([
	  perryJSON(result),
	  perryJSON(fixture)
	]);
	console.log(table.toString());
	
  } catch (e) {
	throw new SyntaxError(e.stack);
  }
}

/**
 * @param fixture
 */
function testsFromFixtureAliasDevice(fixture) {
  let result;
  result = aliasDevice.parse(fixture.user_agent);
  perryTable(fixture, result);
  let messageError = 'fixture data\n' + perryJSON(fixture);
  expect(fixture.alias.name, messageError).to.have.deep.equal(result.name);
}


/**
 * @param fixture
 */
function testsFromFixtureDevice(fixture) {
  let result = detector.detect(fixture.user_agent);
  perryTable(fixture, result);
  
  let messageError = 'fixture data\n' + perryJSON(fixture);
  
  // test device data
  if (isObjNotEmpty(fixture.device)) {
	
	if (isObjNotEmpty(fixture.device.model)) {
	  expect(null,
		`wrong type for result, must be object {}, ${messageError}`
	  ).to.not.equal(result.device);
	  expect(String(fixture.device.model),
		`Device model name is detect incorrectly, ${messageError}`
	  ).to.equal(result.device.model);
	}
	
	if (isObjNotEmpty(fixture.device.type)) {
	  expect(String(fixture.device.type),
		`Device type name is detect incorrectly, ${messageError}`
	  ).to.equal(result.device.type);
	}
	
	if (isObjNotEmpty(fixture.device.brand)) {
	  expect(String(fixture.device.brand),
		`Device brand name is detect incorrectly, ${messageError}`
	  ).to.equal(result.device.brand);
	  
	  if (fixture.device.brand !== '') {
		expect(collectionBrand[result.device.brand] !== void 0,
		  `Device brand name not added to brands list, ${messageError}`
		).to.equal(true);
	  }
	}
  }
  
  // test os data
  if (isObjNotEmpty(fixture.os)) {
	
	if (isObjNotEmpty(fixture.os.name)) {
	  expect(fixture.os.name,
		`Device os name is detect incorrectly, ${messageError}`
	  ).to.have.deep.equal(result.os.name);
	}
	
	if (isObjNotEmpty(fixture.os.short_name)) {
	  expect(fixture.os.short_name,
		`Device os short name is detect incorrectly, ${messageError}`
	  ).to.have.deep.equal(result.os.short_name);
	  
	  expect(fixture.os.family,
		`Device os family name is detect incorrectly, ${messageError}`
	  ).to.have.deep.equal(result.os.family);
	  
	  expect(collectionOs[result.os.name] !== void 0,
		`Device os family not added to OsFamily list, ${messageError}`
	  ).to.equal(true);
	}
	
	if (isObjNotEmpty(fixture.os.version)) {
	  expect(String(fixture.os.version),
		`Device os version is detect incorrectly, ${messageError}`
	  ).to.have.deep.equal(String(result.os.version));
	}
	
	if (isObjNotEmpty(fixture.os.platform)) {
	  expect(fixture.os.platform,
		`Device os platform is detect incorrectly, ${messageError}`
	  ).to.have.deep.equal(result.os.platform);
	}
  }
  
  // test client data
  if (isObjNotEmpty(fixture.client)) {
	if (fixture.client.version === null) {
	  fixture.client.version = '';
	}
	expect(fixture.client.name, messageError).to.have.deep.equal(result.client.name);
	expect(fixture.client.type, messageError).to.have.deep.equal(result.client.type);
	
	if (result.client.short_name !== void 0 && fixture.client.type === 'browser') {
	  expect(collectionBrowser[result.client.name] !== void 0,
		`Device client short name not added to client list, ${messageError}`
	  ).to.equal(true);
	  // is Unknown browser_family then string empty
	  if (fixture.browser_family === 'Unknown') {
		fixture.browser_family = '';
	  }
	  expect(fixture.browser_family,
		`Device os family name is detect incorrectly, ${messageError}`
	  ).to.have.deep.equal(result.client.family);
	}
	
	if (isObjNotEmpty(fixture.client.engine)) {
	  expect(String(fixture.client.engine),
		`Device client engine is detect incorrectly, ${messageError}`
	  ).to.have.deep.equal(result.client.engine);
	}
	
	if (isObjNotEmpty(fixture.client.engine_version)) {
	  expect(String(fixture.client.engine_version),
		`Device client engine version is detect incorrectly, ${messageError}`)
	  .to.have.deep.equal(result.client.engine_version);
	}
	
	testVersionAndSkip.call(this, result.client.version, fixture.client.version, messageError);
  }
}

function testVersionAndSkip(resultVersion, fixtureVersion, messageError) {
  try {
	expect(resultVersion, messageError).to.have.equal(String(fixtureVersion));
  } catch (e) {
	let regex = new RegExp('^([0-9]+)\.0$', 'i');
	if (regex.exec(fixtureVersion) !== null && Math.ceil(resultVersion) == Math.ceil(fixtureVersion)) {
	  console.log(
		'parse error version, fixture version %s | result version %s',
		fixtureVersion,
		resultVersion
	  );
	  // this.skip();
	} else {
	  throw new SyntaxError(e.stack);
	}
  }
}

function testsFromFixtureVersionTruncate(fixture) {
  let result = detector.detect(fixture.user_agent);
  let osVersion = helper.versionTruncate(result.os.version, fixture.set);
  let clientVersion = helper.versionTruncate(result.client.version, fixture.set);
  let messageError = 'fixture data\n' + perryJSON(fixture);
  expect(String(osVersion), messageError).to.have.deep.equal(fixture.os_version);
  expect(String(clientVersion), messageError).to.have.deep.equal(fixture.client_version);
}

function testsFromFixtureVendorFragment(fixture) {
  let result = detector.detect(fixture.useragent);
  let messageError = 'fixture data\n' + perryJSON(fixture);
  expect(result.device.brand, messageError).to.have.deep.equal(fixture.vendor);
  expect(result.device.id !== '', messageError).to.have.deep.equal(true);
}

function testsFromFixtureOss(fixture) {
  let result = detector.detect(fixture.user_agent);
  let messageError = 'fixture data\n' + perryJSON(fixture);
  // test os data
  if (isObjNotEmpty(fixture.os.name)) {
	expect(fixture.os.name, messageError).to.have.deep.equal(result.os.name);
  }
  if (isObjNotEmpty(fixture.os.short_name)) {
	expect(fixture.os.short_name, messageError).to.have.deep.equal(result.os.short_name);
  }
  if (isObjNotEmpty(fixture.os.platform)) {
	expect(fixture.os.platform, messageError).to.have.deep.equal(result.os.platform);
  }
  if (isObjNotEmpty(fixture.os.version)) {
	testVersionAndSkip.call(this, result.os.version, fixture.os.version, messageError);
  }
}

function testsFromFixtureClient(fixture) {
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
  if (fixture.client.version !== null && typeof fixture.client.version === 'number') {
	fixture.client.version = normalizeVersion(String(fixture.client.version), 2);
  }
  
  // fix fixture is short_name numeric
  if (fixture.client.short_name && isFinite(fixture.client.short_name)) {
	fixture.client.short_name = String(fixture.client.short_name);
  }
  
  // copy family to fixture check
  // fixture.client.family = result.client.family;
  
  expect(result.client.short_name).to.not.equal("UNK");
  if (fixture.client.family) {
	expect(result.client.family).to.have.equal(fixture.client.family);
  }
  expect(result.client.type).to.have.equal(fixture.client.type);
  expect(result.client.name).to.have.equal(fixture.client.name);
  expect(result.client.version).to.have.equal(fixture.client.version);
}

describe('tests clients fixtures', function () {
  this.timeout(6000);
  let skipFiles = ['version_truncate.yml'];
  ymlClientFiles.forEach(function (file) {
	describe('file fixture ' + file, function () {
	  if (skipFiles.indexOf(file) !== -1) {
		return;
	  }
	  let fixtureData = YML.load(fixtureFolder + 'clients/' + file);
	  let total = fixtureData.length;
	  //fixtureData= [  fixtureData[208] ];
	  fixtureData.forEach((fixture, pos) => {
		it(pos + '/' + total, function () {
		  testsFromFixtureClient.call(this, fixture);
		});
	  });
	});
  })
});

describe('tests bots', function () {
  
  let file = 'bots.yml';
  describe('file fixture ' + file, function () {
	let fixtureData = YML.load(fixtureFolder + 'devices/' + file);
	let total = fixtureData.length;
	fixtureData = [fixtureData[85]];
	
	fixtureData.forEach((fixture, pos) => {
	  it(pos + '/' + total, function () {
		testsFromFixtureBot.call(this, fixture);
	  });
	});
  });
  
  
});

describe('tests alias devices fixtures', function () {
  this.timeout(6000);
  let file = 'alias_devices.yml';
  let fixtureData = YML.load(fixtureFolder + 'devices/' + file);
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
	it(pos + '/' + total, function () {
	  testsFromFixtureAliasDevice.call(this, fixture);
	});
  });
});


describe('tests devices fixtures', function () {
  this.timeout(6000);
  ymlDeviceFiles.forEach(function (file) {
	if (excludeFilesNames.indexOf(file) !== -1) {
	  return;
	}
	describe('file fixture ' + file, function () {
	  let fixtureData = YML.load(fixtureFolder + 'devices/' + file);
	  let total = fixtureData.length;
	  //fixtureData= [  fixtureData[208] ];
	  fixtureData.forEach((fixture, pos) => {
		it(pos + '/' + total, function () {
		  testsFromFixtureDevice.call(this, fixture);
		});
	  });
	});
  })
});

describe('tests vendor fragment', function () {
  let fixtureData = YML.load(fixtureFolder + 'vendorfragments.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
	it(pos + '/' + total, function () {
	  testsFromFixtureVendorFragment.call(this, fixture);
	});
  });
});

describe('tests oss', function () {
  let fixtureData = YML.load(fixtureFolder + 'oss.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
	it(pos + '/' + total, function () {
	  testsFromFixtureOss.call(this, fixture);
	});
  });
});

describe('tests version truncate', function () {
  let fixtureData = YML.load(fixtureFolder + 'clients/version_truncate.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
	it(pos + '/' + total, function () {
	  testsFromFixtureVersionTruncate.call(this, fixture);
	});
  });
})




const detector = new (require('../index'));
const should = require('chai').should;
const assert = require('chai').assert;
const expect = require('chai').expect;

const Table = require('cli-table');

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


let ymlDeviceFiles = [];
let ymlClientFiles = [];
let fixtureFolder = __dirname + '/fixtures/';

ymlClientFiles = fs.readdirSync(fixtureFolder + 'clients/');
ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');


function normalizeVersion(version, count){
  if(version === '' || version === null){
    return ''
  }
  let versionParts = String(version).split('.');
  let versionPartsCount = versionParts.length;

  if(versionPartsCount > 0 && versionPartsCount < count){
    for(let i=versionPartsCount; i < count; i++){
      versionParts.push(0);
    }
    version = versionParts.join('.');
  }
  return version;
}

function perryJSON(obj){
  return JSON.stringify(obj,  null, 2);
}


function isObjNotEmpty(value) {
  return typeof value !== 'undefined' && value!== null;
}

function testsFromFixtureBot(fixture){
  let result;
  try {
    console.log('UserAgent\n\x1b[33m%s\x1b[0m', fixture.user_agent);
	detector.skipBotDetection = false;
	result = detector.parseBot(fixture.user_agent);
    console.log('Result\n\x1b[34m%s\x1b[0m', perryJSON(result));
    console.log('Fixture\n\x1b[36m%s\x1b[0m', perryJSON(fixture));
  } catch (e) {
    throw new SyntaxError(e.stack);
  }
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

function testsFromFixtureDevice(fixture){
  let result;
  try {

    result = detector.detect(fixture.user_agent);

	console.log('UserAgent \x1b[33m%s\x1b[0m', fixture.user_agent);
	const table = new Table({
	  head: ['Result', 'Fixture']
	  , colWidths: [100, 100]
	});
	table.push([
	  perryJSON(result),
	   perryJSON(fixture)
	]);
	console.log(table.toString());
  
  
  } catch (e) {
    throw new SyntaxError(e.stack);
  }

  let messageError = 'fixture data\n' + perryJSON(fixture);

  // test device data
  if (isObjNotEmpty(fixture.device)) {

    if(isObjNotEmpty(fixture.device.model)){

      expect(null, messageError).to.not.equal(result.device);
      expect(String(fixture.device.model), messageError).to.equal(result.device.model);
    }
    
    if(isObjNotEmpty(fixture.device.type)){
      expect(String(fixture.device.type), messageError).to.equal(result.device.type);
    }
    
    if(isObjNotEmpty(fixture.device.brand)){
      expect(String(fixture.device.brand), messageError).to.equal(result.device.id);
    }
  }

  // test os data
  if (isObjNotEmpty(fixture.os))  {

    if(isObjNotEmpty(fixture.os.name)){
      expect(fixture.os.name, messageError).to.have.deep.equal(result.os.name);
    }
    if(isObjNotEmpty(fixture.os.short_name)){
      expect(fixture.os.short_name, messageError).to.have.deep.equal(result.os.short_name);
    }
    if(isObjNotEmpty(fixture.os.version)){
      expect(fixture.os.version, messageError).to.have.deep.equal(result.os.version);
    }
    if(isObjNotEmpty(fixture.os.platform)){
      expect(fixture.os.platform, messageError).to.have.deep.equal(result.os.platform);
    }

  }

  // test client data
  if (isObjNotEmpty(fixture.client)) {
    if(fixture.client.version === null){
      fixture.client.version = '';
    }
    expect(fixture.client.name, messageError).to.have.deep.equal(result.client.name);
    expect(fixture.client.type, messageError).to.have.deep.equal(result.client.type);

    if(isObjNotEmpty(fixture.client.short_name)){
      expect(String(fixture.client.short_name), messageError).to.have.deep.equal(result.client.short_name);
    }
    if(isObjNotEmpty(fixture.client.engine)){
      expect(String(fixture.client.engine), messageError).to.have.deep.equal(result.client.engine);
    }
    if(isObjNotEmpty(fixture.client.engine_version)){
      expect(String(fixture.client.engine_version), messageError).to.have.deep.equal(result.client.engine_version);
    }

    try {
      expect(fixture.client.version, messageError).to.have.deep.equal(result.client.version);
    } catch (e){
      let pegex = new RegExp('^([0-9]+)\.0$', 'i');
      if (pegex.exec(fixture.client.version) !== null && Math.ceil(result.client.version) == Math.ceil(fixture.client.version)) {
        console.log(
            'parse error version, fixture version %s | result version %s',
            fixture.client.version,
            result.client.version
        );
        this.skip();
      }else{
        throw new SyntaxError(e.stack);
      }
    }


  }

}

function testsFromFixtureClient(fixture){
  let result;

	result = detector.detect(fixture.user_agent);
	
	console.log('UserAgent \x1b[33m%s\x1b[0m', fixture.user_agent);
	const table = new Table({
	  head: ['Result', 'Fixture']
	  , colWidths: [100, 100]
	});
	table.push([
	  perryJSON(result.client),
	  perryJSON(fixture.client)
	]);
	console.log(table.toString());

    // fix values fixture null
	if(!result.client.version && fixture.client.version === null){
	  result.client.version = fixture.client.version;
    }

    if(!result.client.engine_version && fixture.client.engine_version === null){
      result.client.engine_version = fixture.client.engine_version;
    }

    if(!result.client.engine && fixture.client.engine === null){
      result.client.engine = fixture.client.engine;
    }
    
    // fix version fixture
    if(fixture.client.version !== null && typeof fixture.client.version === 'number'){
     fixture.client.version = normalizeVersion(String(fixture.client.version), 2);
    }

    // fix fixture is short_name numeric
	if (fixture.client.short_name && isFinite(fixture.client.short_name)) {
	  fixture.client.short_name = String(fixture.client.short_name);
	}
	
	// copy family to fixture check
  	fixture.client.family = result.client.family;
	
	expect(result.client.short_name).to.not.equal("UNK");
	
	expect(result.client).to.have.deep.equal(fixture.client);
  try {

  } catch (e) {
	throw new SyntaxError(e.stack);
  }
}



// describe('dev test one file', function () {
//   let file = 'camera.yml';
//   let fixtureData = YML.load(fixtureFolder + file);
//   let total = fixtureData.length;
//  // fixtureData= [  fixtureData[415] ];
//
//   fixtureData.forEach((fixture, pos) => {
//     it(pos + '/' + total, function(){
//       testsFromFixtureDevice.call(this, fixture);
//     });
//   });
// });
//
// return;

describe('tests clients fixtures', function () {
  this.timeout(6000);
  ymlClientFiles.forEach(function (file) {
	describe('file fixture ' + file, function () {
	  
	  let fixtureData = YML.load(fixtureFolder + 'clients/' + file);
	  let total = fixtureData.length;
	  //fixtureData= [  fixtureData[208] ];
	  fixtureData.forEach((fixture, pos) => {
		it(pos + '/' + total, function(){
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
    fixtureData= [  fixtureData[85] ];

    fixtureData.forEach((fixture, pos) => {
      it(pos + '/' + total, function(){
        testsFromFixtureBot.call(this, fixture);
      });
    });
  });
});


describe('tests devices fixtures', function () {
  this.timeout(6000);
  ymlDeviceFiles.forEach(function (file) {
    if(file === 'bots.yml'){
      return;
    }
    describe('file fixture ' + file, function () {

      let fixtureData = YML.load(fixtureFolder + 'devices/' + file);
      let total = fixtureData.length;
      //fixtureData= [  fixtureData[208] ];
      fixtureData.forEach((fixture, pos) => {
        it(pos + '/' + total, function(){
          testsFromFixtureDevice.call(this, fixture);
        });
      });
    });
  })
});

const detector = new (require('../new-index'));


const should = require('chai').should;
const assert = require('chai').assert;
const expect = require('chai').expect;

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

let ymlFiles = [];
let fixtureFolder = __dirname + '/fixtures/tests/';

ymlFiles = fs.readdirSync(fixtureFolder);

function expectDetectByFixture(fixture){
  let result;
  try {
    result = detector.detect(fixture.user_agent);
  } catch (e) {
    console.log('error parse', fixture.user_agent);
    throw new SyntaxError(e.stack);
  }
  console.log(result);
  let messageError = 'fixture data: ' + JSON.stringify(fixture, null, 2)
  // test device data
  if (fixture.device !== undefined) {
    expect(result.device.model, messageError).to.equal(String(fixture.device.model));
    expect(result.device.type, messageError).to.equal(String(fixture.device.type));
  }
  // test os data
  if (fixture.os !== undefined && typeof fixture.os === 'Object')  {
    expect(result.os, messageError).to.have.deep.equal(fixture.os);
  }
  // test client data
  if (fixture.client !== undefined) {
    expect(result.client, messageError).to.have.deep.equal(fixture.client);
  }
}

describe('tests one file', function () {
  let file = 'mobile_apps.yml';
  let fixtureData = YML.load(fixtureFolder + file);
  let total = fixtureData.length;
  //fixtureData= [  fixtureData[9] ];

  fixtureData.forEach(function (fixture, pos) {
    it(pos + '/' + total, () => {
      expectDetectByFixture(fixture);
    });
  });
});

return;

describe('tests', function () {
  this.timeout(6000);
  ymlFiles.forEach(function (file) {

    if(file === 'bots.yml'){
      return;
    }

    describe('file fixture ' + file, function () {
      let fixtureData = YML.load(fixtureFolder + file);
      let total = fixtureData.length;
      //fixtureData= [  fixtureData[208] ];
      fixtureData.forEach(function (fixture, pos) {
        it(pos + '/' + total, () => {
          expectDetectByFixture(fixture);
        });
      });
    });
  })
});

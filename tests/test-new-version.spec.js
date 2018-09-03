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



  let messageError = 'fixture data: ' + JSON.stringify(fixture, null, 2);

  // test device data
  if (fixture.device !== undefined && fixture.device!==null && result.device!==null) {

    if(fixture.device.model!==null){
      expect(result.device.model, messageError).to.equal(String(fixture.device.model));
    }
    if(fixture.device.type!==null){
      expect(result.device.type, messageError).to.equal(String(fixture.device.type));
    }
  }



  // test os data
  if (fixture.os !== undefined && typeof fixture.os !== null && fixture.os.length > 0)  {

    if(fixture.os.name!==null){
      expect(fixture.os.name, messageError).to.have.deep.equal(result.os.name);
    }
    if(fixture.os.short_name!==null){
      expect(fixture.os.short_name, messageError).to.have.deep.equal(result.os.short_name);
    }
    if(fixture.os.version!==null){
      expect(fixture.os.version, messageError).to.have.deep.equal(result.os.version);
    }
    if(fixture.os.platform!==null){
      expect(fixture.os.platform, messageError).to.have.deep.equal(result.os.platform);
    }

  }
  // test client data
  if (fixture.client!== null && fixture.client !== undefined) {
    if(fixture.client.version === null){
      fixture.client.version = '';
    }
    expect(result.client, messageError).to.have.deep.equal(fixture.client);
  }
}
//
// describe('tests one file', function () {
//   let file = 'feed_reader.yml';
//   let fixtureData = YML.load(fixtureFolder + file);
//   let total = fixtureData.length;
//   //fixtureData= [  fixtureData[23] ];
//
//   fixtureData.forEach(function (fixture, pos) {
//     it(pos + '/' + total, () => {
//       expectDetectByFixture(fixture);
//     });
//   });
// });
//
// return;

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

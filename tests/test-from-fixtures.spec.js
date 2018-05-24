const detector = new (require('../index'));


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


describe('tests from fixtures' , function () {
    this.timeout(6000);


    ymlFiles.forEach(function(file) {
        describe('file fixture ' + file, function(){
            let fixtureData = YML.load(fixtureFolder + file);
            let total = fixtureData.length;
            fixtureData.forEach(function (fixture, pos) {
                it(pos + '/' + total, () => {
                    let result;
                    try {
                        result = detector.detect(fixture.user_agent);
                    } catch (e){
                        console.log('error parse', fixture.user_agent);
                        throw new SyntaxError(e.stack);
                    }
                    let messageError = 'fixture data: ' + JSON.stringify(fixture, null, 2)

                    expect(result.device.model, messageError).to.equal(String(fixture.device.model));
                    expect(result.device.type, messageError).to.equal(String(fixture.device.type));

                    expect(result.os, messageError).to.deep.equal({
                        name: fixture.os.name,
                        version: fixture.os.version,
                    });

                    expect(result.browser, messageError).to.deep.equal({
                        name: fixture.client.name,
                        version: fixture.client.version,
                    });
                })
            });

        });
    })


});

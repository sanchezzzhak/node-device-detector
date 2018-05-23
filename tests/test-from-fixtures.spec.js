const detector = new (require('../index'));


const should = require('chai').should;
const assert = require('chai').assert;
const expect = require('chai').expect;

//
const fs = require('fs');
const YML = require('yamljs');

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
                    let result = detector.detect(fixture.user_agent);
                    console.log(result);

                })
            });

        });
    })


});

// show console petty table set env DEBUG_TABLE=true

const fs = require('fs');
const helper = require('../parser/helper');
const {should, assert, expect} = require('chai');
const {
  perryJSON,
  perryTable,
  isObjNotEmpty,
  getFixtureFolder,
  normalizeVersion,
  YAMLLoad,
} = require('./functions');

const DeviceDetector = require('../index');
const TIMEOUT = 6000;
const detector = new DeviceDetector();
let fixtureFolder = getFixtureFolder();
let ymlClientFiles = fs.readdirSync(fixtureFolder + 'clients/');

describe('tests clients', function () {
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
          let messageError = 'fixture data\n' + perryJSON(fixture);
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

          if (result.client.short_name) {
            expect(result.client.short_name, messageError).to.not.equal('UNK');
            delete result.client.short_name;
          }

          if (fixture.client && fixture.client.family === null) {
            fixture.client.family = '';
          }
          expect(fixture.client, messageError).to.deep.equal(result.client);
        });
      });
    });
  });
});
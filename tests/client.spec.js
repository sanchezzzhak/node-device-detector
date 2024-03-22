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
const ClientHints = require('../client-hints');
const CLIENT_TYPE = require('../parser/const/client-type');
const CLIENT_PARSER = require('../parser/const/client-parser');
const TIMEOUT = 6000;
const detector = new DeviceDetector();
const clientHint = new ClientHints();
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
      fixtureData.forEach((fixture, pos) => {
        it(pos + '/' + total, function () {
          let clientHintData = clientHint.parse(fixture.headers || {});
          let fixtureClientType = fixture.client.type ?? '';
          let cleint = {};

          switch (fixtureClientType) {
            case CLIENT_TYPE.LIBRARY:
              cleint = detector.getParseClient(CLIENT_PARSER.LIBRARY).parse(fixture.user_agent, clientHintData)
              break;
            case CLIENT_TYPE.BROWSER:
              cleint = detector.getParseClient(CLIENT_PARSER.BROWSER).parse(fixture.user_agent, clientHintData)
              break;
            default:
              cleint = detector.detect(fixture.user_agent, clientHintData).client;
              break;
          }

          let messageError = 'fixture data\n' + perryJSON(fixture);
          perryTable(fixture, cleint);


          // fix values fixture null
          if (cleint.version === '' && fixture.client.version === null) {
            cleint.version = fixture.client.version;
          }

          if (!cleint.engine_version && fixture.client.engine_version === null) {
            cleint.engine_version = fixture.client.engine_version;
          }

          if (!cleint.engine && fixture.client.engine === null) {
            cleint.engine = fixture.client.engine;
          }

          // fix version fixture
          if (fixture.client.version !== null && typeof fixture.client.version === 'number') {
            fixture.version = String(fixture.client.version);
          }

          if (cleint.short_name) {
            expect(cleint.short_name, messageError).to.not.equal('UNK');
            delete cleint.short_name;
          }

          if (fixture.client && fixture.client.family === null) {
            fixture.client.family = '';
          }

          expect(fixture.client, messageError).to.deep.equal(cleint);
        });
      });
    });
  });
});
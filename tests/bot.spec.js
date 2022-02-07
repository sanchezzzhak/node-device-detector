
const DeviceDetector = require('../index');
const fs = require('fs');
const { should, assert, expect } = require('chai');
const {
  perryJSON,
  perryTable,
  YAMLLoad,
  getFixtureFolder,
  isObjNotEmpty
} = require('./functions');

const TIMEOUT = 5000;
const detector = new DeviceDetector();
const fixtureFolder = getFixtureFolder();

describe('tests bots', function () {
  let file = 'bots.yml';
  describe('file fixture ' + file, function () {
    let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
    let total = fixtureData.length;

    fixtureData.forEach((fixture, pos) => {
      it(pos + '/' + total, function () {
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
          expect(fixture.bot.producer, messageError).to.have.deep.equal(
              result.producer
          );
        }
      });
    });
  });
});
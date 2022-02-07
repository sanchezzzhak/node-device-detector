const AliasDevice = require('../parser/device/alias-device');
const fs = require('fs');
const { should, assert, expect } = require('chai');
const {
  perryJSON,
  perryTable,
  YAMLLoad,
  getFixtureFolder,
} = require('./functions');

const TIMEOUT = 5000;
const aliasDevice = new AliasDevice();
const fixtureFolder = getFixtureFolder();

describe('tests alias devices', function () {
  this.timeout(TIMEOUT);
  let file = 'alias_devices.yml';
  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function () {
      let result = aliasDevice.parse(fixture.user_agent);
      perryTable(fixture, result);
      let messageError = 'fixture data\n' + perryJSON(fixture);
      expect(fixture.alias.name, messageError).to.deep.equal(result.name);
    });
  });
});
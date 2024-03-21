const fs = require('fs');
const InfoDevice = require('../parser/device/info-device');
const DeviceDetector = require('../index');
const ClientHint = require('../client-hints');
const DeviceHelper = require('../helper');
const {YAMLLoad, getFixtureFolder, perryJSON} = require('./functions');
const {should, assert, expect} = require('chai');

let ymlDeviceInfoFiles = fs.readdirSync(getFixtureFolder() + 'devices-trusted/');

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceAliasCode: true,
  deviceIndexes: true,
  deviceTrusted: true,
  deviceInfo: false,
});
const clientHint = new ClientHint();

const infoDevice = new InfoDevice();
const TIMEOUT = 6000;

describe('test trusted devices', function() {
  this.timeout(TIMEOUT);

  ymlDeviceInfoFiles.forEach(function(file) {
    describe('file fixture ' + file, function() {
      let fixtureData = YAMLLoad(getFixtureFolder() + 'devices-trusted/' + file);
      let total = fixtureData.length;
      fixtureData.forEach((fixture, pos) => {
        let inName = (fixture.device.brand ?? '') + ' - ' +  (fixture.device.model ?? '');
        it(`${pos}/${total}: ${inName}`, function() {
          let result = detector.detect(fixture.user_agent, clientHint.parse(fixture.headers, fixture.meta));
          let messageError = 'fixture data\n' + perryJSON(fixture) + '\nresult\n' + perryJSON(result)
          if (result.device && result.device.id) {
            delete result.device.id;
          }
          expect(fixture.device, messageError).to.deep.equal(result.device);
        });

      });

    });
  });
});
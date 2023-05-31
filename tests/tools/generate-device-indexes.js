/**
 * Generate indexes by fixtures
 */

const fs = require('fs');
const {YAMLLoad, YAMLDump, getFixtureFolder} = require('./../functions');
const aliasDevice = new (require('../../parser/device/alias-device'))();
aliasDevice.setReplaceBrand(false);

const detector = new (require('../../index'))({
  deviceIndexes: false,
  clientIndexes: false,
});

let parserDevice = detector.getParseDevice('Mobile');

let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let fixtureFolder = getFixtureFolder();
ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');

const output = {};
const collection = {};
let iterator = 0;
for (let cursor in parserDevice.collection) {
  const brandId = parserDevice.getBrandIdByName(cursor);
  collection[brandId] = Number(iterator++);
}
const createIndexForFixture = (fixture) => {
  let result = aliasDevice.parse(fixture.user_agent);
  let deviceCode = result.name ? result.name : void 0;
  if (deviceCode !== void 0) {
    deviceCode = deviceCode.toLowerCase();
    let infos = parserDevice.parseAll(fixture.user_agent);
    if (infos.length === 0) {
      return;
    }
    if (output[deviceCode] === void 0) {
      output[deviceCode] = [];
    }
    for (let info of infos) {
      if (info.id !== '' && output[deviceCode].indexOf(info.id) === -1) {
        output[deviceCode].push(info.id);
        // sort by cursor position
        if (output[deviceCode].length > 1) {
          output[deviceCode].sort((a, b) => {
            return collection[a] - collection[b];
          });
        }
      }
    }
  }

};

ymlDeviceFiles.forEach((file) => {
  if (excludeFilesNames.indexOf(file) !== -1) {
    return;
  }
  console.log('create indexes for file: ', 'devices/' + file);
  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  fixtureData.forEach((fixture) => {
    createIndexForFixture(fixture);
  });
});

let content = YAMLDump(output);

fs.writeFileSync(
    __dirname + '/../../regexes/device-index-hash.yml',
    content,
    'utf8',
);

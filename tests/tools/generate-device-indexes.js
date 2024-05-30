/**
 * Generate indexes from fixtures
 */
const fs = require('fs');
const {YAMLLoad, YAMLDump, getFixtureFolder} = require('./../functions');
const DeviceDetector = require('../../index');
const ClientHints = require('../../client-hints');
const { Command } = require('commander');
const chalk = require('chalk');

const deviceDetector = new DeviceDetector({
  deviceIndexes: false,
  clientIndexes: false,
});
const parserClientHints = new ClientHints();
const parserAliasDevice = deviceDetector.getParseAliasDevice();
parserAliasDevice.setReplaceBrand(false);

let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let fixtureFolder = getFixtureFolder();
let parserDevice = deviceDetector.getParseDevice('Mobile');
let ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');

/*** @type {{}} - hash array of device devices*/
const output = {};
/*** @type {{}}  - ash array of device brands */
const collection = {};
let iterator = 0;
for (let cursor in parserDevice.collection) {
  const brandId = parserDevice.getBrandIdByName(cursor);
  collection[brandId] = Number(iterator++);
}
/**
 * Creates an index based on a fixture entry from test
 * @param {Object} fixture
 */
const createIndexFromFixture = (fixture) => {
  let result = parserAliasDevice.parse(fixture.user_agent);
  let clientHintData = {};
  if (fixture.headers) {
    clientHintData = parserClientHints.parse(fixture.headers);
  }
  let deviceCode = result.name ? result.name : clientHintData?.device?.model ?? void 0;
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

const program = new Command();
program.description(`==========================================================
  This is a working file for creating device indexes.
  Usages:
  $> node generate-device-indexes.js  
==========================================================`);
program.action(function(){
  ymlDeviceFiles.forEach((file) => {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    console.log(chalk.green('create indexes from file: ' + 'devices/' + file));
    let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file)
    let total = fixtureData.length;

    fixtureData.forEach((fixture, pos) => {
      createIndexFromFixture(fixture);
      const deviceMsg = `${fixture?.device?.brand ?? 'unknown'} - ${fixture?.device?.model ?? 'unknown'}`;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(chalk.blue(`${pos}/${total} ${deviceMsg}`));
      process.stdout.cursorTo(0);
    });
    process.stdout.clearLine();
  });

  fs.writeFileSync(
    __dirname + '/../../regexes/device-index-hash.yml',
    YAMLDump(output),
    'utf8',
  );
})
program.parse(process.argv);

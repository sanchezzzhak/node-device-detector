/**
 * Generate indexes from fixtures
 */
const fs = require('fs');
const {YAMLLoad, YAMLDump, getFixtureFolder, getRegexesFolder, sortAsc } = require('./../functions');
const DeviceDetector = require('../../index');
const ClientHints = require('../../client-hints');
const { Command } = require('commander');
const chalk = require('chalk');
const ArrayPath = require('../../lib/array-path');

const { splitOsUserAgent, } = require('./../../parser/helper');
const { matchUserAgent, splitUserAgent } = require('../../parser/helper');
const CLIENT_TYPES = require('../../parser/const/client-type');

const fixtureFolder = getFixtureFolder();
const regexesFolder = getRegexesFolder();

const excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
const ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');


const createOsIndexes = () => {
  const output = {};

  const databases = YAMLLoad(regexesFolder + 'oss.yml');

  const findDataIndex = (userAgent) => {
    for (let i = 0, l = databases.length; i < l; i++) {
      let result = matchUserAgent(databases[i].regex, userAgent);
      if (result !== null) {
        return i;
      }
    }
    return null;
  };

  const createIndexForFixture = (fixture) => {
    const userAgent = fixture.user_agent;
    const splitData = splitOsUserAgent(userAgent);
    if (String(splitData.hash) === '0') {
      console.log({userAgent, splitData})
      return;
    }
    const keyName = splitData.hash;
    if (output[keyName] === void 0) {
      output[keyName] = [];
    }
    const index = findDataIndex(userAgent);

    if (!output[keyName].includes(index)) {
      output[keyName].push(index);
      output[keyName].sort(sortAsc);
    }
  }

  console.log('create os indexes')

  ymlDeviceFiles.forEach((file) => {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    console.log(chalk.green('create indexes from file: ' + 'devices/' + file));
    const fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
    const total = fixtureData.length;

    fixtureData.forEach((fixture, pos) => {
      const ua = fixture['user_agent'] ?? '------'
      createIndexForFixture(fixture);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(chalk.blue(`${pos}/${total} ${ua}`));
      process.stdout.cursorTo(0);

    });
    process.stdout.clearLine();
  });


  fs.writeFileSync(
    regexesFolder + 'os-index-hash.js',
    `module.exports = ${JSON.stringify(output, null, 2)};\n`,
    'utf8'
  );
}

const createClientIndexes = () => {
  const databases = {};
  databases[CLIENT_TYPES.BROWSER] = YAMLLoad(regexesFolder + 'client/browsers.yml');
  databases[CLIENT_TYPES.MOBILE_APP] = YAMLLoad(regexesFolder + 'client/mobile_apps.yml');
  databases[CLIENT_TYPES.LIBRARY] = YAMLLoad(regexesFolder + 'client/libraries.yml');
  databases[CLIENT_TYPES.MEDIA_PLAYER] = YAMLLoad(regexesFolder + 'client/mediaplayers.yml');
  databases[CLIENT_TYPES.FEED_READER] = YAMLLoad(regexesFolder + 'client/feed_readers.yml');
  databases[CLIENT_TYPES.PIM] = YAMLLoad(regexesFolder + 'client/pim.yml');

  const appFixtureData = YAMLLoad(fixtureFolder + 'clients/mobile_app.yml');
  const browserFixtureData = YAMLLoad(fixtureFolder + 'clients/browser.yml');
  const mediaplayerFixtureData = YAMLLoad(fixtureFolder + 'clients/mediaplayer.yml');
  const libraryFixtureData = YAMLLoad(fixtureFolder + 'clients/library.yml');
  const readerFixtureData = YAMLLoad(fixtureFolder + 'clients/feed_reader.yml');
  const pimFixtureData = YAMLLoad(fixtureFolder + 'clients/pim.yml');
  const output = {};
  const excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
  const ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');

  const CLIENT_TYPES_MAP = {}
  CLIENT_TYPES_MAP[CLIENT_TYPES.BROWSER] = 0;
  CLIENT_TYPES_MAP[CLIENT_TYPES.MOBILE_APP] = 1;
  CLIENT_TYPES_MAP[CLIENT_TYPES.LIBRARY] = 2;
  CLIENT_TYPES_MAP[CLIENT_TYPES.MEDIA_PLAYER] = 3;
  CLIENT_TYPES_MAP[CLIENT_TYPES.FEED_READER] = 4;
  CLIENT_TYPES_MAP[CLIENT_TYPES.PIM] = 5;

  const findDataIndex = (userAgent, clientType) => {
    const database = databases[clientType];
    if (!database) {
      return null;
    }

    for (let i = 0, l = database.length; i < l; i++) {
      let result = matchUserAgent(database[i].regex, userAgent);
      if (result !== null) {
        return i;
      }
    }

    return null;
  };


  const createIndexForFixture = (fixture) => {
    let userAgent = fixture.user_agent;
    let splitData = splitUserAgent(userAgent);
    let clientName = ArrayPath.get(fixture, 'client.name', null);
    let clientType = ArrayPath.get(fixture, 'client.type', null);

    let keyIndex = findDataIndex(userAgent, clientType, databases);
    let keyName = splitData.hash;
    let parserId = CLIENT_TYPES_MAP[clientType] ?? null;
    if (parserId === null) {
      return;
    }
    if (!clientName || keyIndex === null) {
      return;
    }
    if (output[keyName] === void 0) {
      output[keyName] = {};
    }
    if (output[keyName][parserId] === void 0) {
      output[keyName][parserId] = [];
    }
    if (!output[keyName][parserId].includes(keyIndex)) {
      output[keyName][parserId].push(keyIndex);
      output[keyName][parserId] = output[keyName][parserId].sort(sortAsc);
    }
  };

// create index for fixtures
  appFixtureData.forEach((fixture) => {
    createIndexForFixture(fixture);
  });
  browserFixtureData.forEach((fixture) => {
    createIndexForFixture(fixture);
  });
  libraryFixtureData.forEach((fixture) => {
    createIndexForFixture(fixture);
  });
  mediaplayerFixtureData.forEach((fixture) => {
    createIndexForFixture(fixture);
  });
  readerFixtureData.forEach((fixture) => {
    createIndexForFixture(fixture);
  });
  pimFixtureData.forEach((fixture) => {
    createIndexForFixture(fixture);
  });

  console.log('create client indexes')

// parse fixtures devices
  ymlDeviceFiles.forEach((file) => {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    const fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
    const total = fixtureData.length;
    console.log(chalk.green('create indexes from file: ' + 'devices/' + file));

    fixtureData.forEach((fixture, pos) => {
      createIndexForFixture(fixture);
      const clientMsg = `${fixture?.client?.name ?? 'unknown'}`;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(chalk.blue(`${pos}/${total} ${clientMsg}`));
      process.stdout.cursorTo(0);
    });
    process.stdout.clearLine();
  });

  fs.writeFileSync(
    regexesFolder + 'client-index-hash.js',
    `module.exports = ${JSON.stringify(output, null, 2)};\n`,
    'utf8'
  );
}

const createDeviceIndexes = () => {
  const deviceDetector = new DeviceDetector({
    deviceIndexes: false,
    clientIndexes: false,
  });
  const parserClientHints = new ClientHints();
  const parserAliasDevice = deviceDetector.getParseAliasDevice();
  parserAliasDevice.setReplaceBrand(false);
  const parserDevice = deviceDetector.getParseDevice('Mobile');

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

  console.log('create device indexes')

  ymlDeviceFiles.forEach((file) => {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    console.log(chalk.green('create indexes from file: ' + 'devices/' + file));
    const fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file)
    const total = fixtureData.length;

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
    __dirname + '/../../regexes/device-index-hash.js',
    `module.exports = ${JSON.stringify(output, null, 2)};\n`,
    'utf8',
  );
}


const program = new Command();
program.description(`==========================================================
  This is a working file for creating device, os, client indexes.
  Usages:
  $> node generate-indexes.js  
==========================================================`);
program.option('-y, --type <string>', 'create type index [all, os, device, client]', 'all')
program.action(function(){
  const options = this.opts();
  const type = options.type ?? 'all';

  switch (type) {
    case 'device':
      createDeviceIndexes()
      break;
    case 'os':
      createOsIndexes();
      break
    case 'client':
      createClientIndexes();
      break
    default:
      createOsIndexes()
      createClientIndexes()
      createDeviceIndexes()
      break;

  }


})
program.parse(process.argv);

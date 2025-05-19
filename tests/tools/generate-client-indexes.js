const fs = require('fs');
const ArrayPath = require('../../lib/array-path');
const {
  YAMLLoad,
  getFixtureFolder,
  getRegexesFolder,
  sortAsc,
} = require('./../functions');

const { splitUserAgent} = require('./../../parser/helper');
const CLIENT_TYPES = require('../../parser/const/client-type');
const { matchUserAgent } = require('../../parser/helper');
const fixtureFolder = getFixtureFolder();
const regexesFolder = getRegexesFolder();
// regex list
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

// parse fixtures devices
ymlDeviceFiles.forEach((file) => {
  if (excludeFilesNames.indexOf(file) !== -1) {
    return;
  }
  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  fixtureData.forEach((fixture) => {
    createIndexForFixture(fixture);
  });
});

fs.writeFileSync(
  regexesFolder + 'client-index-hash.js',
  `module.exports = ${JSON.stringify(output, null, 2)};\n`,
  'utf8'
);

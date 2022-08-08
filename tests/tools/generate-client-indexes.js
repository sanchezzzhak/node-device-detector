const fs = require('fs');
const ArrayPath = require('../../lib/array-path');
const {YAMLLoad, YAMLDump, getFixtureFolder} = require('./../functions');
const {splitUserAgent, matchUserAgent, fuzzyCompare} = require(
  './../../parser/helper');
const CLIENT_TYPES = require('../../parser/const/client-type');

let fixtureFolder = getFixtureFolder();
let regexesFolder = __dirname + '/../../regexes/';

// regex list
const databases = {};
databases[CLIENT_TYPES.BROWSER] = YAMLLoad(
  regexesFolder + 'client/browsers.yml');
databases[CLIENT_TYPES.MOBILE_APP] = YAMLLoad(
  regexesFolder + 'client/mobile_apps.yml');
databases[CLIENT_TYPES.MEDIA_PLAYER] = YAMLLoad(
  regexesFolder + 'client/mediaplayers.yml');
databases[CLIENT_TYPES.FEED_READER] = YAMLLoad(
  regexesFolder + 'client/feed_readers.yml');
databases[CLIENT_TYPES.PIM] = YAMLLoad(
  regexesFolder + 'client/pim.yml');

let appFixtureData = YAMLLoad(fixtureFolder + 'clients/mobile_app.yml');
let browserFixtureData = YAMLLoad(fixtureFolder + 'clients/browser.yml');
let mediaplayerFixtureData = YAMLLoad(fixtureFolder + 'clients/mediaplayer.yml');
let libraryFixtureData = YAMLLoad(fixtureFolder + 'clients/library.yml');
let readerFixtureData = YAMLLoad(fixtureFolder + 'clients/feed_reader.yml');
let pimFixtureData = YAMLLoad(fixtureFolder + 'clients/pim.yml');

const output = {};
const replaceAll = (source, search, replace) => {
  let str = String(source);
  search.forEach((item, i) => {
    str = str.replace(search[i], replace[i]);
  });
  return str;
};

const findDataKey = (groups, clientName) => {
  if (!groups) {
    return null;
  }

  try {
    for (let keyName in groups) {
      if (Array.isArray(groups[keyName])) {
        continue;
      }
      if (String(keyName).charAt(0) === '#') {
        if (fuzzyCompare(groups[keyName], clientName)) {
          return String(groups[keyName]);
        }
      }
      if (fuzzyCompare(keyName, clientName)) {
        return String(keyName);
      }
      let searchArray = ['%20', / ?app| ?browser/i];
      let replaceArray = [' ', ''];

      // remove prefix App and Browser
      let first = replaceAll(keyName, searchArray, replaceArray);
      let second = replaceAll(clientName, searchArray, replaceArray);
      if (fuzzyCompare(first, second)) {
        return String(keyName);
      }

      if (second.indexOf(first) !== -1) {
        return String(keyName);
      }
    }

  } catch (e) {

  }
  return null;
};

const findDataIndex = (userAgent, clientType) => {
  let database = databases[clientType];
  if (!database) {
    return null
  }

  for (let i = 0, l = database.length; i < l; i++) {
    let result = matchUserAgent(database[i].regex, userAgent);
    if (result !== null) {
      return i;
    }
  }

  return null;
};

const sortAsc = (a, b) => a - b;

const createIndexForFixture = (fixture) => {
  let userAgent = fixture.user_agent;
  let splitData = splitUserAgent(userAgent);
  let clientName = ArrayPath.get(fixture, 'client.name', null);
  let clientType = ArrayPath.get(fixture, 'client.type', null);

  let keyIndex = findDataIndex(userAgent, clientType);
  let keyName = splitData.hash;

  if (
    !clientName ||
    keyIndex === null
  ) {
    return;
  }

  if (output[keyName] === void 0) {
    output[keyName] = [
      [], // browser
      [], // app
      // [], // lib
      // [], // media player
      // [], // reader
      // [], // pim
    ];
  }

  if (!output[keyName][0].includes(keyIndex) && clientType ===
    CLIENT_TYPES.BROWSER) {
    output[keyName][0].push(keyIndex);
    output[keyName][0] = output[keyName][0].sort(sortAsc);
  }

  if (!output[keyName][1].includes(keyIndex) && clientType ===
    CLIENT_TYPES.MOBILE_APP) {
    output[keyName][1].push(keyIndex);
    output[keyName][1] = output[keyName][1].sort(sortAsc);
  }

  // if (!output[keyName][2].includes(keyIndex) && clientType ===
  //   CLIENT_TYPES.LIBRARY) {
  //   output[keyName][2].push(keyIndex);
  //   output[keyName][2] = output[keyName][2].sort(sortAsc);
  // }
  //
  // if (!output[keyName][3].includes(keyIndex) && clientType ===
  //   CLIENT_TYPES.MEDIA_PLAYER) {
  //   output[keyName][3].push(keyIndex);
  //   output[keyName][3] = output[keyName][3].sort(sortAsc);
  // }
  //
  // if (!output[keyName][4].includes(keyIndex) && clientType ===
  //   CLIENT_TYPES.FEED_READER) {
  //   output[keyName][4].push(keyIndex);
  //   output[keyName][4] = output[keyName][4].sort(sortAsc);
  // }
  // if (!output[keyName][5].includes(keyIndex) && clientType ===
  //   CLIENT_TYPES.PIM) {
  //   output[keyName][5].push(keyIndex);
  //   output[keyName][5] = output[keyName][5].sort(sortAsc);
  // }
};

// create index for fixtures

appFixtureData.forEach((fixture) => {
  createIndexForFixture(fixture);
});
browserFixtureData.forEach((fixture) => {
  createIndexForFixture(fixture);
});
// libraryFixtureData.forEach((fixture) => {
//   createIndexForFixture(fixture);
// });
// mediaplayerFixtureData.forEach((fixture) => {
//   createIndexForFixture(fixture);
// });
// readerFixtureData.forEach((fixture) => {
//   createIndexForFixture(fixture);
// });
// pimFixtureData.forEach((fixture) => {
//   createIndexForFixture(fixture);
// });

let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');

ymlDeviceFiles.forEach((file) => {
  if (excludeFilesNames.indexOf(file) !== -1) {
    return;
  }
  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  fixtureData.forEach((fixture) => {
    createIndexForFixture(fixture);
  });
});

let content = YAMLDump(output);

fs.writeFileSync(regexesFolder + 'client-index-hash.yml', content, 'utf8');
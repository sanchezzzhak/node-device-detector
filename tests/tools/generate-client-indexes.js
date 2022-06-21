const fs = require('fs');
const ArrayPath = require('../../lib/array-path');
const {YAMLLoad, YAMLDump, getFixtureFolder} = require('./../functions');
const {splitUserAgent, matchUserAgent, fuzzyCompare} = require(
  './../../parser/helper');

let fixtureFolder = getFixtureFolder();

let browserRegexData = YAMLLoad(
  __dirname + '/../../regexes/client/browsers.yml');

let appRegexData = YAMLLoad(
  __dirname + '/../../regexes/client/mobile_apps.yml');

let browserFixtureData = YAMLLoad(fixtureFolder + 'clients/browser.yml');
let appFixtureData = YAMLLoad(fixtureFolder + 'clients/mobile_app.yml');

const output = {};

const replaceAll = (source, search, replace) => {
  let str = String(source);
  search.forEach((item, i) => {
    str = str.replace(search[i], replace[i]);
  })
  return str;
}

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
  return null
}

const findDataIndex = (userAgent, clientType) => {
  let database = [];
  if (clientType === 'browser') {
    database = browserRegexData;
  }
  if (clientType === 'mobile app') {
    database = appRegexData;
  }
  for (let i = 0, l = database.length; i < l; i++) {
    let result = matchUserAgent(database[i].regex, userAgent);
    if (result !== null) {
      return i;
    }
  }
}

const createIndexForFixture = (fixture) => {
  let userAgent = fixture.user_agent;
  let splitData = splitUserAgent(userAgent);
  let clientName = ArrayPath.get(fixture, 'client.name', null);
  let clientType = ArrayPath.get(fixture, 'client.type', null);
  let keyIndex = findDataIndex(userAgent, clientType)
  let keyName = splitData.hash;

  if (['browser', 'mobile app'].indexOf(clientType) === -1 || !clientName || !keyIndex) {
    return;
  }
  if (output[keyName] === void 0) {
    output[keyName] = [[], []];
  }
  if (!output[keyName][0].includes(keyIndex) && clientType === 'browser') {
    output[keyName][0].push(keyIndex);
    output[keyName][0].sort((a, b) => a - b);
  }
  if (!output[keyName][1].includes(keyIndex) && clientType === 'mobile app') {
    output[keyName][1].push(keyIndex);
    output[keyName][1].sort((a, b) => a - b);
  }
}
appFixtureData.forEach((fixture) => {
  createIndexForFixture(fixture)
});
browserFixtureData.forEach((fixture) => {
  createIndexForFixture(fixture)
});

let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');

ymlDeviceFiles.forEach((file) => {
  if (excludeFilesNames.indexOf(file) !== -1) {
    return;
  }
  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  fixtureData.forEach((fixture) => {
    createIndexForFixture(fixture)
  });
});

let content = YAMLDump(output);

fs.writeFileSync(
  __dirname + '/../../regexes/device-index-hash.yml',
  content,
  'utf8'
);
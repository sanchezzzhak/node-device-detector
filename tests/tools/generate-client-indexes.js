const fs = require('fs');
const ArrayPath = require('../../lib/array-path');

const CLIENT_TYPES = require('../../parser/const/client-type');

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
  let database = [];
  if (clientType === CLIENT_TYPES.BROWSER) {
    database = browserRegexData;
  } else if (clientType === CLIENT_TYPES.MOBILE_APP) {
    database = appRegexData;
  } else {
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
  
  const sortAsc = (a, b) => a - b;
  
  let userAgent = fixture.user_agent;
  let splitData = splitUserAgent(userAgent);
  let clientName = ArrayPath.get(fixture, 'client.name', null);
  let clientType = ArrayPath.get(fixture, 'client.type', null);
  let headers = ArrayPath.get(fixture, 'headers', null);
  if (headers !== null) {
    return;
  }
  
  let keyIndex = findDataIndex(userAgent, clientType);
  let keyName = splitData.hash;
  
  if (
    ![CLIENT_TYPES.BROWSER, CLIENT_TYPES.MOBILE_APP].includes(clientType) ||
    !clientName ||
    keyIndex === null
  ) {
    return;
  }

  if (output[keyName] === void 0) {
    output[keyName] = [[], []];
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
};

appFixtureData.forEach((fixture) => {
  createIndexForFixture(fixture);
});

browserFixtureData.forEach((fixture) => {
  createIndexForFixture(fixture);
});

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

fs.writeFileSync(
  __dirname + '/../../regexes/client-index-hash.yml',
  content,
  'utf8',
);
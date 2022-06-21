const fs = require('fs');
const {YAMLLoad, YAMLDump, getFixtureFolder} = require('./../functions');
const {splitUserAgent, matchUserAgent, fuzzyCompare} = require(
  './../../parser/helper');

const util = require('util');

let fixtureFolder = getFixtureFolder();
let browserRegexData = YAMLLoad(
  __dirname + '/../../regexes/client/browsers.yml');

let appRegexData = YAMLLoad(
  __dirname + '/../../regexes/client/mobile_apps.yml');

let browserFixtureData = YAMLLoad(fixtureFolder + 'clients/browser.yml');
let appFixtureData = YAMLLoad(fixtureFolder + 'clients/mobile_app.yml');


const dd = (...vars) => {
  console.log(util.inspect(vars,
    {showHidden: false, depth: null, colors: true}));
};

const output = {};

const findDataKey = (groups, clientName) => {
  for (let group of groups) {
    for (let keyName in group) {
      if (Array.isArray(group[keyName])) {
        continue;
      }
      if (String(keyName).charAt(0) === '#') {
         if(fuzzyCompare(group[keyName], clientName)) {
           return String(group[keyName]);
         }
      }
      let has = fuzzyCompare(keyName, clientName);
      if (has) {
        return String(keyName);
      }
    }
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
  let clientName = fixture.client.name;
  let clientType = fixture.client.type;
  let keyName = findDataKey(splitData.groups, clientName);
  let keyIndex = findDataIndex(userAgent, clientType)
  
  if (keyName === null || keyIndex === null) {
    dd(userAgent, keyName, clientName, JSON.stringify(splitData.groups), keyIndex)
    return;
  }
  if (output[keyName] === void 0) {
    output[keyName] = {};
    output[keyName].browsers = [];
    output[keyName].apps = [];
  }
  if(!output[keyName].browsers.includes(keyIndex) && clientType === 'browsers') {
    output[keyName].browsers.push(keyIndex);
    output[keyName].browsers.sort();
  }
  if(!output[keyName].apps.includes(keyIndex) && clientType === 'mobile app') {
    output[keyName].apps.push(keyIndex);
    output[keyName].apps.sort();
  }
}
appFixtureData.forEach((fixture) => {
  createIndexForFixture(fixture)
});
browserFixtureData.forEach((fixture) => {
  createIndexForFixture(fixture)
});

let content = YAMLDump(output);
fs.writeFileSync(
  __dirname + '/../../regexes/client-index-hash.yml',
  content,
  'utf8'
);

console.log(YAMLDump(output));
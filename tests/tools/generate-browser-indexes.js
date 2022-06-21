const fs = require('fs');
const {YAMLLoad, YAMLDump, getFixtureFolder} = require('./../functions');
const {splitUserAgent, matchUserAgent, fuzzyCompare} = require(
  './../../parser/helper');

const util = require('util');

let fixtureFolder = getFixtureFolder();
let browserRegexData = YAMLLoad(
  __dirname + '/../../regexes/client/browsers.yml');
let browserFixtureData = YAMLLoad(fixtureFolder + 'clients/browser.yml');

const dd = (...vars) => {
  console.log(util.inspect(vars,
    {showHidden: false, depth: null, colors: true}));
};

let fixtureIndex = {

};

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

const findDataIndex = (user_agent) => {
  for (let i = 0, l = browserRegexData.length; i < l; i++) {
    let result = matchUserAgent(browserRegexData[i].regex, user_agent);
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
  let keyIndex = findDataIndex(userAgent)
  
  if (keyName === null) {
    console.log(userAgent, keyName, clientName, JSON.stringify(splitData.groups), keyIndex)
    return;
  }
  if (fixtureIndex[keyName] === void 0) {
    fixtureIndex[keyName] = {};
    fixtureIndex[keyName].hash = [];
  }
  if(!fixtureIndex[keyName].hash.includes(keyIndex)) {
    fixtureIndex[keyName].hash.push(keyIndex);
    // fixtureIndex[keyName].ua = userAgent;
    fixtureIndex[keyName].client = clientName;
    fixtureIndex[keyName].type = clientType;
  }
}

browserFixtureData.forEach((fixture) => {
  createIndexForFixture(fixture)
});

console.log(YAMLDump(fixtureIndex));
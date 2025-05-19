const fs = require('fs');
const ArrayPath = require('../../lib/array-path');
const { YAMLLoad, YAMLDump, getFixtureFolder, getRegexesFolder, sortAsc } = require('./../functions');
const {
  splitOsUserAgent,
} = require('./../../parser/helper');
const { matchUserAgent } = require('../../parser/helper');

const fixtureFolder = getFixtureFolder();
const regexesFolder = getRegexesFolder();
const output = {};
const excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
const ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');
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
  regexesFolder + 'os-index-hash.js',
  `module.exports = ${JSON.stringify(output, null, 2)};\n`,
  'utf8'
);

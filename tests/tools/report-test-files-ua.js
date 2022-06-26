// this is a working file for filtering user agents that have not yet been processed and added to tests
// Usage
// node report-test-files-ua.js "/src/www/scan-logs/" "/src/www/node-device-detector/tests/fixtures/" > ua_not_exist_tests.log

const readline = require('readline');
const fs = require('fs');
const AliasDevice = require('../../parser/device/alias-device');
const DeviceDetect = require('../../index');
const { YAMLLoad, getFixtureFolder } = require('./../functions');

const aliasDevice = new AliasDevice();
const detector = new DeviceDetect({
  deviceIndexes: true,
  clientIndexes: true,
});

let outputExist = {};
let fixtures = {};

const isFile = (path) => {
  return fs.lstatSync(path).isFile();
};

const isDir = (path) => {
  return fs.lstatSync(path).isDirectory();
};

const run = (folderTestPath, folderFixturePath, uniqueOutput = 0) => {
  let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
  if (folderFixturePath === '') {
    folderFixturePath = getFixtureFolder() + 'devices/';
  }

  let ymlDeviceFiles = fs.readdirSync(folderFixturePath);
  ymlDeviceFiles.forEach((file) => {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    let fixtureData = YAMLLoad(folderFixturePath + file);
    fixtureData.forEach((fixture, pos) => {
      let aliasResult = aliasDevice.parse(fixture.user_agent);

      if (!fixture.device) {
        return;
      }

      if (fixture.device && !fixture.device.brand) {
        return;
      }

      let brand = String(fixture.device.brand);
      let model = String(fixture.device.model);
      let deviceCode = aliasResult.name ? aliasResult.name.toLowerCase() : void 0;
      fixtures[deviceCode] = { brand, model };
    });
  });

  let files = [];
  if (isDir(folderTestPath)) {
    fs.readdirSync(folderTestPath).forEach((file) => {
      let absolutePath = folderTestPath + file;
      if (!isFile(absolutePath)) {
        return;
      }
      files.push(absolutePath);
    });
  } else if (isFile(folderTestPath)) {
    files.push(folderTestPath);
  }

  if (!files.length) {
    console.log('empty files');
    return;
  }

  files.forEach(async (absolutePath) => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(absolutePath),
      terminal: false,
    });
    for await (const useragent of lineReader) {
      let aliasResult = aliasDevice.parse(useragent);
      let deviceCode = aliasResult.name ? aliasResult.name.toLowerCase() : void 0;

      let result = detector.detect(useragent);
      let isFoundModel = result.device && result.device.model !== void 0;
      let isFoundBrand = result.device && result.device.brand !== void 0;

      if (
        uniqueOutput &&
        fixtures[deviceCode] === void 0 &&
        outputExist[deviceCode] === void 0
      ) {
        console.log(useragent);
        outputExist[deviceCode] = 1;
      } else if (!uniqueOutput && fixtures[deviceCode] === void 0) {
        console.log(useragent);
      }

      // } else if(fixtures[deviceCode] === void 0 && !isFoundModel && isFoundBrand) {
      //   console.log(useragent)
      // } else if(deviceCode && !isFoundBrand) {
      //   console.log(useragent)
      // }
    }
  });
};

let parsePath = process.argv[2];
let testsPath = process.argv[3] || '';
let uniqueOutput = process.argv[4] || 0;

run(parsePath, testsPath, uniqueOutput);

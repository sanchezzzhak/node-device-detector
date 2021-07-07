const readline = require('readline');
const fs = require('fs');
const AliasDevice = require('../../parser/device/alias-device')
const DeviceDetect = require('../../index')
const { YAMLLoad, getFixtureFolder} = require('./../functions');

const aliasDevice = new AliasDevice()
const detector = new DeviceDetect({
  discardDeviceIndexes: false
})


let fixtures = {}

const run = (folderTestPath, folderFixturePath) => {
  let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
  if( folderFixturePath === '') {
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
      let brand = String(fixture.device.brand);
      let model = String(fixture.device.model);
      let deviceCode = aliasResult.name ? aliasResult.name : void 0;
      fixtures[deviceCode] = {brand, model};
    });
  })

  const files = fs.readdirSync(folderTestPath);
  if (!files.length) {
    console.log('empty dir files not found')
    return;
  }
  files.forEach(async file => {
    let absolutePath = folderTestPath + file;
    if(!fs.lstatSync(absolutePath).isFile()){
      return;
    }
    const lineReader = readline.createInterface({
      input: fs.createReadStream(absolutePath),
      terminal: false,
    });
    for await (const useragent of lineReader) {
      let aliasResult = aliasDevice.parse(useragent);
      let deviceCode = aliasResult.name ? aliasResult.name : void 0;

      let result = detector.detect(useragent);
      let isFoundModel = result.device && result.device.model !== void 0;
      let isFoundBrand = result.device && result.device.brand !== void 0;

      if(fixtures[deviceCode] === void 0) {
        console.log(useragent)
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
let testsPath = process.argv[3] || "";

run(parsePath, testsPath);
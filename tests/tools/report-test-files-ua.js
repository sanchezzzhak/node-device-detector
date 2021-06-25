const readline = require('readline');
const fs = require('fs');
const AliasDevice = require('../../parser/device/alias-device')
const DeviceDetect = require('../../index')
const { YAMLLoad } = require('./../functions');

const aliasDevice = new AliasDevice()
const detector = new DeviceDetect({
  discardDeviceIndexes: false
})

let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let fixtureFolder = __dirname + '/fixtures/';
let ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');

let fixtures = {}

ymlDeviceFiles.forEach((file) => {
  if (excludeFilesNames.indexOf(file) !== -1) {
    return;
  }
  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  fixtureData.forEach((fixture, pos) => {
    let aliasResult = aliasDevice.parse(fixture.user_agent);

    let brand = String(fixture.device.brand);
    let model = String(fixture.device.model);
    let deviceCode = aliasResult.name ? aliasResult.name : void 0;
    fixtures[deviceCode] = {brand, model};
  });
})

console.log('generate fixtures done');

const parse = (folderPath) => {
  const files = fs.readdirSync(folderPath);
  if (!files.length) {
    console.log('empty dir files not found')
    return;
  }
  files.forEach(async file => {
    let absolutePath = folderPath + file;
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

      if(fixtures[deviceCode] === void 0 && isFoundModel) {
        console.log(useragent)
      } else if(fixtures[deviceCode] === void 0 && !isFoundModel && isFoundBrand) {
        console.log(useragent)
      } else if(deviceCode && !isFoundBrand) {
        console.log(useragent)
      }
    }
  });
};

if (process.argv.length > 2) {
  parse(process.argv[2]);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('set folder path: ', (folderPath) => {
    parse(folderPath)
    rl.close();
  });
}

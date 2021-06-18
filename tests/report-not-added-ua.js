const readline = require('readline');
const fs = require('fs');
const AliasDevice = require('../parser/device/alias-device')
const DeviceDetect = require('../index')
const { YAMLLoad } = require('./functions');

const similar = (a, b) => {
  let equivalency = 0;
  let minLength = (a.length > b.length) ? b.length : a.length;
  let maxLength = (a.length < b.length) ? b.length : a.length;
  for(let i = 0; i < minLength; i++) {
    if(a[i] === b[i]) {
      equivalency++;
    }
  }
  let weight = equivalency / maxLength;
  return (weight * 100);
}

const aliasDevice = new AliasDevice()

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
    let result = aliasDevice.parse(fixture.user_agent);
    let brand = String(fixture.device.brand);
    let model = String(fixture.device.model);
    let deviceCode = result.name ? result.name : void 0;
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
  files.forEach(file => {
    let absolutePath = folderPath + file;
  
    const lineReader = readline.createInterface({
      input: fs.createReadStream(filePath),
      terminal: false,
    });
    lineReader.on('line', (useragent) => {
      let aliasResult = aliasDevice.parse(fixture.user_agent);
      let deviceCode = aliasResult.name ? aliasResult.name : void 0;
      
      let result = detector.detect(useragent)
    });
    
    console.log(file)
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

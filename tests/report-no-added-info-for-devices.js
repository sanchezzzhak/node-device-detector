// this is a service file to provide a list of devices
// generates a report about the absence of characteristics for the device
// Usage
/*
cd tests
node report-no-added-info-for-devices.js > output/report.log
 */

const {
  YAMLLoad
} = require('./functions');

const fs = require('fs');
const aliasDevice = new (require('../parser/device/alias-device'))();
const infoDevice = new (require('../parser/device/info-device'))();

let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let fixtureFolder = __dirname + '/fixtures/';
ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');

const report = {};
const appendReport = (brand, name, code) => {
  if(report[brand] === void 0) {
    report[brand] = {};
  }
  report[brand][name] = '';
  if(code !== void 0) {
    report[brand][code] = `->${name}`;
  }
}

ymlDeviceFiles.forEach(file => {
  if (excludeFilesNames.indexOf(file) !== -1) {
    return;
  }

  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  fixtureData.forEach((fixture, pos) => {
    let result = aliasDevice.parse(fixture.user_agent);
    let deviceCode = result.name ? result.name : void 0;
    let brand = String(fixture.device.brand).toLowerCase();
    let model = String(fixture.device.model).toLowerCase();
    if(deviceCode !== void 0) {
      deviceCode = String(deviceCode).toLowerCase();
    }
    // check device info is added?
    if(model !== '' && infoDevice.info(brand, model) === null) {
      appendReport(brand, model, deviceCode)
    }
    if(model!== '' && deviceCode && infoDevice.info(brand, deviceCode) === null) {
      appendReport(brand, model, deviceCode)
    }
  })
});

// print report to console
Object.keys(report).forEach(brand => {
  console.log(`${brand}:`);
  Object.keys(report[brand]).forEach(model => {
    console.log(`  ${model}: '${report[brand][model]}'`);
  })
})
// this is a service file to provide a list of devices
// generates a report about the absence of characteristics for the device
// and update
// Usage
/*
cd tests/tools
node report-no-added-info-for-devices.js > ../output/report.log
or
node report-no-added-info-for-devices.js > ../../../regexes/device-info/device.yml
 */

const {YAMLLoad, getFixtureFolder} = require('./../functions');

const fs = require('fs');
const { YAMLDump } = require('../functions');
const aliasDevice = new (require('../../parser/device/alias-device'))();
const infoDevice = new (require('../../parser/device/info-device'))();


let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let fixtureFolder = getFixtureFolder();
let ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');

const report =YAMLLoad(
  __dirname + '/../../regexes/device-info/device.yml'
);
const appendReport = (brand, name, code) => {
  if (report[brand] === void 0 || report[brand] === null) {
    report[brand] = {};
  }
  if (report[brand][name] === void 0) {
    report[brand][name] = '';
  }
  const isCode = code && name !== code && (report[brand][code] === void 0 || report[brand][code] === '')
  if (isCode) {
    report[brand][code] = `->${name}`;
  }
};

function escapeQuotes(str) {

  if (/^[0-9]$/.test(str) || str.indexOf('#') !== -1) {
    return `"${str}"`
  }

  return str.replace(/['"]/g, function(m) {
    switch (m) {
      case `"`: return '\\\"';
      case `'`: return '\\\'';
    }
  });
}

function generateReport() {
  ymlDeviceFiles.forEach((file) => {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }

    let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
    fixtureData.forEach((fixture, pos) => {
      let result = aliasDevice.parse(fixture.user_agent);
      let deviceCode = result.name ? result.name : void 0;

      if (fixture.device === void 0) {
        return;
      }
      let brand = String(fixture.device.brand).toLowerCase();
      let model = String(fixture.device.model).toLowerCase();
      if (deviceCode !== void 0) {
        deviceCode = String(deviceCode).toLowerCase().replace(/_/g, ' ').trim();
      }

      if (deviceCode === ')') {
        return;
      }
      if (brand === '') {
        return;
      }

      // check device info is added?
      if (
        model !== '' &&
        (!report[brand] || !report[brand][model])
      ) {
        appendReport(brand, model, deviceCode);
      }
      if (
        model !== '' &&
        deviceCode &&
        (!report[brand] || !report[brand][deviceCode])
      ) {
        appendReport(brand, model, deviceCode);
      }
    });
  });
}

generateReport();

// print help block
console.log(`
# Compact format in line
# DS=;RS=;SZ=;WT=;RE=;RM=;CP=;OS=;SM=;TT=;DP=;DR;

# This file has a specific structure
# what does each shortcode mean?
# DS - Display size
# DP:  Display densities
# RS - Resolution screen (W x H)
# DR - Device pixel ratio
# SZ - Device Size (W x H x T)
# WT - Weight grams
# RE - Release date
# OS - OS name + version
# OI - OS ID
# OV - OS version
# UI - UI ID
# RM - RAM in MB
# CP - CPU id (Central processor)
# GP - GPU id (Graphic processor)
# SM - count SIM slots
# TT - test AnTuTu score
# TG - test GeekBench score
`)


// print report to console
Object.keys(report).forEach((brand) => {
  console.log('')
  console.log(`${escapeQuotes(brand)}:`);
  report[brand] !== null && Object.keys(report[brand]).forEach((model) => {
    const data = YAMLDump({ [model]: report[brand][model] }, {forceQuotes: true}).trim();
    console.log(`  ${data}`);
  });
});

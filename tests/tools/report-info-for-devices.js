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
const readline = require('readline');
const { Command } = require('commander');
let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let fixtureFolder = getFixtureFolder();
let ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');

let report = YAMLLoad(
  __dirname + '/../../regexes/device-info/device.yml'
);

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

function printReport() {
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
  Object.keys(report).forEach((brand) => {
    console.log('')
    console.log(`${escapeQuotes(brand)}:`);
    report[brand] !== null && Object.keys(report[brand]).forEach((model) => {
      const data = YAMLDump({ [model]: report[brand][model] }, {forceQuotes: true}).trim();
      console.log(`  ${data}`);
    });
  });

}

function cleanAndValidate(data) {
  for (let key in data) {
    if (data.hasOwnProperty(key) && data[key] === "") {
      delete data[key];
    }
  }
  for (let key in data) {
    const value = data[key];
    if (typeof value === "string" && value.startsWith("->")) {
      const target = value.slice(2).trim();
      if (!(target in data)) {
        delete data[key];
      }
    }
  }

  return data;
}

const isEmpty = (...args) => {
  return (
    args.filter((mixed_var) => {
      return (
        mixed_var === '' ||
        mixed_var === 0 ||
        mixed_var === '0' ||
        mixed_var === null ||
        mixed_var === false ||
        (mixed_var instanceof Array && mixed_var.length === 0)
      );
    }).length === args.length
  );
}

function generateReport() {

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

function filterEmptyAndReferences(data) {
  const result = {};

  for (const category in data) {
    const devices = data[category];
    const validKeys = new Set();

    // Сначала ищем все ключи с пустыми значениями
    for (const key in devices) {
      if (devices[key] === "") {
        validKeys.add(key);
      }
    }

    // Теперь ищем ссылки, ведущие на эти пустые ключи
    for (const key in devices) {
      const value = devices[key];
      if (typeof value === "string" && value.startsWith("->")) {
        const target = value.slice(2).trim();
        if (validKeys.has(target)) {
          validKeys.add(key); // Добавляем эту ссылку как подходящую
        }
      }
    }

    // Формируем результирующий объект
    const filtered = {};
    for (const key of validKeys) {
      filtered[key] = devices[key];
    }

    result[category] = filtered;
  }

  return result;
}

const program = new Command();
program.option(
  '-o, --output <string>',
  'output type [full, record-exist, record-not-exist]', 'full')
program.action(function() {
  const options = this.opts();
   generateReport(options.output);

   if ('record-exist' === options.output) {
     for(let brand in report) {
       report[brand] = cleanAndValidate(report[brand]);
     }
   }
  if ('record-not-exist' === options.output) {
    report = filterEmptyAndReferences(report);
  }
   printReport();
});
program.parse(process.argv);
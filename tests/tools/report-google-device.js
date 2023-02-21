/**
 * generate report (shows diffs and simulation of device definition by device code)
 * usage
 * node report-google-device.js > ../output/diff-supported-devices.csv
 */

const https = require('https');
const fs = require('fs');
const AliasDevice = require('../../parser/device/alias-device');
const DeviceDetect = require('../../index.js');
const {getOutputFolder, getFixtureFolder} = require('./../functions');
const AggregateNewUa = require('./lib/aggregate-new-ua');
const AggregateGoogleCode = require('./lib/aggregate-google-code');

const aliasDevice = new AliasDevice();
aliasDevice.setReplaceBrand(false);

const detector = new DeviceDetect({
  deviceIndexes: false,
});

const run = async () => {

  const printRow = (data) => {
    let row = data.map(item => `"${item}"`).join(',');
    console.log(row);
  };

  const aggregateNewUa = new AggregateNewUa();
  const aggregateGoggleCode = new AggregateGoogleCode();
  await aggregateGoggleCode.syncDeviceSupportCsv();
  let lines = await aggregateGoggleCode.getCsvData();

  printRow([
    // google data
    'Brand',
    'Marketing Name',
    'Device',
    'Model',
    //
    'Matches by',
    // detector
    'detector brand',
    'detector model',
    // detect by google columns
    'Simulate UA by column Model',
    'Simulate UA by column Device',
  ]);

  let foundCount = 0;
  let totalCount = 0;
  let simulateDetect = 0;
  // Retail Branding,Marketing Name,Device,Model

  console.log();

  lines.forEach((columns, i) => {
    if (i === 0) {
      return;
    }
    totalCount++;
    let brand = '';
    let model = '';
    let pos = '-';

    let column1 = String(columns[0]).trim();
    let column2 = String(columns[1]).trim();
    let column3 = String(columns[2]).trim();
    let column4 = String(columns[3]).trim();

    let result1 = aggregateNewUa.get(column4);
    let result2 = aggregateNewUa.get(column3);
    let result3 = aggregateNewUa.get(column2);

    if (result1) {
      brand = result1.brand;
      model = result1.model;
      pos = 'Model';
    } else if (result2) {
      brand = result2.brand;
      model = result2.model;
      pos = 'Device';
    } else if (result3) {
      brand = result3.brand;
      model = result3.model;
      pos = 'Marketing Name';
    }

    if (pos !== '-') {
      foundCount++;
    }

    let useragent1 = `Dalvik/2.1.0 (Linux; U; Android xx; ${column4} Build/MRA58K)`;
    let simulateModel = detector.detect(useragent1);
    let simulateModelStr = simulateModel.device.brand + ' - ' + simulateModel.device.model;
    if (simulateModel.device.brand) {
      simulateDetect++;
    }

    let useragent2 = `Dalvik/2.1.0 (Linux; U; Android xx; ${column3} Build/MRA58K)`;
    let simulateDevice = detector.detect(useragent2);
    let simulateDeviceStr = simulateDevice.device.brand + ' - ' + simulateDevice.device.model;

    printRow([
      // google data
      column1,
      column2,
      column3,
      column4,
      //
      pos,
      // detector
      brand,
      model,
      // detect by google columns
      simulateModelStr,
      simulateDeviceStr,
    ]);
  });

  const interestCalc = (foundCount, totalCount) => ((foundCount / totalCount) *
      100).toFixed(2);
  const percentFound = interestCalc(foundCount, totalCount);
  const percentSimulate = interestCalc(simulateDetect, totalCount);

  console.log(
      `Total, ${totalCount}, Found ${foundCount} (${percentFound}%), Simulate Found ${simulateDetect} (${percentSimulate}%)`);
};

let testsPath = process.argv[2] || '';
run(testsPath);

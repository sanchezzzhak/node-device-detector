const { YAMLLoad, getFixtureFolder } = require('./../functions');
const DeviceDetector = require('../../index');
const { format } = require('@fast-csv/format');
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const detector = new DeviceDetector({});
const aliasDevice = detector.getParseAliasDevice();


const program = new Command();
program.description(`==========================================================
  This is a working file for searching for users who do not find the device code.
  Usages:
  $> node report-alias-code.js
==========================================================`);
program
  .action(function() {
    const csvStream = format({ headers: true, writeHeaders: false });
    const excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
    const folderFixturePath = getFixtureFolder() + '/devices/';
    const ymlDeviceFiles = fs.readdirSync(folderFixturePath);

    csvStream.pipe(process.stdout).on('end', () => process.exit());

    ymlDeviceFiles.forEach((file) => {
      if (excludeFilesNames.indexOf(file) !== -1) {
        return;
      }
      let pathFile = folderFixturePath + file;
      let fixtureData = YAMLLoad(pathFile);
      fixtureData.forEach((fixture) => {
        let aliasResult = aliasDevice.parse(fixture.user_agent);
        let result = detector.detect(fixture.user_agent);
        let brand = String(result.device.brand);
        let model = String(result.device.model);
        let deviceCode = aliasResult.name
          ? aliasResult.name.toLowerCase()
          : '';
        csvStream.write({ user_agent: fixture.user_agent, deviceCode, brand, model });
      });
    });
    csvStream.end();
  });

program.parse(process.argv);
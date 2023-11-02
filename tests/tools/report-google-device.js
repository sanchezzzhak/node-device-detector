/**
 * generate report (shows diffs and simulation of device definition by device code)
 * usage
 * node report-google-device.js > ../output/diff-supported-devices.csv
 */

const https = require('https')
const fs = require('fs');
const AliasDevice = require('../../parser/device/alias-device');
const DeviceDetect = require('../../index.js');
const {YAMLLoad, getFixtureFolder} = require('./../functions');

const SOURCE = 'https://storage.googleapis.com/play_public/supported_devices.csv'

/**
 * Download google csv file and hard cast content to utf8
 * @param {string }url
 * @return {Promise<unknown>}
 */
const getRemoteFileContent = (url) => {
  return new Promise((resolve, reject) => {
    const savePath = __dirname + '/../output/supported_devices.csv'
    const file = fs.createWriteStream(savePath);
    https.get(url).on('response', function (response) {
      response.pipe(file);
      response.on('error', (err) => {
        reject(err);
      })
      response.on('end', () => {
        fs.writeFileSync(savePath, fs.readFileSync(savePath, {encoding: 'ucs2'}), {encoding: 'utf8'});
        resolve(fs.readFileSync(savePath, {encoding: 'utf8'}));
      });
    });
  })
}

const aliasDevice = new AliasDevice();
aliasDevice.setReplaceBrand(false);

const detector = new DeviceDetect({
  deviceIndexes: false,
});

let fixtures = {};

const run = async (folderFixturePath) => {

  let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
  if (folderFixturePath === '') {
    folderFixturePath = getFixtureFolder() + 'devices/';
  }
  // get all devices codes from tests
  let ymlDeviceFiles = fs.readdirSync(folderFixturePath);
  ymlDeviceFiles.forEach((file) => {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    let fixtureData = YAMLLoad(folderFixturePath + file);
    fixtureData.forEach((fixture, pos) => {
      let aliasResult = aliasDevice.parse(fixture.user_agent);

      if (fixture.device === void 0) {
        return;
      }

      let brand = String(fixture.device.brand);
      let model = String(fixture.device.model);
      let deviceCode = aliasResult.name ? aliasResult.name.toLowerCase() : void 0;
      if (deviceCode !== void 0) {
        fixtures[deviceCode] = {brand, model};
      }
    });
  });

  let foundCount = 0;
  let totalCount = 0;
  let simulateDetect = 0;
  let content = await getRemoteFileContent(SOURCE);
  let lines = content.split('\n');
  // Retail Branding,Marketing Name,Device,Model
  let headers = [
    'Brand','Marketing Name','Device','Model','MATCH POS','Brand (inUs)','Model (inUs)',
    '-----',
    'Simulate4 (detect for column Model)','Simulate3 (detect for column Device)'
  ];
  console.log(`${headers.join(',')}`);

  lines.forEach((line, i) => {
    if (i === 0) {
      return;
    }
    totalCount++;
    let columns = line.split(',');
    let brand = '';
    let model = '';
    let pos = '-';

    let column1 = String(columns[0]).trim();
    let column2 = String(columns[1]).trim();
    let column3 = String(columns[2]).trim();
    let column4 = String(columns[3]).trim();

    if (fixtures[column4.toLowerCase()]) {
      brand = fixtures[column4.toLowerCase()].brand;
      model = fixtures[column4.toLowerCase()].model;
      pos = 4;
    } else if (fixtures[column3.toLowerCase()]) {
      brand = fixtures[column3.toLowerCase()].brand;
      model = fixtures[column3.toLowerCase()].model;
      pos = 3;
    } else if (fixtures[column2.toLowerCase()]) {
      brand = fixtures[column2.toLowerCase()].brand;
      model = fixtures[column2.toLowerCase()].model;
      pos = 2;
    } else if (fixtures[column1.toLowerCase()]) {
      brand = fixtures[column1.toLowerCase()].brand;
      model = fixtures[column1.toLowerCase()].model;
      pos = 1;
    }

    if (pos !== '-') {
      foundCount++;
    }

    let useragent1 = `Dalvik/2.1.0 (Linux; U; Android xx; ${column4} Build/MRA58K)`;
    let result1 = detector.detect(useragent1);
    let simulate4 = result1.device.brand + ' - ' + result1.device.model;
    if (result1.device.brand) {
      simulateDetect++;
    }

    let useragent2 = `Dalvik/2.1.0 (Linux; U; Android xx; ${column3} Build/MRA58K)`;
    let result2 = detector.detect(useragent2);
    let simulate3 = result2.device.brand + ' - ' + result2.device.model;

    console.log(`${column1},${column2},${column3},${column4}, ${pos},${brand},${model},,${simulate4},${simulate3}`);

  });
  const interestCalc = (foundCount, totalCount) => ((foundCount / totalCount) * 100).toFixed(2);
  const percentFound = interestCalc(foundCount, totalCount);
  const percentSimulate = interestCalc(simulateDetect, totalCount);

  console.log(`Total, ${totalCount}, Found ${foundCount} (${percentFound}%), Simulate Found ${simulateDetect} (${percentSimulate}%)`);
};


let testsPath = process.argv[2] || '';
run(testsPath);

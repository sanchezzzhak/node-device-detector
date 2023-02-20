const https = require('https');
const fs = require('fs');
const readline = require('readline');
const {getOutputFolder, isFile} = require('./../../functions');

const getCurrentDate = () => {
  return (new Date()).toISOString().slice(0, 10);
};

/**
 * Download google csv file and hard cast content to utf8
 * @return {Promise<unknown>}
 */
const downloadGoogleContent = (downloadUrl, savePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(savePath);
    https.get(downloadUrl).on('response', function(response) {
      response.pipe(file);
      response.on('error', (err) => {
        reject(err);
      });
      response.on('end', () => {
        fs.writeFileSync(savePath,
            fs.readFileSync(savePath, {encoding: 'ucs2'}), {encoding: 'utf8'});
        resolve(true);
      });
    });
  });
};

const parserCsv = (url) => {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(url);
    const rl = readline.createInterface({input});
    let data = [];
    rl.on("line", (row) => {
      data.push(row.split(","));
    });
    rl.on("close", () => {
      resolve(data);
    });
  })
}

let CACHE_FILE = getOutputFolder() + 'google-device.json';
let SOURCE_URL = 'https://storage.googleapis.com/play_public/supported_devices.csv';
let CONTENT_URL = getOutputFolder() + 'supported_devices.csv';

class AggregateGoogleCode {

  async syncDeviceSupportCsv() {
    let stageDownload = false;

    if (!isFile(CACHE_FILE)) {
      stageDownload = true;
    } else {
      let cacheData = require(CACHE_FILE);
      stageDownload = (getCurrentDate() !== cacheData.lastCheck);
    }
    if (stageDownload) {
      await downloadGoogleContent(SOURCE_URL, CONTENT_URL);
      fs.writeFileSync(CACHE_FILE, JSON.stringify({
        lastCheck: getCurrentDate(),
      }));
    }
  }

  async getCsvData() {
    return await parserCsv(CONTENT_URL);
  }
}

module.exports = AggregateGoogleCode;
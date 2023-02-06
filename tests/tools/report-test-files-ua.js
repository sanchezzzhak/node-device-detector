// this is a working file for filtering user agents that
// have not yet been processed and added to tests

const readline = require('readline');
const fs = require('fs');
const AggregateNewUa = require('./lib/aggregate-new-ua');

const isFile = (path) => {
  return fs.lstatSync(path).isFile();
};

const isDir = (path) => {
  return fs.lstatSync(path).isDirectory();
};

/**
 * @param {string} folderTestPath - folder check all files or file
 * @param {string} folderFixturePath - current database fixtires
 * @param {number} uniqueOutput - stage filter only unique device code
 * @usage
 * node report-test-files-ua.js "/src/www/scan-logs/" "/src/www/node-device-detector/tests/fixtures/" > ua_not_exist_tests.log
 */
const run = (folderTestPath, folderFixturePath, uniqueOutput = 0) => {

  const aggregateNewUa = new AggregateNewUa({
    folderFixturePath,
    uniqueOutput,
  });

  let files = [];
  if (isDir(folderTestPath)) {
    fs.readdirSync(folderTestPath).forEach((file) => {
      let absolutePath = folderTestPath + file;
      if (!isFile(absolutePath)) {
        return;
      }
      files.push(absolutePath);
    });
  } else if (isFile(folderTestPath)) {
    files.push(folderTestPath);
  }

  if (!files.length) {
    console.log('empty files');
    return;
  }

  files.forEach(async (absolutePath) => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(absolutePath),
      terminal: false,
    });
    for await (const useragent of lineReader) {
      if (aggregateNewUa.check(useragent)) {
        console.log(useragent);
      }
    }
  });
};

let parsePath = process.argv[2];
let testsPath = process.argv[3] || '';
let uniqueOutput = process.argv[4] || 0;

run(parsePath, testsPath, uniqueOutput);

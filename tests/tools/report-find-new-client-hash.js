const {YAMLLoad} = require('./../functions');
const {splitUserAgent, trimChars} = require('../../parser/helper');
const readline = require('readline');
const fs = require('fs');

let regexesFolder = __dirname + '/../../regexes/';
let database = YAMLLoad(regexesFolder + 'client-index-hash.yml');

const run = async (absolutePath) => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(absolutePath),
    terminal: false,
  });
  for await (let useragent of lineReader) {
    if (useragent === '') {
      continue;
    }
    useragent = trimChars(useragent, '"');
    let data = splitUserAgent(useragent);
    if(!database[data.hash]) {
      console.log(data.hash, data.path, useragent)
    }
  }
}


let testsPath = process.argv[2] || '';
run(testsPath);
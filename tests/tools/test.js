const readline = require('node:readline');
const { Command } = require('commander');
const ClientHints = require('../../client-hints');
const DeviceDetector = require('../../index');
const {reportFixture, parseCsvLine, YAMLLoad } = require('../functions');
const AggregateNewUa = require('./lib/aggregate-new-ua');
const YAML = require('js-yaml');

const query = (query) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin, output: process.stdout
    });
    rl.question(query, name => {
      resolve(name);
      rl.close();
    });
  });
};


const program = new Command();
program.description(`==========================================================
  Internal script for creating test fixture
  Usages:
  $> node test.js
==========================================================`);
program.option('-sc, --skip-check <number>', 'skip check useragent exist for tests', '0')
  .option('-dt, --device-trusted <number>', 'append trusted param to device.trusted', '0')
  .option('-di, --device-info <number>', 'append device info param to device.info', '0')
  .option('-dc, --device-code <number>', 'append code param to device.code', '0')
  .option('-ci, --compact-info <number>', 'append device info to device.info (compact mode)', '0')
  .argument('[useragent]', 'useragent string')
  .argument('[hintsRaw]', 'client-hints string')
  .argument('[hintFormat]', 'hints format(yaml, json)')
  .action(async function(userAgent, hintsRaw, hintFormat) {
    const opts = this.opts();

    let clientHintJson = {};
    let hintsFormat = '';

    if (!userAgent) {
      userAgent = await query('set useragent: ');
    }
    if (!hintsRaw) {
      hintsRaw = await query('client-hints:');
    }
    if (hintsRaw && !hintFormat) {
      hintsFormat = await query('client-hints format (yaml, json):');
    }
    if (hintsRaw && hintsFormat === 'json') {
      clientHintJson = JSON.parse(hintsRaw);
    }
    if (hintsRaw && hintsFormat === 'yaml') {
      clientHintJson = YAML.load(hintsRaw);
    }

    const clientHints = new ClientHints();
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: opts.deviceCode === '1',
      deviceTrusted: opts.deviceTrusted === '1',
      deviceInfo: opts.deviceInfo === '1'
    });

    const clientHintData = clientHints.parse(
      clientHintJson.hints ?? clientHintJson,
      clientHintJson.meta ?? clientHintJson
    );
    const detectResult = detector.detect(userAgent, clientHintData);
    reportFixture(userAgent, detectResult, clientHintData, clientHintJson, {
      deviceAliasCode: detector.deviceAliasCode, deviceTrusted: detector.deviceTrusted, deviceInfo: detector.deviceInfo
    });
  });
program.parse(process.argv);


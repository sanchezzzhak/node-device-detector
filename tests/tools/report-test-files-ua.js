const readline = require('readline');
const { Command } = require('commander');
const YAML = require('js-yaml');

const fs = require('fs');
const DeviceDetector = require('./../../index');
const ClientHints = require('./../../client-hints');
const ParserHelper = require('./../../parser/helper');
const AggregateNewUa = require('./lib/aggregate-new-ua');

const FORMAT_OUTPUT_STRING = 'string';
const FORMAT_OUTPUT_FIXTURE = 'fixture';
const PARSE_TYPE_LOG = 'log';
const PARSE_TYPE_CSV_MATA_HINTS = 'csv-meta-hints';

const isFile = (path) => {
  return fs.lstatSync(path).isFile();
};

const isDir = (path) => {
  return fs.lstatSync(path).isDirectory();
};
const grabLogFiles = (folderTestPath) => {
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

  return files;
};

/**
 * @param {string} folderTestPath - folder check all files or file
 * @param {string} folderFixturePath - current database fixtures
 * @param {{uniqueOutput: 0, formatOutput: 'string', formatParse: 'csv-meta-hints'}} options
 */
const parserLog = (folderTestPath, folderFixturePath, options) => {

  const uniqueOutput = options.uniqueOutput ?? 0;
  const formatOutput = options.formatOutput ?? FORMAT_OUTPUT_STRING;
  const formatParse = options.formatParse ?? '';

  let files = grabLogFiles(folderTestPath);
  if (!files.length) {
    console.error('empty list files');
    return;
  }
  const clienthints = new ClientHints();
  const detector = new DeviceDetector({
    clientIndexes: true, deviceIndexes: true, deviceAliasCode: false
  });
  const aggregateNewUa = new AggregateNewUa({
    folderFixturePath, uniqueOutput
  });

  files.forEach(async (absolutePath) => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(absolutePath), terminal: false
    });
    for await (const row of lineReader) {
      let check = false;
      let useragent = '';
      switch (formatParse) {
        case PARSE_TYPE_LOG:
          useragent = row;
          check = aggregateNewUa.check(useragent);
          break;
        case PARSE_TYPE_CSV_MATA_HINTS:
          // todo create later
          break;
      }

      if (check && formatOutput === FORMAT_OUTPUT_STRING) {
        console.log(useragent);
      }

      if (check && formatOutput === FORMAT_OUTPUT_FIXTURE) {
        const detectResult = detector.detect(useragent);
        const result = {
          user_agent: ParserHelper.trimChars(useragent, '"'),
          os: {
            name: detectResult.os.name ?? '',
            version: detectResult.os.version ?? '',
            platform: detectResult.os.platform ?? ''
          },
          client: {
            ...(detectResult.client.type === 'browser' ? {
              type: detectResult.client.type ?? '',
              name: detectResult.client.name ?? '',
              version: detectResult.client.version ?? '',
              engine: detectResult.client.engine ?? '',
              engine_version: detectResult.client.engine_version ?? ''
            } : {
              type: detectResult.client.type ?? '',
              name: detectResult.client.name ?? '',
              version: detectResult.client.version ?? '',
            })
          },
          device: {
            type: detectResult.device.type ?? '',
            brand: detectResult.device.brand ?? '',
            model: detectResult.device.model ?? ''
          },
          os_family: detectResult.os.family ?? '',
          browser_family: detectResult.client.family ?? ''
        };

        console.log(YAML.dump([result], { indent: 2, lineWidth: Infinity }));
      }
    }
  });
};


const program = new Command();
program.description(`==========================================================
  This is a working file for filtering user agents that have not yet been processed and added to tests.
  Usages:
  $> node report-test-files-ua.js "./file.log" "./tests/fixtures/devices/" -u 1 -p log
==========================================================`);
program
  .argument('[parsePath]', 'folder check all files or file')
  .argument('[testsPath]', 'folder fixtures for compares', __dirname + '/../fixtures/devices/')
  .option('-u, --unique <number>', 'stage filter only unique device code', '0')
  .option('-p, --parse <string>', 'parse type [log, csv-meta-hints]', 'log')
  .option('-o, --output <string>', 'output type [string, fixture]', 'string')
  .action(function(parsePath, testsPath) {
    const options = this.opts();
    parserLog(parsePath, testsPath, {
      formatOutput: options.output, uniqueOutput: options.unique, formatParse: options.parse
    });
  });
program.parse(process.argv);

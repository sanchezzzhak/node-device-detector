/**
 * generate report (shows diffs and simulation of device definition by device code)
 * usage
 * node report-google-device.js [path_to_fixtures] --group-by brand > ../output/diff-supported-devices.csv
 * node report-google-device.js [path_to_fixtures] --group-by marketing-name
 * node report-google-device.js [path_to_fixtures] --group-by type
 */

const https = require('https')
const fs = require('fs');
const path = require('path');
const AliasDevice = require('../../parser/device/alias-device');
const DeviceDetect = require('../../index.js');
const {YAMLLoad, getFixtureFolder} = require('./../functions');
const { Command } = require('commander');

const SOURCE = 'https://storage.googleapis.com/play_public/supported_devices.csv'

/**
 * Download google csv file and hard cast content to utf8
 * @param {string} url
 * @param {boolean} forceDownload
 * @return {Promise<unknown>}
 */
const getRemoteFileContent = (url, forceDownload) => {
  return new Promise((resolve, reject) => {
    const savePath = __dirname + '/../output/supported_devices.csv'
    const dir = __dirname + '/../output';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (fs.existsSync(savePath) && !forceDownload) {
      return resolve(fs.readFileSync(savePath, {encoding: 'utf8'}));
    }

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

function parseCSVLineFast(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

const aliasDevice = new AliasDevice();
aliasDevice.setReplaceBrand(false);

const detector = new DeviceDetect({
  deviceIndexes: false,
});

let fixtures = {};
let missingDevicesReport = {};
let outputBuffer = [];

/**
 * Task 1: Load and index local YAML fixtures
 */
function loadFixtures(folderFixturePath) {
  console.warn('[ ] Task 1/4: Loading and parsing local fixtures...');
  let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
  if (folderFixturePath === '') {
    folderFixturePath = getFixtureFolder() + 'devices/';
  }

  let ymlDeviceFiles = fs.readdirSync(folderFixturePath);
  ymlDeviceFiles.forEach((file) => {
    if (excludeFilesNames.indexOf(file) !== -1) {
      return;
    }
    let fixtureData = YAMLLoad(folderFixturePath + file);
    fixtureData.forEach((fixture) => {
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
  console.warn(`[✓] Task 1/4 Completed. Indexed ${Object.keys(fixtures).length} device codes from fixtures.`);
}

/**
 * Task 2: Fetch Google Play supported devices database
 */
async function fetchGoogleDb(forceDownload) {
  console.warn('[ ] Task 2/4: Fetching Google Play supported devices CSV...');
  const content = await getRemoteFileContent(SOURCE, forceDownload);
  console.warn('[✓] Task 2/4 Completed. Google Play database loaded.');
  return content;
}


/**
 * Task 3: Process CSV lines, match data, run simulation for missed items
 */
function processLines(content, options, log) {
  console.warn('[ ] Task 3/4: Processing CSV data and running device simulations...');
  const groupBy = options.groupBy;

  // Split lines and clean any hidden null bytes immediately to prevent text corruption
  let lines = content.replace(/\0/g, '').split(/\r?\n/);

  let headers = [
    'Brand','Marketing Name','Device','Model','MATCH POS','Brand (inUs)','Model (inUs)',
    '-----',
    'Simulate4 (detect for column Model)','Simulate3 (detect for column Device)'
  ];

  if (!groupBy) {
    log(`${headers.join(',')}`);
  }

  let foundCount = 0;
  let totalCount = 0;
  let simulateDetect = 0;

  let brand, model, pos, columns;
  let column1, column2, column3, column4;

  const totalLines = lines.length - 1; // Exclude header line
  const progressBarWidth = 30;         // Width of the visual bar [████░░░░]
  const step = 500;                    // Update progress every 500 rows for high performance

  for (let i = 1; i < lines.length; i++) {
    let line = lines[i];
    if (!line || line.trim() === '') continue;

    columns = parseCSVLineFast(line);
    if (columns.length < 4) continue;

    totalCount++;

    // High-performance progress bar update via stderr
    if (totalCount % step === 0 || totalCount === totalLines) {
      const percentage = (totalCount / totalLines) * 100;
      const filledLength = Math.round((progressBarWidth * totalCount) / totalLines);
      const bar = '█'.repeat(filledLength) + '░'.repeat(Math.max(0, progressBarWidth - filledLength));
      process.stderr.write(`\r[ ] Progress: [${bar}] ${percentage.toFixed(1)}% (${totalCount}/${totalLines})`);
    }

    brand = '';
    model = '';
    pos = '-';

    // Extract columns and trim internal double spaces that leak from muddy CSV data
    column1 = (columns[0] || '').replace(/\s+/g, ' ').trim();
    column2 = (columns[1] || '').replace(/\s+/g, ' ').trim();
    column3 = (columns[2] || '').replace(/\s+/g, ' ').trim();
    column4 = (columns[3] || '').replace(/\s+/g, ' ').trim();

    let c4Lower = column4.toLowerCase();
    let c3Lower = column3.toLowerCase();
    let c1Lower = column1.toLowerCase();

    if (c4Lower && fixtures[c4Lower]) {
      brand = fixtures[c4Lower].brand;
      model = fixtures[c4Lower].model;
      pos = 4;
    }

    let simulate4 = ' - ';
    let simulate3 = ' - ';

    if (pos !== '-') {
      foundCount++;
    } else {
      if (column4) {
        let useragent1 = `Dalvik/2.1.0 (Linux; U; Android xx; ${column4} Build/MRA58K)`;
        let result1 = detector.detect(useragent1);
        simulate4 = (result1.device.brand || '') + ' - ' + (result1.device.model || '');
        if (result1.device.brand) {
          simulateDetect++;
        }
      }

      if (column3) {
        let useragent2 = `Dalvik/2.1.0 (Linux; U; Android xx; ${column3} Build/MRA58K)`;
        let result2 = detector.detect(useragent2);
        simulate3 = (result2.device.brand || '') + ' - ' + (result2.device.model || '');
      }

      let groupKey = 'Unknown';
      if (groupBy === 'brand') {
        groupKey = c1Lower || 'unknown-brand';
      } else if (groupBy === 'marketing-name') {
        groupKey = column2 ? column2.split(' ')[0].toLowerCase() : 'unknown-series';
      } else if (groupBy === 'type') {
        let c3L = c3Lower;
        let c4L = c4Lower;
        if (c3L.includes('tv') || c4L.includes('tv')) groupKey = 'smart-tv';
        else if (c3L.includes('tab') || c4L.includes('tab')) groupKey = 'tablets';
        else if (c3L.includes('watch') || c4L.includes('watch')) groupKey = 'watches';
        else groupKey = 'smartphones/other';
      }

      if (groupBy) {
        if (!missingDevicesReport[groupKey]) missingDevicesReport[groupKey] = [];
        missingDevicesReport[groupKey].push({
          retailBranding: column1,
          marketingName: column2,
          deviceCode: column3,
          model: column4
        });
      }
    }

    if (!groupBy) {
      log(`"${column1}","${column2}","${column3}","${column4}", ${pos},"${brand}","${model}",,${simulate4},${simulate3}`);
    }
  }

  // Clear progress bar line and complete task cleanly
  process.stderr.write('\r' + ' '.repeat(progressBarWidth + 35) + '\r');
  console.warn(`[✓] Task 3/4 Completed. Evaluated ${totalCount} lines.`);
  return { foundCount, totalCount, simulateDetect };
}

/**
 * Task 4: Format output report and write into target files/console
 */
function outputResults(stats, options, log) {
  console.warn('[ ] Task 4/4: Formatting report data and saving results...');
  const groupBy = options.groupBy;
  const outputPath = options.output;

  if (groupBy) {
    log(`=======================================================`);
    log(` REPORT: MISSING DEVICES GROUPED BY: ${groupBy.toUpperCase()}`);
    log(`=======================================================`);

    Object.keys(missingDevicesReport).sort().forEach(group => {
      const items = missingDevicesReport[group];
      log(`\n📦 Group [${group.toUpperCase()}] — Missing count: ${items.length}`);

      const limit = items.slice(0, 200);
      limit.forEach(item => {
        log(`  -> Brand: ${item.retailBranding} | Marketing: ${item.marketingName} | Code: ${item.deviceCode} | Model: ${item.model}`);
      });
    });
    log(`\n=======================================================`);
  }

  const interestCalc = (found, total) => ((found / total) * 100).toFixed(2);
  const percentFound = interestCalc(stats.foundCount, stats.totalCount);
  const percentSimulate = interestCalc(stats.simulateDetect, stats.totalCount);

  log(`Total, ${stats.totalCount}, Found ${stats.foundCount} (${percentFound}%), Simulate Found ${stats.simulateDetect} (${percentSimulate}%)`);

  if (outputPath) {
    const finalDir = path.dirname(outputPath);
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });
    fs.writeFileSync(outputPath, outputBuffer.join('\n') + '\n', { encoding: 'utf8' });
  }
  console.warn('[✓] Task 4/4 Completed. All jobs done safely.');
}

/**
 * Main Task Orchestrator
 */
const run = async (folderFixturePath, options) => {
  outputBuffer = [];

  const log = (message) => {
    if (!options.silent) {
      console.log(message);
    }
    if (options.output) {
      outputBuffer.push(message);
    }
  };

  // Execution pipeline split into isolated tasks
  loadFixtures(folderFixturePath);
  const csvContent = await fetchGoogleDb(options.forceDownload);
  const stats = processLines(csvContent, options, log);
  outputResults(stats, options, log);
};

// Program definition using Commander
const program = new Command();
program
  .arguments('[fixturePath]')
  .option('-g, --group-by <string>', 'group missing devices by criteria [brand, marketing-name, type]')
  .option('-f, --force-download', 'force download fresh csv file from storage source', false)
  .option('-s, --silent', 'disable print results into stdout console', false)
  .option('-o, --output <string>', 'target file path to save report result data')
  .action(async (fixturePath, options) => {
    const path = fixturePath || '';
    await run(path, options);
  });

program.parse(process.argv);

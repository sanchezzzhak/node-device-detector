const spawn = require('node:child_process').spawn;
const fs = require('node:fs');

const TMP_DIR = __dirname + '/../output/_git';

const errorLog = (signal) => {
  console.log(signal.toString());
};

const log = (signal) => {
  console.log(signal.toString());
};

const gitDownload = () => {
  return new Promise((resolve, reject) => {
    const cmd = [
      'git', [
        'clone', 'git@github.com:matomo-org/device-detector.git', TMP_DIR],
    ];
    const git = spawn.apply(spawn, cmd);
    git.stderr.on('data', errorLog);
    git.stdin.on('data', log);
    git.on('close', function(err, signal) {
      if (err){
        return reject(err);
      }
      return resolve(signal);
    });
  });
};

const getFilesForDir = (target) => {
  return fs.readdirSync(target, {withFileTypes: true})
  .filter(dirent => dirent.isFile()).map(dirent => dirent.name);
}

const syncTestOsFixtures = async () => {
  console.log('Sync os test fixtures');
  const dirFixtures = TMP_DIR + '/Tests/Parser/fixtures/';
  const dirTarget = __dirname + '/../fixtures/';
  const files = getFilesForDir(dirFixtures);
  for (let file of files) {
    console.log('copy file %s to dir %s', file, dirFixtures);
    fs.copyFileSync(dirFixtures + file, dirTarget + file);
  }
};

const syncTestDeviceFixtures = async () => {
  console.log('Sync device test fixtures');
  const dirFixtures = TMP_DIR + '/Tests/fixtures/';
  const dirTarget = __dirname + '/../fixtures/devices/';
  const files = getFilesForDir(dirFixtures);
  for (let file of files) {
    console.log('copy file %s to dir %s', file, dirTarget);
    fs.copyFileSync(dirFixtures + file, dirTarget + file);
  }
};

const syncTestParserFixtures = async () => {
  console.log('Sync parser test fixtures');
  const dirFixtures = TMP_DIR + '/Tests/Parser/Device/fixtures/';
  const dirTarget = __dirname + '/../fixtures/device-parsers/';
  const files = getFilesForDir(dirFixtures);
  for (let file of files) {
    console.log('copy file %s to dir %s', file, dirTarget);
    fs.copyFileSync(dirFixtures + file, dirTarget + file);
  }
};

const syncTestClientFixtures = async () => {
  console.log('Sync client test fixtures');
  const dirFixtures = TMP_DIR + '/Tests/Parser/Client/fixtures/';
  const dirTarget = __dirname + '/../fixtures/clients/';
  const files = getFilesForDir(dirFixtures);
  for (let file of files) {
    console.log('copy file %s to dir %s', file, dirTarget);
    fs.copyFileSync(dirFixtures + file, dirTarget + file);
  }
};

const syncRegexClient = async () => {
  console.log('Sync client regex');
  const dirFixtures = TMP_DIR + '/regexes/client/';
  const dirTarget = __dirname + '/../../regexes/client/';
  const files = getFilesForDir(dirFixtures);
  
  for (let file of files) {
    console.log('copy file %s to dir %s', file, dirTarget);
    fs.copyFileSync(dirFixtures + file, dirTarget + file);
  }
  
  fs.copyFileSync(dirFixtures + '/hints/apps.yml',
    dirTarget + '/hints/apps.yml');
  
  fs.copyFileSync(dirFixtures + '/hints/browsers.yml',
    dirTarget + '/hints/browsers.yml');
};

const syncRegexDevice = async () => {
  console.log('Sync device regex');
  const dirFixtures = TMP_DIR + '/regexes/device/';
  const dirTarget = __dirname + '/../../regexes/device/';
  const files = getFilesForDir(dirFixtures);
  for (let file of files) {
    console.log('copy file %s to dir %s', file, dirTarget);
    fs.copyFileSync(dirFixtures + file, dirTarget + file);
  }
};

const syncShortDeviceBrands = async () => {
  console.log('Sync short device brands');
  const sourceFile = TMP_DIR + '/Parser/Device/AbstractDeviceParser.php';
  const targetFile = __dirname + '/../../parser/device/brand-short.js';
  const content = fs.readFileSync(sourceFile).toString();
  const match = / static \$deviceBrands = \[([^\]]+)/mg.exec(content);
  let newContent = match[1]
  .replace(/'\s+=>\s+'/gm, "': '")
  .replace(/^\s+/gm, "  ")
  
  fs.writeFileSync(targetFile,
    `// prettier-ignore\nmodule.exports = {\n${newContent}\n};\n`
  )
};

const syncShortBrowserBrands = async () => {
  console.log('Sync short browser brands');
  const sourceFile = TMP_DIR + '/Parser/Client/Browser.php';
  const targetFile = __dirname + '/../../parser/client/browser-short.js';
  const content = fs.readFileSync(sourceFile).toString();
  const match = / static \$availableBrowsers = \[([^\]]+)/mg.exec(content);
  let newContent = match[1]
  .replace(/'\s+=>\s+'/gm, "': '")
  .replace(/^\s+/gm, "  ")
  
  fs.writeFileSync(targetFile,
    `// prettier-ignore\nmodule.exports = {\n${newContent}\n};\n`
  )
};

const syncShortMobileBrowser = async () => {
  console.log('Sync only mobile browser');
  const sourceFile = TMP_DIR + '/Parser/Client/Browser.php';
  const targetFile = __dirname + '/../../parser/client/browser-short-mobile.js';
  const content = fs.readFileSync(sourceFile).toString();
  const match = / static \$mobileOnlyBrowsers = \[([^\]]+)/mg.exec(content);
  let newContent = match[1]
  .replace(/'\s+=>\s+'/gm, "': '")
  .replace(/^\s+/gm, "  ")
  
  fs.writeFileSync(targetFile,
    `// prettier-ignore\nmodule.exports = [\n${newContent}\n];\n`
  )
};

const syncShortBrowserFamilies = async () => {
  console.log('Sync browser families');
  const sourceFile = TMP_DIR + '/Parser/Client/Browser.php';
  const targetFile = __dirname + '/../../parser/client/browser-families.js';
  const content = fs.readFileSync(sourceFile).toString();
  const match = / static \$browserFamilies = \[([^;]+)\];/mg.exec(content);
  
  let newContent = match[1]
  .replace(/\s+=>\s+/gm, ": ")
  .replace(/^\s+/gm, "  ")
  
  fs.writeFileSync(targetFile,
    `// prettier-ignore\nmodule.exports = {\n${newContent}\n};\n`
  )
};

const syncShortOsFamilies = async () => {
  console.log('Sync os families');
  const sourceFile = TMP_DIR + '/Parser/OperatingSystem.php';
  const targetFile = __dirname + '/../../parser/os/os_families.js';
  const content = fs.readFileSync(sourceFile).toString();
  const match = / static \$osFamilies = \[([^;]+)\];/mg.exec(content);
  
  let newContent = match[1]
  .replace(/\s+=>\s+/gm, ": ")
  .replace(/^\s+/gm, "  ")
  
  fs.writeFileSync(targetFile,
    `// prettier-ignore\nmodule.exports = {\n${newContent}\n};\n`
  )
};

const syncShortOs = async () => {
  console.log('Sync os');
  const sourceFile = TMP_DIR + '/Parser/OperatingSystem.php';
  const targetFile = __dirname + '/../../parser/os/os_systems.js';
  const content = fs.readFileSync(sourceFile).toString();
  const match = / static \$operatingSystems = \[([^;]+)\];/mg.exec(content);
  
  let newContent = match[1]
  .replace(/\s+=>\s+/gm, ": ")
  .replace(/^\s+/gm, "  ")
  
  fs.writeFileSync(targetFile,
    `// prettier-ignore\nmodule.exports = {\n${newContent}\n};\n`
  )
};

(async function() {
  if (fs.existsSync(TMP_DIR)) {
    console.log('clear dir output/_git');
    fs.rmSync(TMP_DIR, {recursive: true, force: true});
  }
  console.log('create dir output/_git');
  fs.mkdirSync(TMP_DIR);
  console.log('download git repository');
  
  await gitDownload();
  await syncTestOsFixtures();
  await syncTestDeviceFixtures();
  await syncTestParserFixtures();
  await syncTestClientFixtures();
  await syncRegexClient();
  await syncRegexDevice();
  await syncShortDeviceBrands();
  await syncShortBrowserBrands();
  await syncShortMobileBrowser();
  await syncShortBrowserFamilies();
  await syncShortOsFamilies();
  await syncShortOs();
  
})();


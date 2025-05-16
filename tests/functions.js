const fs = require('fs');
const Table = require('cli-table');
const YAML = require('js-yaml');

const csv = require('@fast-csv/parse');

const ParserHelper = require('../parser/helper');
const { matchUserAgent } = require('../parser/helper');

const parseCsvLine = (string, separator = ',') => {
  return new Promise((resolve, reject) => {
    csv.parseString(string, { headers: false })
      .on('error', error => {reject(error)})
      .on('data', row => { resolve(row)})
  })
}

function hasEnvDebug() {
  return (process.env.DEBUG_TABLE && process.env.DEBUG_TABLE === 'true');
}
function isFile (path) {
  return fs.lstatSync(path).isFile();
}

function isDir(path) {
  return fs.lstatSync(path).isDirectory();
}

function grabLogFiles(folderTestPath) {
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
}

const sortAsc = (a, b) => a - b;

/**
 * @param fixture
 * @param result
 */
function perryTable(fixture, result) {
  if (!hasEnvDebug()) {
    return;
  }

  try {
    console.log('UserAgent \x1b[33m%s\x1b[0m', fixture.user_agent);
    const table = new Table({
      head: ['Result', 'Fixture'],
      colWidths: [50, 50],
    });
    table.push([perryJSON(result), perryJSON(fixture)]);
    console.log(table.toString());
  } catch (e) {
    throw new SyntaxError(e.stack);
  }
}

function revertKeysForObjects(items) {
  return Object.assign(
    {},
    ...Object.entries(items).map(([a, b]) => ({ [b]: a })),
    {}
  );
}

function YAMLLoad(yamlPath) {
  return YAML.load(fs.readFileSync(yamlPath, 'utf8'));
}

function YAMLDump(objects) {
  return YAML.dump(objects);
}

function perryJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

function isObjNotEmpty(value) {
  return value !== void 0 && value !== null
}

function normalizeVersion(version, count) {
  if (version === '' || version === null) {
    return '';
  }
  let versionParts = String(version).split(/\./);
  let versionPartsCount = versionParts.length;
  if (versionPartsCount === 1 && versionParts[0] === '') {
    return null;
  }
  while (versionPartsCount < count) {
    versionParts.push('0');
  }
  if (versionPartsCount > 0 && versionPartsCount < count) {
    version = versionParts.slice(0, count).join('.');
  }
  return version;
}

function getRegexesFolder() {
  return __dirname + '/../regexes/'
}

function getFixtureFolder() {
  return __dirname + '/fixtures/';
}

function reportFixture (useragent, detectResult, clientHintData, clientHintJson, options){
  const result = {
    user_agent: ParserHelper.trimChars(useragent, '"'),
    headers: {},
    meta: {},
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
    browser_family: detectResult.client.family ?? 'Unknown'
  };

  if (Object.keys(clientHintData.meta ?? {}).length === 0) {
    delete result.meta;
  } else if(clientHintData.meta) {
    result.meta = Object.assign(result.meta, clientHintData.meta);
  }

  if (Object.keys(clientHintData).length === 0) {
    delete result.headers;
  } else if (clientHintJson.hints) {
    result.headers = Object.assign(result.headers, clientHintJson.hints);
  }

  if (options.deviceAliasCode) {
    result.device.code = detectResult.device.code
  }
  if (options.deviceTrusted) {
    result.device.trusted = detectResult.device.trusted
  }

  if (options.deviceInfo) {
    result.device.info = detectResult.device.info
  }
  console.log(YAML.dump([result], { indent: 2, lineWidth: Infinity }));
}



module.exports = {
  YAMLDump,
  YAMLLoad,
  grabLogFiles,
  isFile,
  isDir,
  sortAsc,
  parseCsvLine,
  revertKeysForObjects,
  normalizeVersion,
  perryTable,
  perryJSON,
  getFixtureFolder,
  getRegexesFolder,
  reportFixture,
  isObjNotEmpty
};

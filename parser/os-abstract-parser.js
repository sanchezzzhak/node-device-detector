const ParserAbstract = require('./abstract-parser');
const helper = require('./helper');

const OS_SYSTEMS = require('./os/os_systems');
const OS_FAMILIES = require('./os/os_families');

const ANDROID_APP_LIST = [
  'com.hisense.odinbrowser',
  'com.seraphic.openinet.pre',
  'com.appssppa.idesktoppcbrowser',
  'every.browser.inc'
];

const CLIENTHINT_MAPPING = {
  'GNU/Linux': ['Linux'],
  'Mac': ['MacOS']
};

const FIRE_OS_VERSION_MAPPING = require('./os/fire-os-version-map');
const LINEAGE_OS_VERSION_MAPPING = require('./os/lineage-os-version-map');
const IndexerOs = require('./os/indexer-os');


const getVersionForMapping = (version, map) => {
  const majorVersion =  '' + version.split('.', 1)[0];
  if (map[version]) {
    return map[version];
  }
  if (map[majorVersion]) {
    return map[majorVersion];
  }
  return '';
}

const compareOsForClientHints = (brand) => {
  const lowerName = brand.toLowerCase();
  for (let mapName in CLIENTHINT_MAPPING) {
    for (let mapBrand of CLIENTHINT_MAPPING[mapName]) {
      if (lowerName === mapBrand.toLowerCase()) {
        return mapName;
      }
    }
  }
  return brand;
};

function comparePlatform(platform, bitness = '') {
  if (platform.indexOf('arm') !== -1) {
    return 'ARM';
  }
  if (platform.indexOf('loongarch64') !== -1) {
    return 'LoongArch64';
  }
  if (platform.indexOf('mips') !== -1) {
    return 'MIPS';
  }
  if (platform.indexOf('sh4') !== -1) {
    return 'SuperH';
  }
  if (platform.indexOf('sparc64') !== -1) {
    return 'SPARC64';
  }
  if (platform.indexOf('x64') !== -1 || (platform.indexOf('x86') !== -1 && bitness === '64')) {
    return 'x64';
  }
  if (platform.indexOf('x86') !== -1) {
    return 'x86';
  }
  return '';
}

class OsAbstractParser extends ParserAbstract {

  #osIndexes = false;

  get osIndexes() {
    return this.#osIndexes;
  }

  set osIndexes(stage) {
    this.#osIndexes = stage;
  }

  constructor() {
    super();
    this.collection = require('../regexes/oss');
  }

  /**
   * @param {string} name
   * @return {string}
   */
  parseOsFamily(name) {
    for (let family in OS_FAMILIES) {
      if (OS_FAMILIES[family].indexOf(name) !== -1) {
        return String(family);
      }
    }
    return '';
  }

  /**
   * Normalisation os name and get short code os
   *
   * @param name
   * @returns {{name: string, short: string}}
   */
  getOsDataByName(name) {
    let short = 'UNK';
    let lname = String(name).toLowerCase();
    for (let key in OS_SYSTEMS) {
      if (lname === String(OS_SYSTEMS[key]).toLowerCase()) {
        name = OS_SYSTEMS[key];
        short = key;
        break;
      }
    }
    return { name, short };
  }

  parseFromClientHints(hint) {
    if (!hint) {
      return null;
    }

    let name = '';
    let short = '';
    let version = '';
    let platform = '';
    let hintName = '';

    if (hint.os && hint.os.name) {
      platform = hint.os.platform;
      version = hint.os.version;
      hintName = hint.os.name;

      platform = comparePlatform(platform.toLowerCase(), hint.os.bitness);
      hintName = compareOsForClientHints(hintName);

      for (let osShort in OS_SYSTEMS) {
        let osName = OS_SYSTEMS[osShort];
        if (helper.fuzzyCompare(hintName, osName)) {
          name = String(osName);
          short = String(osShort);
          break;
        }
      }
    }

    if ('Windows' === name &&  '' !== version) {
      let majorVersion = ~~version.split('.', 1)[0];
      let minorVersion = ~~version.split('.', 2)[1];
      if (majorVersion === 0) {
        let minorVersionMapping = {1: '7', 2 :'8', 3 :'8.1'};
        version = minorVersionMapping[minorVersion] ?? version;
      } else if (majorVersion > 0 && majorVersion < 11) {
        version = '10';
      } else if (majorVersion > 10) {
        version = '11';
      }
    }
    // On Windows, version 0.0.0 can be either 7, 8 or 8.1, so we return 0.0.0
    if ('Windows' !== name && '0.0.0' !== version && 0 === parseInt(version)) {
      version = '';
    }
    return {
      name: name,
      short_name: short,
      version: version,
      platform: platform
    };
  }


  parseUserAgentByPosition(userAgent, position) {
    let item = this.collection[position];
    let regex = this.getBaseRegExp(item.regex);
    let match = regex.exec(userAgent);
    if (match !== null) {
      let {
        name,
        short
      } = this.getOsDataByName(this.buildByMatch(item.name, match));

      let version = item.version !== void 0
        ? this.buildVersion(item.version, match)
        : '';

      if (item.versions !== void 0) {
        for (let versionItem of item.versions) {
          let regex = this.getBaseRegExp(versionItem.regex);
          let match = regex.exec(userAgent);
          if (match !== null) {
            version = this.buildVersion(versionItem.version, match);
            break;
          }
        }
      }

      return {
        name: name,
        short_name: short,
        version: version,
        platform: this.parsePlatform(userAgent),
        family: this.parseOsFamily(short)
      };
    }

    return null;
  }

  parseFromUserAgent(userAgent) {
    if (!userAgent) {
      return null;
    }

    if (this.osIndexes) {
      let positions = IndexerOs.findOsRegexPositionsForUserAgent(userAgent);
      if (positions !== null) {
        for (let position of positions) {
          let result = this.parseUserAgentByPosition(userAgent, position);
          if (result !== null) {
            return result;
          }
        }
      }
    }

    for (let i = 0, l = this.collection.length; i < l; i++) {
      let result = this.parseUserAgentByPosition(userAgent, i);
      if (result !== null) {
        return result;
      }
    }

    return null;
  }

  /**
   *
   * @param {string} userAgent
   * @param {ClientHintsResult} clientHints
   * @returns {null|{name: (string|*), short_name: string, family: string, version: string, platform: string}}
   */
  parse(userAgent, clientHints) {
    let ua = helper.restoreUserAgentFromClientHints(this.prepareUserAgent(userAgent), clientHints);
    let hint = this.parseFromClientHints(clientHints);
    let data = this.parseFromUserAgent(ua);
    let name = '';
    let version = '';
    let platform = '';
    let short = '';
    let family = '';

    if (hint && hint.name) {
      name = hint.name;
      version = hint.version;
      platform = hint.platform;
      short = hint.short_name;

      // use version from user agent if non was provided in client hints, but os family from useragent matches
      if (data && '' === version && data && this.parseOsFamily(short) === data.family) {
        version = data.version;
      }

      // On Windows, version 0.0.0 can be either 7, 8 or 8.1
      if (data && 'Windows' === name && '0.0.0' === version) {
        version = '10' === data.version ? '' : data.version;
      }

      // If the OS name detected from client hints matches the OS family from user agent
      // but the os name is another, we use the one from user agent, as it might be more detailed
      if (data && data.family === name && data.name !== name) {
        name = data.name;
        if ('LeafOS' === name) {
          version = '';
          short = 'LEA';
        }

        if ('HarmonyOS' === name) {
          version = '';
          short = 'HAR';
        }

        if ('PICO OS' === name) {
          version = data.version;
          short = 'PIC';
        }

        if ('Fire OS' === name && '' !== hint.version) {
          version = getVersionForMapping(hint.version, FIRE_OS_VERSION_MAPPING);
          short = 'FIR';
        }
      }

      // Chrome OS is in some cases reported as Linux in client hints, we fix this only if the version matches
      if (
        data &&
        'GNU/Linux' === name &&
        'Chrome OS' === data.name &&
        hint.version === data.version
      ) {
        name = data.name;
        short = data.short_name;
      }

      // Chrome OS is in some cases reported as Android in client hints
      if (data && 'Android' === name && 'Chrome OS' === data.name) {
        name = data.name;
        version = '';
        short = data.short_name;
      }

      // Meta Horizon is reported as Linux in client hints
      if ('GNU/Linux' === name && 'Meta Horizon' === data.name) {
        name = data.name;
        short = data.short_name;
      }

    } else if (data) {
      name = data.name;
      version = data.version;
      short = data.short_name;
      platform = data.platform;
      family = data.family;
    }

    if (clientHints && data && clientHints.app) {
      if (ANDROID_APP_LIST.indexOf(clientHints.app) !== -1 && 'Android' !== data.name) {
        name = 'Android';
        short = 'ADR';
        version = '';
      }
      if ('org.lineageos.jelly' === clientHints.app && 'Lineage OS' !== name) {
        name = 'Lineage OS';
        short = 'LEN';
        version = getVersionForMapping(data.version, LINEAGE_OS_VERSION_MAPPING);
      }
      if ('org.mozilla.tv.firefox' === clientHints.app && 'Fire OS' !== name) {
        name = 'Fire OS';
        short = 'FIR';
        version = getVersionForMapping(version, FIRE_OS_VERSION_MAPPING);
      }
    }

    if (platform === '' && data) {
      platform = data.platform;
    }

    if (name === '') {
      return data;
    }

    family = this.parseOsFamily(short);
    if (data === null || data.short_name !== short) {
      short = this.getOsDataByName(name).short;
    }

    return {
      name: String(name),
      version: String(version),
      short_name: String(short),
      platform: String(platform),
      family: String(family)
    };
  }

  /**
   * parse ua platform
   * @param {string} userAgent
   * @return {string}
   */
  parsePlatform(userAgent) {
    if (this.getBaseRegExp('arm[ _;)ev]|.*arm$|.*arm64|aarch64|Apple ?TV|Watch ?OS|Watch1,[12]').test(userAgent)) {
      return 'ARM';
    }
    if (this.getBaseRegExp('loongarch64').test(userAgent)) {
      return 'LoongArch64';
    }
    if (this.getBaseRegExp('mips').test(userAgent)) {
      return 'MIPS';
    }
    if (this.getBaseRegExp('sh4').test(userAgent)) {
      return 'SuperH';
    }
    if (this.getBaseRegExp('sparc64').test(userAgent)) {
      return 'SPARC64';
    }
    if (this.getBaseRegExp('64-?bit|WOW64|(?:Intel)?x64|WINDOWS_64|win64|.*amd64|.*x86_?64').test(userAgent)) {
      return 'x64';
    }
    if (this.getBaseRegExp('.+32bit|.+win32|(?:i[0-9]|x)86|i86pc').test(userAgent)) {
      return 'x86';
    }

    return '';
  }
}

module.exports = OsAbstractParser;

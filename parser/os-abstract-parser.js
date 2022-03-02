const ParserAbstract = require('./abstract-parser');
const ArrayPath = require("../lib/array-path");
const helper = require("./helper");

OS_SYSTEMS = require('./os/os_systems');
OS_FAMILIES = require('./os/os_families');

const compareBrandForClientHints = (brand) => {
  const CLIENTHINT_MAPPING = {
    'GNU/Linux': ['Linux'],
    'Mac': ['MacOS'],
  };
  for(let brandName in CLIENTHINT_MAPPING){
    for(let mapBrand of CLIENTHINT_MAPPING[brandName]){
      if (brandName.toLowerCase() === mapBrand.toLowerCase()) {
        return brandName;
      }
    }
  }
  return brand;
}

function comparePlatform(platform, bitness = '') {
  if (platform.indexOf('arm') !== -1) {
    return 'ARM';
  }
  if (platform.indexOf('mips') !== -1) {
    return 'MIPS';
  }
  if (platform.indexOf('sh4') !== -1) {
    return 'SuperH';
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
  constructor() {
    super();
    this.fixtureFile = 'oss.yml';
    this.loadCollection();
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
    return {name, short}
  }


  parseFromClientHints(clientHintsData) {
    if (!clientHintsData) {
      return null;
    }

    let name = '';
    let short = '';
    let version = '';
    let platform = '';

    if (clientHintsData.os) {
      platform = clientHintsData.os.platform;
      version = clientHintsData.os.version;
      let hintName = clientHintsData.os.name;
      platform  = comparePlatform(platform, clientHintsData.os.bitness);
      hintName = compareBrandForClientHints(hintName);

      for (let osShort in OS_SYSTEMS) {
        let osName = OS_SYSTEMS[osShort];
        if (helper.fuzzyCompare(hintName, osName)) {
          name = osName;
          short = osShort;
          break;
        }
      }
    }




    return {
      name: name,
      short_name: short,
      version: version,
      platform: platform,
    }
  }

  parseFromUserAgent(userAgent) {
    for (let i = 0, l = this.collection.length; i < l; i++) {
      let item = this.collection[i];
      let regex = this.getBaseRegExp(item.regex);
      let match = regex.exec(userAgent);
      if (match !== null) {
        let {
          name,
          short
        } = this.getOsDataByName(this.buildByMatch(item.name, match))

        let version = item.version !== void 0
            ? this.buildVersion(item.version, match)
            : '';

        if (item.versions !== void 0) {
          for (let versionItem of item.versions) {
            let regex = this.getBaseRegExp(versionItem.regex);
            let match = regex.exec(userAgent);
            if (match !== null) {
              version = this.buildVersion(versionItem.version, match)
              break;
            }
          }
        }

        return {
          name: name,
          short_name: short,
          version: version,
          platform: this.parsePlatform(userAgent),
          family: this.parseOsFamily(short),
        };
      }
    }
    return null;
  }

  /**
   *
   * @param {string} userAgent
   * @param clientHintsData
   * @returns {null|{name: (string|*), short_name: string, family: string, version: string, platform: string}}
   */
  parse(userAgent, clientHintsData) {
    let hint = this.parseFromClientHints(clientHintsData);
    let data = this.parseFromUserAgent(userAgent);
    if (hint && hint.name) {
      let version = hint.version;
      let platform = hint.platform;
      if (platform === '' && data !== null) {
        platform = data.platform;
      }

      if (version === '' && data['name'] === hint['name']) {
        version = data['version'];
      }
      return {
        name: hint.name,
        version: version,
        short_name: hint.short_name,
        platform: platform,
        family: this.parseOsFamily(hint.short_name)
      };
    }

    return data;
  }

  /**
   * parse ua platform
   * @param {string} userAgent
   * @return {string}
   */
  parsePlatform(userAgent) {
    if (
        this.getBaseRegExp('arm|aarch64|Apple ?TV|Watch ?OS|Watch1,[12]').test(userAgent)
    ) {
      return 'ARM';
    }
    if (this.getBaseRegExp('mips').test(userAgent)) {
      return 'MIPS';
    }
    if (this.getBaseRegExp('sh4').test(userAgent)) {
      return 'SuperH';
    }
    if (this.getBaseRegExp('64-?bit|WOW64|(?:Intel)?x64|win64|amd64|x86_?64').test(userAgent)) {
      return 'x64';
    }
    if (this.getBaseRegExp('.+32bit|.+win32|(?:i[0-9]|x)86|i86pc').test(userAgent)) {
      return 'x86';
    }

    return '';
  }
}

module.exports = OsAbstractParser;

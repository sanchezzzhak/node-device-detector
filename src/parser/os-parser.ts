import AbstractParser from './abstract-parser';
import * as helper from './helper';

import * as OS_SYSTEMS from './os/os_systems';
import * as OS_FAMILIES from './os/os_families';

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

import FIRE_OS_VERSION_MAPPING from './os/fire-os-version-map';
import LINEAGE_OS_VERSION_MAPPING from './os/lineage-os-version-map';
import { ResultClientHints } from '../client-hints';
import { ResultOs } from '../types';


const getVersionForMapping = (version, map) => {
  const majorVersion = ~~version.split('.', 1)[0];
  if (map[version]) {
    return map[version];
  }
  if (map[majorVersion]) {
    return map[majorVersion];
  }
  return '';
};

const compareOsForClientHints = (brand) => {
  for (let mapName in CLIENTHINT_MAPPING) {
    for (let mapBrand of CLIENTHINT_MAPPING[mapName]) {
      if (brand.toLowerCase() === mapBrand.toLowerCase()) {
        return mapName;
      }
    }
  }
  return brand;
};

/**
 *
 * @param {string} platform
 * @param {string} bitness
 * @return {string}
 */
function comparePlatform(platform: string, bitness= ''): string {
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

export default class OsParser extends AbstractParser {
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
    for (const family in OS_FAMILIES) {
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
  getOsDataByName(name: string) {
    let short = 'UNK';
    const lowerName = String(name).toLowerCase();
    for (const key in OS_SYSTEMS) {
      if (lowerName === String(OS_SYSTEMS[key]).toLowerCase()) {
        name = OS_SYSTEMS[key];
        short = key;
        break;
      }
    }
    return { name, short };
  }

  parseFromClientHints(clientHintsData: ResultClientHints) {
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
      platform = comparePlatform(platform.toLowerCase(), clientHintsData.os.bitness);
      hintName = compareOsForClientHints(hintName);

      for (const osShort in OS_SYSTEMS) {
        const osName = OS_SYSTEMS[osShort];
        if (helper.fuzzyCompare(hintName, osName)) {
          name = String(osName);
          short = String(osShort);
          break;
        }
      }
    }

    if (name === 'Windows' && version !== '') {
      const majorVersion = ~~version.split('.', 1)[0];
      if (majorVersion === 0) {
        version = '';
      }
      if (majorVersion > 0 && majorVersion < 11) {
        version = '10';
      } else if (majorVersion > 10) {
        version = '11';
      }
    }

    return {
      name: name,
      short_name: short,
      version: version,
      platform: platform
    };
  }

  parseFromUserAgent(userAgent) {
    if (!userAgent) {
      return null;
    }
    for (let i = 0, l = this.collection.length; i < l; i++) {
      const item = this.collection[i];
      const regex = this.getBaseRegExp(item.regex);
      const match = regex.exec(userAgent);
      if (match !== null) {
        const {
          name,
          short
        } = this.getOsDataByName(this.buildByMatch(item.name, match));

        let version = item.version !== void 0
          ? this.buildVersion(item.version, match)
          : '';

        if (item.versions !== void 0) {
          for (const versionItem of item.versions) {
            const regex = this.getBaseRegExp(versionItem.regex);
            const match = regex.exec(userAgent);
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
    }

    return null;
  }

  /**
   *
   * @param {string} userAgent
   * @param {ResultClientHints} clientHints
   * @returns {ResultOs|null}
   */
  parse(userAgent: string, clientHints: ResultClientHints): ResultOs | null {
    userAgent = this.prepareUserAgent(userAgent);
    const hint = this.parseFromClientHints(clientHints);
    const data = this.parseFromUserAgent(userAgent);

    let name = '', version = '', platform = '', short = '', family = '';

    if (hint && hint.name) {
      name = hint.name;
      version = hint.version;
      platform = hint.platform;
      short = hint.short_name;

      // use version from user agent if non was provided in client hints, but os family from useragent matches
      if (version === '' && data && this.parseOsFamily(short) === data.family) {
        version = data.version;
      }

      //If the OS name detected from client hints matches the OS family from user agent
      // but the os name is another, we use the one from user agent, as it might be more detailed
      if (data && data.family === name && data.name !== name) {
        name = data.name;
      }

      if ('HarmonyOS' === name) {
        version = '';
        short = 'HAR';
      }

      if ('PICO OS' === name) {
        version = data.version;
        short = 'PIC';
      }

      if (data && data.name === 'Fire OS') {
        short = data.short_name;
        version = getVersionForMapping(version, FIRE_OS_VERSION_MAPPING);
      }

      if ('GNU/Linux' === name
        && data
        && 'Chrome OS' === data.name
        && version === data.version
      ) {
        name = data.name;
        short = data.short_name;
      }

      family = this.parseOsFamily(short);
    } else if (data && data.name) {
      name = data.name;
      version = data.version;
      short = data.short_name;
      platform = data.platform;
      family = data.family;
    }

    if (clientHints && data && clientHints.app) {
      if (ANDROID_APP_LIST.indexOf(clientHints.app) !== -1 && data.name !== 'Android') {
        name = 'Android';
        short = 'ADR';
        family = 'Android';
        version = '';
      }
      if (clientHints.app === 'org.mozilla.tv.firefox' && name !== 'Fire OS') {
        name = 'Fire OS';
        family = 'Android';
        short = 'FIR';
        version = getVersionForMapping(version, FIRE_OS_VERSION_MAPPING);
      }
      if (clientHints.app === 'org.lineageos.jelly' && name !== 'Lineage OS') {
        name = 'Lineage OS';
        family = 'Android';
        short = 'LEN';
        version = getVersionForMapping(data.version, LINEAGE_OS_VERSION_MAPPING);
      }
    }

    if (platform === '' && data) {
      platform = data.platform;
    }

    if (name === '') {
      return data;
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
  parsePlatform(userAgent: string): string {
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
    if (this.getBaseRegExp('64-?bit|WOW64|(?:Intel)?x64|WINDOWS_64|win64|amd64|x86_?64').test(userAgent)) {
      return 'x64';
    }
    if (this.getBaseRegExp('.+32bit|.+win32|(?:i[0-9]|x)86|i86pc').test(userAgent)) {
      return 'x86';
    }

    return '';
  }
}

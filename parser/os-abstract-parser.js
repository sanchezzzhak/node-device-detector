const ParserAbstract = require('./abstract-parser');

OS_SYSTEMS = require('./os/os_systems');
OS_FAMILIES = require('./os/os_families');

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
   *
   * @param {string} userAgent
   * @returns {null|{name: (string|*), short_name: string, family: string, version: string, platform: string}}
   */
  parse(userAgent) {
    for (let i = 0, l = this.collection.length; i < l; i++) {
      let item = this.collection[i];
      let regex = this.getBaseRegExp(item.regex);
      let match = regex.exec(userAgent);
      if (match !== null) {
        let name = this.buildByMatch(item.name, match);
        let short = 'UNK';
        for (let key in OS_SYSTEMS) {
          if (
            String(name).toLowerCase() === String(OS_SYSTEMS[key]).toLowerCase()
          ) {
            name = OS_SYSTEMS[key];
            short = key;
            break;
          }
        }
        return {
          name: name,
          short_name: short,
          version: this.buildVersion(item.version, match),
          platform: this.parsePlatform(userAgent),
          family: this.parseOsFamily(short),
        };
      }
    }
    return null;
  }

  /**
   * parse ua platform
   * @param {string} userAgent
   * @return {string}
   */
  parsePlatform(userAgent) {
    if (
      this.getBaseRegExp('arm|aarch64|Watch ?OS|Watch1,[12]').test(userAgent)
    ) {
      return 'ARM';
    }
    if (this.getBaseRegExp('mips').test(userAgent)) {
      return 'MIPS';
    }
    if (this.getBaseRegExp('sh4').test(userAgent)) {
      return 'SuperH';
    }
    if (this.getBaseRegExp('WOW64|x64|win64|amd64|x86_?64').test(userAgent)) {
      return 'x64';
    }
    if (this.getBaseRegExp('(?:i[0-9]|x)86|i86pc').test(userAgent)) {
      return 'x86';
    }

    return '';
  }
}

module.exports = OsAbstractParser;

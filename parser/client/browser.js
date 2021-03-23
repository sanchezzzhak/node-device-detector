const ClientAbstractParser = require('./../client-abstract-parser');
const CLIENT_TYPE = require('./../const/client-type');
const BROWSER_SHORT = require('./browser-short');
const BROWSER_FAMILIES = require('./browser-families');
const helper = require('./../helper');

class Browser extends ClientAbstractParser {
  constructor() {
    super();
    this.engine_collection = [];
    this.fixtureFile = 'client/browsers.yml';
    this.loadCollection();
  }

  loadCollection() {
    super.loadCollection();
    this.engine_collection = this.loadYMLFile('client/browser_engine.yml');
  }

  /**
   * @param {string} userAgent
   * @returns {{engine: string, name: (string|*), short_name: string, type: string, engine_version: string, family: (string|string), version: string}|null}
   */
  parse(userAgent) {
    for (let i = 0, l = this.collection.length; i < l; i++) {
      let item = this.collection[i];
      let regex = this.getBaseRegExp(item.regex);
      let match = regex.exec(userAgent);

      if (match !== null) {
        let name = this.buildByMatch(item.name, match);
        let version = this.buildVersion(item.version, match);

        let short = this.buildShortName(name);
        let engine = this.buildEngine(
          item.engine !== undefined ? item.engine : {},
          version
        );
        if (engine === '') {
          engine = this.parseEngine(userAgent);
        }

        let engineVersion = this.buildEngineVersion(userAgent, engine);
        let family = this.buildFamily(short);

        return {
          type: CLIENT_TYPE.BROWSER,
          name: name,
          short_name: String(short),
          version: version,
          engine: engine,
          engine_version: engineVersion,
          family: family,
        };
      }
    }

    return null;
  }

  /**
   * @param {string} shortName
   * @returns {string}
   */
  buildFamily(shortName) {
    for (let browserFamily in BROWSER_FAMILIES) {
      if (
        browserFamily &&
        BROWSER_FAMILIES[browserFamily] &&
        BROWSER_FAMILIES[browserFamily].indexOf(shortName) !== -1
      ) {
        return browserFamily;
      }
    }
    return '';
  }

  /**
   * @param {string} engine
   * @param {string} browserVersion
   * @return {string}
   */
  buildEngine(engine, browserVersion) {
    let result = '';
    if (engine.hasOwnProperty('default') && engine.default !== '') {
      result = engine.default;
    }
    if (engine.hasOwnProperty('versions')) {
      let versions = Object.keys(engine.versions).sort(helper.versionCompare);
      for (let i = 0, l = versions.length; i < l; i++) {
        if (
          browserVersion !== '' &&
          helper.versionCompare(browserVersion, versions[i]) >= 0
        ) {
          result = engine.versions[versions[i]];
        }
      }
    }
    return result;
  }

  /**
   *
   * @param {string} userAgent
   * @returns {string}
   */
  parseEngine(userAgent) {
    let result = '';
    for (let i = 0, l = this.engine_collection.length; i < l; i++) {
      let item = this.engine_collection[i];
      let regex = this.getBaseRegExp(item.regex);
      let match = regex.exec(userAgent);
      if (match !== null) {
        result = item.name;
        break;
      }
    }
    return result;
  }

  /**
   * @param {string} userAgent
   * @param {string} engine
   * @return {string}
   */
  buildEngineVersion(userAgent, engine) {
    if (engine === '') {
      return '';
    }

    if (engine === 'Gecko') {
      let pattern = '[ ](?:rv[: ]([0-9.]+)).*gecko/[0-9]{8,10}';
      let regexp = new RegExp(pattern, 'i');
      let match = regexp.exec(userAgent);
      if (match !== null) {
        return match.pop();
      }
    }

    let regexp = new RegExp(
      engine +
        '\\s*\\/?\\s*(((?=\\d+\\.\\d)\\d+[.\\d]*|\\d{1,7}(?=(?:\\D|$))))',
      'i'
    );
    let match = regexp.exec(userAgent);
    if (match !== null) {
      return match.pop();
    }
    return '';
  }

  /**
   * @param {string} name
   * @return {string}
   */
  buildShortName(name) {
    const UNKNOWN = 'UNK';
    for (let key in BROWSER_SHORT) {
      if (
        String(name).toLowerCase() === String(BROWSER_SHORT[key]).toLowerCase()
      ) {
        return key;
      }
    }
    return UNKNOWN;
  }
}

module.exports = Browser;

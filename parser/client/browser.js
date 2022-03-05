const ClientAbstractParser = require('./../client-abstract-parser');
const CLIENT_TYPE = require('./../const/client-type');
const BROWSER_FAMILIES = require('./browser-families');
const ArrayPath = require('./../../lib/array-path');
const helper = require('./../helper');
const ClientHintsApp = require('./client-hints-app');

const BROWSER_SHORT = helper.revertObject(require('./browser-short'));

const clientHintApp = new ClientHintsApp;

const compareBrandForClientHints = (brand) => {
  const CLIENTHINT_MAPPING = {
    'Chrome': ['Google Chrome']
  };
  for (let brandName in CLIENTHINT_MAPPING) {
    for (let mapBrand of CLIENTHINT_MAPPING[brandName]) {
      if (brand.toLowerCase() === mapBrand.toLowerCase()) {
        return brandName;
      }
    }
  }
  return brand;
}


class Browser extends ClientAbstractParser {
  constructor() {
    super();
    this.engine_collection = [];
    this.fixtureFile = 'client/browsers.yml';
    this.loadCollection();
  }

  getCollectionBrowsers() {
    return BROWSER_SHORT;
  }

  getAvailableBrowsers() {
    return Object.keys(this.getCollectionBrowsers());
  }

  loadCollection() {
    super.loadCollection();
    this.engine_collection = this.loadYMLFile('client/browser_engine.yml');
  }

  /**
   * @param {string} userAgent
   * @param {*} clientHintsData
   * @returns {{engine: string, name: (string|*), short_name: string, type: string, engine_version: string, family: (string|string), version: string}|null}
   */
  parse(userAgent, clientHintsData) {

    let app = this.parseFromClientHintsApp(clientHintsData);
    let hint = this.parseFromClientHints(clientHintsData);
    let data = this.parseFromUserAgent(userAgent);

    let type = CLIENT_TYPE.BROWSER;
    let name = '';
    let version = '';
    let engine = '';
    let engineVersion = '';
    let short = ''
    let family = '';

    // client-hint+user-agent
    if (hint.name && hint.version) {
      name = hint.name;
      version = hint.version;
      short = hint.short_name;
      family = this.buildFamily(short);

      if (data) {
        if (
            'Chromium' === name && 'Chromium' !== data.name
            && 'Chrome' === this.buildFamily(data.short_name)
        ) {
          name = data.name;
          short = data.short_name;
          version = data.version
          family = this.buildFamily(short);
        }

        // Fix mobile browser names e.g. Chrome => Chrome Mobile
        if (name + ' Mobile' === data.name) {
          name = data.name;
          short = data.short_name;
        }

        if (name !== data.name && family === this.buildFamily(data.short_name)) {
          engine = data.engine;
          engineVersion = data.engine_version;
        }

        if (name === data.name) {
          engine = data.engine;
          engineVersion = data.engine_version;
          if (data.version && data.version.indexOf(version) === 0 && helper.versionCompare(version, data.version) < 0) {
            version = data.version;
          }
        }
      }
    } else if (data !== null) {
      name = data.name;
      version = data.version;
      short = data.short_name;
      engine = data.engine;
      engineVersion = data.engine_version;
      family = data.family;
    }

    if (app !== null && app.name !== name){
      name = app.name;
      type = String(app.type);
      version = '';

      if (/Chrome\/.+ Safari\/537.36/.test(userAgent)) {
        engine = 'Blink'
        engineVersion = '';
        family = 'Chrome';
      }
    }

    if (name === '') {
      return null;
    }

    return {
      type: String(type),
      name: String(name),
      short_name: String(short),
      version: String(version),
      engine: String(engine),
      engine_version: String(engineVersion),
      family: String(family),
    }
  }

  parseFromClientHintsApp(clientHints) {
    return clientHintApp.parse(clientHints);
  }

  parseFromClientHints(clientHints) {
    let name = '';
    let short = '';
    let version = '';

    if (clientHints && clientHints.client) {
      let brands = ArrayPath.get(clientHints, 'client.brands', []);

      for (let brandItem of brands) {
        if (brandItem.brand === 'Chromium') {
          continue;
        }
        let brand = compareBrandForClientHints(brandItem.brand);
        for (let browserName in this.getCollectionBrowsers()) {
          let shortName = this.getCollectionBrowsers()[browserName];
          let found = helper.fuzzyCompare(`${brand}`, browserName)
              || helper.fuzzyCompare(`${brand} Browser`, browserName)
              || helper.fuzzyCompare(`${brand}`, browserName + ' Browser');

          if (found) {
            name = String(browserName);
            short = String(shortName);
            version = String(brandItem.version);
            break;
          }
        }
      }

      if (clientHints.client.version) {
        version = String(clientHints.client.version)
      }
    }

    return {
      name: name,
      short_name: short,
      version: version
    };
  }

  parseFromUserAgent(userAgent) {
    if (!userAgent) {
      return null;
    }

    for (let i = 0, l = this.collection.length; i < l; i++) {
      let item = this.collection[i];
      let regex = this.getBaseRegExp(item.regex);
      let match = regex.exec(userAgent);

      if (match !== null) {
        let name = this.buildByMatch(item.name, match);
        name = this.buildName(name);
        let version = this.buildVersion(item.version, match);

        let short = this.buildShortName(name);
        let engine = this.buildEngine(
            item.engine !== void 0 ? item.engine : {},
            version
        );
        if (engine === '') {
          engine = this.parseEngine(userAgent);
        }

        let engineVersion = this.buildEngineVersion(userAgent, engine);
        let family = this.buildFamily(short);

        return {
          name: name,
          short_name: String(short),
          version: version,
          engine: String(engine),
          engine_version: String(engineVersion),
          family: family,
        };
      }
    }
    return null;
  }

  /**
   *  normalisation browser name from any case
   *
   * @param {string} name
   * @returns {string}
   */
  buildName(name) {
    let result = name;
    let normalName = this.getCollectionBrowsers()[name];
    if (normalName === void 0) {
      let lname = name.toLowerCase();
      let browsers = this.getAvailableBrowsers();
      for (let i = 0, l = browsers.length; i < l; i++) {
        if (lname === browsers[i].toLowerCase()) {
          result = browsers[i];
          break
        }
      }
    }
    return result;
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
    let result = this.getCollectionBrowsers()[name];
    if (result !== void 0) {
      return result;
    }
    return UNKNOWN;
  }
}

module.exports = Browser;

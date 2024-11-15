const ClientAbstractParser = require('./../client-abstract-parser');
const CLIENT_TYPE = require('./../const/client-type');
const BROWSER_FAMILIES = require('./browser-families');
const ArrayPath = require('./../../lib/array-path');
const helper = require('./../helper');
const BrowserHints = require('./hints/browser-hints');

const BROWSER_SHORT = helper.revertObject(require('./browser-short'));
const browserHints = new BrowserHints;

const CLIENTHINT_MAPPING = {
  'Chrome': ['Google Chrome'],
  'Chrome Webview': ['Android WebView'],
  'DuckDuckGo Privacy Browser': ['DuckDuckGo'],
  'Edge WebView': ['Microsoft Edge WebView2'],
  'Mi Browser': ['Miui Browser', 'XiaoMiBrowser'],
  'Microsoft Edge': ['Edge'],
  'Norton Private Browser': ['Norton Secure Browser'],
  'Vewd Browser': ['Vewd Core'],
};

const BROWSERHINT_SKIP_VERSION = ['A0', 'AL', 'HP', 'JR', 'MU', 'OM', 'OP', 'VR'];

const compareBrandForClientHints = (brand) => {
  for (let brandName in CLIENTHINT_MAPPING) {
    for (let mapBrand of CLIENTHINT_MAPPING[brandName]) {
      if (brand.toLowerCase() === mapBrand.toLowerCase()) {
        return brandName;
      }
    }
  }
  return brand;
};

class Browser extends ClientAbstractParser {
  constructor() {
    super();
    this.engine_collection = [];
    this.fixtureFile = 'client/browsers.yml';
    this.loadCollection();
    this.type = CLIENT_TYPE.BROWSER;
    this.collectionLength = this.collection.length;
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
   * Generates the result for the parse method
   *
   * @param {string} userAgent
   * @param {{}} data
   * @param {{}} hint
   * @param {{}} hash
   * @returns {null|ResultClient}
   */
  prepareParseResult(
    userAgent,
    data,
    hint,
    hash
  ) {

    let type = CLIENT_TYPE.BROWSER;
    let name = '';
    let version = '';
    let engine = '';
    let engineVersion = '';
    let short = '';
    let family = '';

    // use client hints in favor of user agent data if possible
    if (hint && hint.name && hint.version) {
      name = hint.name;
      version = hint.version;
      short = hint.short_name;
      family = this.buildFamily(short);

      // If the version reported from the client hints is YYYY or YYYY.MM (e.g., 2022 or 2022.04),
      // then it is the Iridium browser
      // https://iridiumbrowser.de/news/
      if (/^202[0-4]/.test(version)) {
        name = 'Iridium';
        short = 'I1';
      }

      if (data) {
        // https://bbs.360.cn/thread-16096544-1-1.html
        if (/^15/.test(version) && /^114/.test(data.version)) {
          name          = '360 Secure Browser';
          short         = '3B';
          engine        = data.engine;
          engineVersion = data.engine_version;
        }

        // If client hints report the following browsers, we use the version from useragent
        if (data.version && BROWSERHINT_SKIP_VERSION.indexOf(short) !== -1) {
          version = data.version;
        }

        if ('Vewd Browser' === name) {
          engine = data.engine;
          engineVersion = data.engine_version;
        }
        // If client hints report Chromium, but user agent detects a Chromium based browser, we favor this instead
        const hasChromeBased =  ('Chromium' === name || 'Chrome Webview' === name) && data.name
          && ['CR', 'CV', 'AN'].indexOf(data.short_name) === -1;
        if (hasChromeBased) {
          name = data.name;
          short = data.short_name;
          version = data.version;
          family = this.buildFamily(short);
        }
        // Fix mobile browser names e.g. Chrome => Chrome Mobile
        if (name + ' Mobile' === data.name) {
          name = data.name;
          short = data.short_name;
        }
        // If user agent detects another browser, but the family matches, we use the detected engine from user agent
        if (name !== data.name && family === this.buildFamily(data.short_name)) {
          engine = data.engine;
          engineVersion = data.engine_version;
        }
        // If the browser name matches the client hints then browser engine overwrite
        if (name === data.name) {
          engine = data.engine;
          engineVersion = data.engine_version;
        }
        // In case the user agent reports a more detailed version, we try to use this instead
        if (data.version && data.version.indexOf(version) === 0 && helper.versionCompare(version, data.version) < 0) {
          version = data.version;
        }
      }


      // If DDG Private browser then set version empty string
      if ('DuckDuckGo Privacy Browser' === name) {
        version = '';
      }

      // In case client hints report a more detailed engine version, we try to use this instead
      if ('Blink' === engine && 'Iridium' !== name && helper.versionCompare(engineVersion, hint.version) < 0) {
        engineVersion = hint.version;
      }

    } else if (data !== null) {
      name = data.name;
      version = data.version;
      short = data.short_name;
      engine = data.engine;
      engineVersion = data.engine_version;
    }

    family = this.buildFamily(short);

    // is app id
    if (hash !== null && name !== hash.name) {
      name = hash.name;
      version = '';
      short = this.buildShortName(name);

      if (/Chrome\/.+ Safari\/537.36/.test(userAgent)) {
        engine = 'Blink';
        family = this.buildFamily(short) || 'Chrome';
        engineVersion = this.buildEngineVersion(userAgent, engine);
      }
    }

    // exclude Blink engine version for browsers
    if ('Blink' === engine && 'Flow Browser' === name) {
      engineVersion = '';
    }
    // the browser simulate ua for Android OS
    if ('Every Browser' === name) {
      family = 'Chrome';
      engine = 'Blink';
      engineVersion = '';
    }
    // This browser simulates user-agent of Firefox
    if ('TV-Browser Internet' === name && 'Gecko' === engine) {
      family = 'Chrome';
      engine = 'Blink';
      engineVersion = '';
    }

    if ('Wolvic' === name) {
      if ('Blink' === engine) {
        family = 'Chrome';
      }
      if ('Gecko' === engine) {
        family = 'Firefox';
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
      family: String(family)
    };
  }

  /**
   * General method for parsing user-agent and client-hints
   *
   * @param {string} userAgent
   * @param {} clientHints
   * @returns {ResultClient|null}
   */
  parse(userAgent, clientHints) {
    userAgent = this.prepareUserAgent(userAgent);
    const hash = this.parseFromHashHintsApp(clientHints);
    const hint = this.parseFromClientHints(clientHints);
    const data = this.parseFromUserAgent(userAgent, clientHints);
    return this.prepareParseResult(userAgent, data, hint, hash);
  }

  /**
   * Parses client-hints for getting the browser name from the application ID (clientHints.app)
   *
   * @param {ResultClientHints} clientHints
   * @return {{name: string}}
   */
  parseFromHashHintsApp(clientHints) {
    return browserHints.parse(clientHints);
  }

  /**
   * Parses client-hints for getting browser name, version, short name
   *
   * @param {ResultClientHints} clientHints
   * @return {{name: string, short_name: string, version: string}}
   */
  parseFromClientHints(clientHints) {
    let name = '';
    let short = '';
    let version = '';

    if (clientHints && clientHints.client) {
      const brands = ArrayPath.get(clientHints, 'client.brands', []);
      for (let brandItem of brands) {
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

        // If we detected a brand, that is not chromium,
        // we will use it, otherwise we will look further
        if ('' !== name && 'Chromium' !== name && 'Microsoft Edge' !== name) {
          break;
        }
      }

      if (clientHints.client.version) {
        version = String(clientHints.client.version);
      }
    }

    return {
      name: name,
      short_name: short,
      version: this.buildVersion(version, [])
    };
  }

  /**
   * Inline parse userAgent by position collection
   *
   * @param {string} userAgent
   * @param {number} position
   * @return {{engine: *, name: string, short_name: *, engine_version: *, family: string, version: string}|null}
   */
  parseUserAgentByPosition(userAgent, position = 0) {
    let item = this.collection[position];
    if (item === void 0) {
      return null;
    }

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
        family: family
      };
    }

    return null;
  }

  parseFromUserAgent(userAgent) {
    if (!userAgent) {
      return null;
    }
    return super.parse(userAgent, {});
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
          break;
        }
      }
    }
    return result;
  }

  /**
   * Get short code browser for full name browser
   *
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

  /**
   * Get browser family for short name browser
   *
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
   * Get browser engine for engine name and versions
   *
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
   * Get engine name for parser engines
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
   * Get engine version for useragent and engine name
   *
   * @param {string} userAgent
   * @param {string} engine
   * @return {string}
   */
  buildEngineVersion(userAgent, engine) {
    if (engine === '') {
      return '';
    }
    if (engine === 'Gecko' || engine === 'Clecko') {
      let pattern = '[ ](?:rv[: ])([0-9.]+)';
      let regexp = new RegExp(pattern, 'i');
      let match = regexp.exec(userAgent);
      if (match !== null && /(?:g|cl)ecko\/[0-9]{8,10}/i.test(userAgent)) {
        return match[1];
      }
    }

    let engineToken = '' + engine;

    if ('Blink' === engine) {
      engineToken = 'Chr[o0]me|Chromium|Cronet';
    }

    if ('LibWeb' === engine) {
      engineToken = 'LibWeb\\+LibJs\\/';
    }

    if ('Arachne' === engine) {
      engineToken = 'Arachne\\/5\\.';
    }

    let regexp = new RegExp(
      '(?:' + engineToken + ')' +
      '\\s*[/_]?\\s*(((?=\\d+\\.\\d)\\d+[.\\d]*|\\d{1,7}(?=(?:\\D|$))))',
      'i'
    );

    let match = regexp.exec(userAgent);
    if (match !== null) {
      return match[1]
    }

    return '';
  }
}

module.exports = Browser;

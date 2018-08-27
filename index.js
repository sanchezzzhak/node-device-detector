module.exports = DeviceDetector;
module.exports.DeviceDetector = DeviceDetector;

const YAML = require('yamljs');

const BASE_REGEXES_DIR = __dirname + '/regexes';
const BASE_DATA_DIR = __dirname + '/data';

const CLIENT_TYPE = {
  MOBILE_APP: 'mobile app',
  BROWSER: 'browser'
};

const DEVICE_TYPE = {
  DESKTOP: 'desktop',
  SMARTPHONE: 'smartphone',
  TABLET: 'tablet',
  FEATURE_PHONE: 'feature phone',
  CONSOLE: 'console',
  TV: 'tv',
  CAR_BROWSER: 'car browser',
  SMART_DISPLAY: 'smart display',
  CAMERA: 'camera',
  PORTABLE_MEDIA_PAYER: 'portable media player',
  PHABLET: 'phablet',
};

const OS_ANDROID = 'Android';
const OS_DESKTOP = [
  'AmigaOS',
  'IBM',
  'GNU/Linux',
  'Mac',
  'Unix',
  'Windows',
  'BeOS',
  'Chrome OS'
];
const UNKNOWN = 'UNK';
/**
 *  ===================================
 *  JsDocs: Structure data result
 *  ===================================
 /**
 * @typedef {Object} DeviceDataObject
 * @property {String} type
 * @property {String} brand
 * @property {String} model
 *
 * @typedef {Object} AppDataObject
 * @property {String} name
 * @property {String} version
 * @property {String} type
 *
 * @typedef {Object} ClientDataObject
 * @property {String} type
 * @property {String} name
 * @property {String} short_name
 * @property {String} version
 * @property {String} engine
 * @property {String} engine_version
 *
 * @typedef {Object} OsDataObject
 * @property {String} name
 * @property {String} short_name
 * @property {String} version
 * @property {String} platform
 */

/**
 * helper prepare version
 * @param ver1
 * @param ver2
 * @return {boolean}
 */
function versionCompare(ver1, ver2) {
  if (ver1 === ver2) {
    return 0;
  }
  let left = ver1.split(".");
  let right = ver2.split(".");
  var len = Math.min(left.length, right.length);
  for (let i = 0; i < len; i++) {
    if (parseInt(left[i]) > parseInt(right[i])) {
      return 1;
    }
    if (parseInt(left[i]) < parseInt(right[i])) {
      return -1;
    }
  }
  if (left.length > right.length) {
    return 1;
  }
  if (left.length < right.length) {
    return -1;
  }
  return 0;
}

/**
 * helper prepare base regExp + part regExp
 * @param str
 * @return {RegExp}
 */
function getBaseRegExp(str) {
  str = str.replace(new RegExp('/', 'g'), '\\/');
  str = str.replace(new RegExp('\\+\\+', 'g'), '+');
  str = '(?:^|[^A-Z0-9\-_]|[^A-Z0-9\-]_|sprd-)(?:' + str + ')';
  return new RegExp(str, 'i');
}

/**
 * @param options
 * @constructor
 */
function DeviceDetector(options) {

  this.osData = null;
  this.clientData = null;
  this.deviceData = null;

  this.browser_collection = [];
  this.browser_shorts_collection= [];
  this.browser_engine_collection = [];

  this.app_collection = [];
  this.os_collection = [];
  this.os_systems = [];
  this.os_families = [];
  this.os_collection = [];
  this.device_collection = [];

  this.init();
}

/**
 * load collections
 */
DeviceDetector.prototype.init = function() {
  this.loadAppCollection();
  this.loadBrowserCollection();
  this.loadOsCollection();
  this.loadBrandCollection();
};

/**
 *  ===================================
 *  Collections
 *  ===================================
 */

DeviceDetector.prototype.loadAppCollection = function () {
  this.app_collection = YAML.load(BASE_REGEXES_DIR + '/client/mobile_apps.yml');
};

DeviceDetector.prototype.loadBrowserCollection = function () {
  this.browser_collection = YAML.load(BASE_REGEXES_DIR + '/client/browsers.yml');
  this.browser_engine_collection = YAML.load(BASE_REGEXES_DIR + '/client/browser_engine.yml');
  this.browser_shorts_collection = require(BASE_DATA_DIR + '/browsers.json');
};

DeviceDetector.prototype.loadOsCollection = function () {
  this.os_collection = YAML.load( BASE_REGEXES_DIR + '/oss.yml');

  this.os_families = require(BASE_DATA_DIR + '/os_families.json');
  this.os_systems = require(BASE_DATA_DIR + '/os_systems.json');
};

DeviceDetector.prototype.loadBrandCollection = function () {
  console.log('DeviceDetector load device/mobiles.yml');
  let path = BASE_REGEXES_DIR + '/device/mobiles.yml';
  this.device_collection = YAML.load(path);
};


/**
 *  ===================================
 *  helpers
 *  ===================================
 */

/**
 *
 * @param result
 * @return {string}
 */
DeviceDetector.prototype.fixStringName = function (result) {
  return result.replace(new RegExp('_', 'g'), ' ').replace(/ TD$/i, '');
};

/**
 * @param result
 * @return {string}
 */
DeviceDetector.prototype.fixStringVersion = function (result) {
  return result.replace(new RegExp('_', 'g'), '.').trim();
};

/**
 *
 * @param version
 * @param matches
 * @return {string}
 */
DeviceDetector.prototype.buildVersion = function (version, matches) {
  return this.fixStringVersion(this.buildByMatch(version, matches));
};

/**
 * @param userAgent
 * @param engine
 * @return {string}
 */
DeviceDetector.prototype.buildEngineVersion = function(userAgent, engine){
  if(engine === ''){
    return '';
  }
  let regexp = new RegExp(engine + '\\s*\\/?\\s*(((?=\\d+\\.\\d)\\d+[.\\d]*|\\d{1,7}(?=(?:\\D|$))))', 'i');
  let match = regexp.exec(userAgent);
  if(match){
    return match.pop();
  }
  return '';
};

/**
 * @param engine
 * @param browserVersion
 * @return {string}
 */
DeviceDetector.prototype.buildEngine = function (engine, browserVersion) {
  let result = '';
  if (engine.hasOwnProperty('default') && engine.default !== '') {
    result = engine.default;
  }
  if (engine.hasOwnProperty('versions')) {
    for (let version in engine.versions) {
      if (versionCompare(browserVersion, version) >=0) {
        result = engine.versions[version];
      }
    }
  }
  return result;
};

/**
 * @param model
 * @param matches
 * @return {*}
 */
DeviceDetector.prototype.buildModel = function (model, matches) {
  model = this.fixStringName(this.buildByMatch(model, matches));
  return (model === 'Build') ? null : model;
};

/**
 * @param item
 * @param matches
 * @return {string|*}
 */
DeviceDetector.prototype.buildByMatch = function (item, matches) {
  item = item.toString();
  if (item.indexOf('$') !== -1) {
    for (let nb = 1; nb <= 3; nb++) {
      if (item.indexOf('$' + nb) === -1) {
        continue;
      }
      let replace = (matches[nb] !== undefined) ? matches[nb] : '';
      item = item.replace('$' + nb, replace);
    }
  }
  return item;
};

/**
 * @param userAgent
 * @return {DeviceDataObject}
 */
DeviceDetector.prototype.findDevice = function (userAgent) {
  let model = '';
  let brand = '';
  let deviceType = '';
  for (let cursor in this.device_collection) {
    let match = getBaseRegExp(this.device_collection[cursor]['regex']).exec(userAgent);
    if (match) {
      deviceType = this.device_collection[cursor]['device'];
      if (this.device_collection[cursor]['models'] !== undefined) {
        let models = this.device_collection[cursor]['models'];
        for (let i = 0, l = models.length; i < l; i++) {
          let data = models[i];
          let modelMatch = getBaseRegExp(data.regex).exec(userAgent);
          if (modelMatch) {
            model = this.buildModel(data.model, modelMatch);
            if (data.device !== undefined) {
              deviceType = data.device;
            }
            break;
          }
        }
      } else if (this.device_collection[cursor]['model'] !== undefined) {
        model = this.buildModel(this.device_collection[cursor]['model'], match);
      }
      brand = String(cursor).trim();
      model = String(model).trim();
      break;
    }
  }

  if(deviceType === ''){
    deviceType = this.findDeviceType(userAgent)
  }

  return {
    brand: brand,
    model: model,
    type: deviceType
  };
};


/**
 *
 * @param userAgent
 * @return {AppDataObject|*}
 */
DeviceDetector.prototype.findApp = function (userAgent) {
  for (let i = 0, l = this.app_collection.length; i < l; i++) {
    let item = this.app_collection[i];
    let regex = getBaseRegExp(item.regex);
    let match  = regex.exec(userAgent);
    if (match !== null ) {
      return {
        name: this.buildByMatch(item.name, match),
        version: this.buildVersion(item.version, match),
        type: CLIENT_TYPE.MOBILE_APP
      }
    }
  }
  return null;
};

DeviceDetector.prototype.findEngine = function(userAgent) {
  let result = '';
  for (let i = 0, l = this.browser_engine_collection.length; i < l; i++) {
    let item = this.browser_engine_collection[i];
    let regex = getBaseRegExp(item.regex);
    let match = regex.exec(userAgent);
    if (match !==null ) {
      result = item.name;
      break;
    }
  }
  return result;
};

/**
 *
 * @param userAgent
 * @return {*}
 */
DeviceDetector.prototype.findBrowser = function (userAgent) {
  for (let i = 0, l = this.browser_collection.length; i < l; i++) {
    let item = this.browser_collection[i];
    let regex = getBaseRegExp(item.regex);
    let match;
    if (match = regex.exec(userAgent)) {
      let name = this.buildByMatch(item.name, match);
      let version = this.buildVersion(item.version, match);
      let short = UNKNOWN;

      for (let key in this.browser_shorts_collection) {
        if (String(name).toLowerCase() === String(this.browser_shorts_collection[key]).toLowerCase()) {
          short = key;
          break;
        }
      }
      let engine = this.buildEngine(item.engine !== undefined ? item.engine : {}, version);
      if(engine === ''){
        engine = this.findEngine(userAgent);
      }
      let engineVersion = this.buildEngineVersion(userAgent, engine);

      return {
        engine: engine,
        engine_version: engineVersion,
        short_name: short,
        name: name,
        version: version,
        type: CLIENT_TYPE.BROWSER
      }
    }
  }
  return null;
};

/**
 * @param userAgent
 * @return {OsDataObject|*}
 */
DeviceDetector.prototype.findOs = function (userAgent) {
  for (let i = 0, l = this.os_collection.length; i < l; i++) {
    let item = this.os_collection[i];
    let regex = getBaseRegExp(item.regex);
    let match;
    if (match = regex.exec(userAgent)) {
      let name = this.buildByMatch(item.name, match);
      let short = UNKNOWN;
      for(let key in this.os_systems){
        if (String(name).toLowerCase() === String(this.os_systems[key]).toLowerCase()) {
          name = this.os_systems[key];
          short = key;
          break;
        }
      }

      return {
        name: name,
        version: this.buildVersion(item.version, match),
        platform: this.findPlatform(userAgent),
        short_name: short
      }
    }
  }
  return null;
};

/**
 * parse ua platform
 * @param userAgent {string}
 * @return {string}
 */
DeviceDetector.prototype.findPlatform = function (userAgent) {
  if (/arm/i.test(userAgent)) {
    return 'ARM';
  } else if (/WOW64|x64|win64|amd64|x86_64/i.test(userAgent)) {
    return 'x64';
  } else if (/i[0-9]86|i86pc/i.test(userAgent)) {
    return 'x86';
  }
  return '';
};

/**
 * has check userAgent fragment is android tabled
 * @param {String} userAgent
 * @return {Boolean}
 */
DeviceDetector.prototype.isAndroidTable = function(userAgent){
  let regex =  'Android( [\.0-9]+)?;.*Tablet;';
  let match = getBaseRegExp(regex).exec(userAgent);
  return match !== null;
};

/**
 * has check userAgent fragment is opera table
 * @param {String} userAgent
 * @return {Boolean}
 */
DeviceDetector.prototype.isOperaTablet = function(userAgent){
  let regex =  'Opera Tablet';
  let match = getBaseRegExp(regex).exec(userAgent);
  return match !== null;
};

/**
 * has check userAgent fragment is android mobile
 * @param {String} userAgent
 * @return {Boolean}
 */
DeviceDetector.prototype.isAndroidMobile = function(userAgent){
  let regex = 'Android( [\.0-9]+)?;.*Mobile;';
  let match = getBaseRegExp(regex).exec(userAgent);
  return match !== null;
};

/**
 * find device type
 * @param userAgent
 * @return {string}
 */
DeviceDetector.prototype.findDeviceType = function (userAgent) {
  let osData = this.osData;
  if(osData === null){
    let osData = this.findOs(userAgent);
  }
  if(osData.hasOwnProperty('name') && osData.name === OS_ANDROID){
    if (getBaseRegExp('Chrome/[\.0-9]* Mobile').exec(userAgent)!==null) {
      return DEVICE_TYPE.SMARTPHONE;
    } else if (getBaseRegExp('Chrome/[\.0-9]* (?!Mobile)').exec(userAgent)!==null) {
      return DEVICE_TYPE.TABLET;
    }
  }
  if(this.isOperaTablet(userAgent)){
    return DEVICE_TYPE.TABLET;
  }
  if(this.isAndroidTable(userAgent)){
    return DEVICE_TYPE.TABLET;
  }
  if(this.isAndroidMobile(userAgent)){
    return DEVICE_TYPE.SMARTPHONE;
  }

  if(osData.hasOwnProperty('name') && osData.name === OS_ANDROID){
    if (!versionCompare(osData.version, '2.0')) {
      return DEVICE_TYPE.SMARTPHONE;
    } else if (versionCompare(osData.version, '3.0') && !versionCompare(osData.version, '4.0')) {
      return DEVICE_TYPE.TABLET;
    }
  }

  if(OS_DESKTOP.indexOf(osData.name) !== -1){
    return DEVICE_TYPE.DESKTOP;
  }
  return '';
};

/**
 * reset last search result
 */
DeviceDetector.prototype.reset = function(){
  this.osData = null;
  this.clientData = null;
  this.deviceData = null;
};

/**
 *
 * @param {String} userAgent
 * @return {*}
 */
DeviceDetector.prototype.detect = function (userAgent) {
  this.reset();

  this.osData = this.findOs(userAgent);
  this.clientData = this.findApp(userAgent);
  this.deviceData = this.findDevice(userAgent);

  // is app not found then find browser
  if (this.clientData === null) {
    this.clientData = this.findBrowser(userAgent);
  }
  return {
    os: this.osData,
    client: this.clientData,
    device: this.deviceData
  };
};






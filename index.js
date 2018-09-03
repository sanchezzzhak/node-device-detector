module.exports = DeviceDetector;
module.exports.DeviceDetector = DeviceDetector;

const YAML = require('yamljs');

const BASE_REGEXES_DIR = __dirname + '/regexes';
const BASE_DATA_DIR = __dirname + '/data';

const CLIENT_TYPE = {
  MOBILE_APP: 'mobile app',
  BROWSER: 'browser'
};

const COLLECTION = {
  DEVICE: 'device_collection',
  CAMERA: 'camera_collection',
  PORTABLE_MEDIA_PLAYER: 'portable_media_player_collection',
  CONSOLE: 'console_collection',
  APP: 'app_collection',
  OS: 'os_collection',
  BROWSER: 'browser_collection',
  BROWSER_ENGINE: 'browser_engine_collection',
  BROWSER_SHORTS: 'browser_shorts_collection',
  OS_FAMILIES: 'os_families',
  OS_SYSTEMS: 'os_systems',
  TV: 'tv_collection',
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
  PORTABLE_MEDIA_PLAYER: 'portable media player',
  PHABLET: 'phablet',
};

const TV_BROWSER = [
  'Kylo',
  'Espial TV Browser'
];
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
 * @property {String} brand_id
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
 * @return {Number}
 */
function versionCompare(ver1, ver2) {
  if (ver1 === ver2) {
    return 0;
  }
  let left = ver1.split(".");
  let right = ver2.split(".");
  let len = Math.min(left.length, right.length);
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
 * helper is DeviceDataObject empty
 * @param result {DeviceDataObject}
 * @return {boolean}
 */
function isEmptyDeviceResult(result) {
  return result.brand === '' && result.model === '' && result.type === '';
}

/**
 * @param options
 * @constructor
 */
function DeviceDetector(options) {

  this.osData = null;
  this.clientData = null;
  this.deviceData = null;

  this.collection = [];
  this.browser_shorts_collection= [];
  this.browser_engine_collection = [];

  this.app_collection = [];
  this.collection = [];
  this.os_systems = [];
  this.os_families = [];
  this.collection = [];
  this.device_collection = [];
  this.camera_collection = [];
  this.portable_media_player_collection = [];
  this.console_collection = [];
  this.tv_collection = [];

  this.init();
}

/**
 * load collections
 */
DeviceDetector.prototype.init = function() {
  this.loadCollectionYml(COLLECTION.APP, '/client/mobile_apps.yml');
  this.loadCollectionYml(COLLECTION.APP, '/client/mobile_apps.yml');
  this.loadCollectionYml(COLLECTION.PORTABLE_MEDIA_PLAYER, '/device/portable_media_player.yml');
  this.loadCollectionYml(COLLECTION.CAMERA, '/device/cameras.yml');
  this.loadCollectionYml(COLLECTION.CONSOLE, '/device/consoles.yml');
  this.loadCollectionYml(COLLECTION.DEVICE, '/device/mobiles.yml');
  this.loadCollectionYml(COLLECTION.OS, '/oss.yml');
  this.loadCollectionJSON(COLLECTION.OS_FAMILIES, '/os_families.json');
  this.loadCollectionJSON(COLLECTION.OS_SYSTEMS, '/os_systems.json');
  this.loadCollectionYml(COLLECTION.BROWSER, '/client/browsers.yml');
  this.loadCollectionYml(COLLECTION.BROWSER_ENGINE, '/client/browser_engine.yml');
  this.loadCollectionJSON(COLLECTION.BROWSER_SHORTS, '/browsers.json');
  this.loadCollectionYml(COLLECTION.TV, '/device/televisions.yml');

};

/**
 * @param collection
 * @param file
 */
DeviceDetector.prototype.loadCollectionYml = function (collection, file) {
  if(!this.hasOwnProperty(collection)){
    throw new Error(`Property "${collection}" does not exist`);
  }
  this[collection] = YAML.load(BASE_REGEXES_DIR + file);
};

/**
 * @param collection
 * @param file
 */
DeviceDetector.prototype.loadCollectionJSON = function (collection, file) {
  if(!this.hasOwnProperty(collection)){
    throw new Error(`Property "${collection}" does not exist`);
  }
  this[collection] = require(BASE_DATA_DIR + file);
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
  item = item || '';
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
 * @param collection
 * @param userAgent
 * @return {{DeviceDataObject}}
 * @throws
 */
DeviceDetector.prototype.findBaseDevice = function(collection, userAgent){
  let model = '';
  let brand = '';
  let deviceType = '';
  let brandId = '';

  let allowCollection = [
    COLLECTION.PORTABLE_MEDIA_PLAYER,
    COLLECTION.CAMERA,
    COLLECTION.CONSOLE,
    COLLECTION.TV,
    COLLECTION.DEVICE
  ];
  if(!this.hasOwnProperty(collection)){
    throw new Error(`Property "${collection}" does not exist`);
  }
  if(allowCollection.indexOf(collection) === -1){
    throw new Error(`You cannot use this collection of "${collection}" the here`);
  }

  for (let cursor in this[collection]) {
    let collectionItem = this[collection][cursor];
    let match = getBaseRegExp(collectionItem['regex']).exec(userAgent);
    if (match) {
      deviceType = collectionItem['device'];
      if (collectionItem['models'] !== undefined) {
        let models = collectionItem['models'];
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
      } else if (collectionItem['model'] !== undefined) {
        model = this.buildModel(collectionItem['model'], match);
      }
      brand = String(cursor).trim();
      model = String(model).trim();
      break;
    }
  }
  return {
    brand: brand,
    brand_id: brandId,  // todo add detect result brand short name
    model: model,
    type: deviceType
  };
};



/**
 * @param userAgent
 * @return {DeviceDataObject}
 */
DeviceDetector.prototype.findDevice = function (userAgent) {

  let result = this.findBaseDevice(COLLECTION.CAMERA, userAgent);

  if(isEmptyDeviceResult(result)){
    result = this.findBaseDevice(COLLECTION.PORTABLE_MEDIA_PLAYER, userAgent);
  }
  if(isEmptyDeviceResult(result)){
    result = this.findBaseDevice(COLLECTION.CONSOLE, userAgent);
  }
  if(isEmptyDeviceResult(result)){
    result = this.findBaseDevice(COLLECTION.TV, userAgent);
  }
  if(isEmptyDeviceResult(result)){
    result = this.findBaseDevice(COLLECTION.DEVICE, userAgent);
  }

  if(result.type === ''){
    result.type = this.findDeviceType(userAgent);
  }

  return result;
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

  return null;
};

/**
 * @param userAgent
 * @return {OsDataObject|*}
 */
DeviceDetector.prototype.findOs = function (userAgent) {
  for (let i = 0, l = this.collection.length; i < l; i++) {
    let item = this.collection[i];
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
      };
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
 * has check userAgent fragment is hub tv
 * @param {String} userAgent
 * @return {Boolean}
 */
DeviceDetector.prototype.isHubTv = function(userAgent){
  let regex =  'HbbTV/([1-9]{1}(?:\.[0-9]{1}){1,2})';
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
    osData = this.findOs(userAgent);
  }
  if(osData!==null && osData.hasOwnProperty('name') && osData.name === OS_ANDROID){
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

  if(osData!==null && osData.hasOwnProperty('name') && osData.name === OS_ANDROID){
    if (!versionCompare(osData.version, '2.0')) {
      return DEVICE_TYPE.SMARTPHONE;
    } else if (versionCompare(osData.version, '3.0') && !versionCompare(osData.version, '4.0')) {
      return DEVICE_TYPE.TABLET;
    }
  }

  // if(this.clientData!== null && TV_BROWSER.indexOf(this.clientData.name)!== -1 || this.isHubTv(userAgent) ){
  //   return DEVICE_TYPE.TV;
  // }

  if(osData!==null && osData.hasOwnProperty('name')){
    if(OS_DESKTOP.indexOf(osData.name) !== -1){
      return DEVICE_TYPE.DESKTOP;
    }
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
  // is app not found then find browser
  if (this.clientData === null) {
    this.clientData = this.findBrowser(userAgent);
  }
  this.deviceData = this.findDevice(userAgent);
  return {
    os: this.osData,
    client: this.clientData,
    device: this.deviceData
  };
};






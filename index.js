const helper = require('./parser/helper');
const attr = helper.getPropertyValue;

// device parsers
const MobileParser = require('./parser/device/mobile');
const NotebookParser = require('./parser/device/notebook');
const HbbTvParser = require('./parser/device/hbb-tv');
const ShellTvParser = require('./parser/device/shell-tv');
const ConsoleParser = require('./parser/device/console');
const CarBrowserParser = require('./parser/device/car-browser');
const CameraParser = require('./parser/device/camera');
const PortableMediaPlayerParser = require('./parser/device/portable-media-player');
// client parsers
const MobileAppParser = require('./parser/client/mobile-app');
const MediaPlayerParser = require('./parser/client/media-player');
const BrowserParser = require('./parser/client/browser');
const LibraryParser = require('./parser/client/library');
const FeedReaderParser = require('./parser/client/feed-reader');
const PIMParser = require('./parser/client/pim');
// os parsers
const OsParser = require('./parser/os-abstract-parser');
// bot parsers
const BotParser = require('./parser/bot-abstract-parser');
// vendor fragment parsers
const VendorFragmentParser = require(
  './parser/vendor-fragment-abstract-parser');
// other parsers
const AliasDevice = require('./parser/device/alias-device');

// const, lists
const DEVICE_TYPE = require('./parser/const/device-type');
const CLIENT_TV_LIST = require('./parser/const/clients-tv');
const CLIENT_TYPE = require('./parser/const/client-type');
const APPLE_OS_LIST = require('./parser/const/apple-os');
const DESKTOP_OS_LIST = require('./parser/const/desktop-os');
const DEVICE_PARSER_LIST = require('./parser/const/device-parser');
const CLIENT_PARSER_LIST = require('./parser/const/client-parser');
const MOBILE_BROWSER_LIST = require('./parser/client/browser-short-mobile');

// parser names
const VENDOR_FRAGMENT_PARSER = 'VendorFragment';
const OS_PARSER = 'Os';
const BOT_PARSER = 'Bot';

// static private parser init
const aliasDevice = new AliasDevice();
aliasDevice.setReplaceBrand(false);

class DeviceDetector {
  /**
   * @typedef DeviceDetectorOptions
   * @param {boolean} skipBotDetection
   * @param {number|null} osVersionTruncate
   * @param {number|null} clientVersionTruncate
   * @param {boolean} deviceIndexes
   * @param {boolean} deviceAliasCode
   * @param {string|null} filePathDeviceIndexes
   */
  
  /**
   * @param {DeviceDetectorOptions} options
   **/
  constructor(options) {
    this.vendorParserList = {};
    this.osParserList = {};
    this.botParserList = {};
    this.deviceParserList = {};
    this.clientParserList = {};

    this.__skipBotDetection = false;
    this.__deviceIndexes = false;
    this.__deviceAliasCode = false;
    this.__clientVersionTruncate = null;
    this.__osVersionTruncate = null;
    this.__osVersionTruncate = null;


    this.init();

    this.skipBotDetection = attr(options, 'skipBotDetection', false);
    this.osVersionTruncate = attr(options, 'osVersionTruncate', null);
    this.clientVersionTruncate = attr(options, 'clientVersionTruncate', null);

    this.deviceIndexes = attr(options, 'deviceIndexes', false);
    // remove in version 2
    let temp1 = attr(options, 'discardDeviceIndexes', void 0);
    if (temp1 !== void 0) {
      this.deviceIndexes = !temp1
    }
    this.deviceAliasCode = attr(options, 'deviceAliasCode', false);
    // remove in version 2
    let temp2 = attr(options, 'discardDeviceAliasCode', void 0);
    if (temp2 !== void 0) {
      this.deviceIndexes = !temp2
    }

    this.filePathDeviceIndexes = attr(options, 'filePathDeviceIndexes', null);
  }

  init() {
    this.addParseOs(OS_PARSER, new OsParser());
    this.addParseClient(CLIENT_PARSER_LIST.FEED_READER, new FeedReaderParser());
    this.addParseClient(CLIENT_PARSER_LIST.MOBILE_APP, new MobileAppParser());
    this.addParseClient(CLIENT_PARSER_LIST.MEDIA_PLAYER, new MediaPlayerParser());
    this.addParseClient(CLIENT_PARSER_LIST.PIM, new PIMParser());
    this.addParseClient(CLIENT_PARSER_LIST.BROWSER, new BrowserParser());
    this.addParseClient(CLIENT_PARSER_LIST.LIBRARY, new LibraryParser());
    
    this.addParseDevice(DEVICE_PARSER_LIST.HBBTV, new HbbTvParser());
    this.addParseDevice(DEVICE_PARSER_LIST.SHELLTV, new ShellTvParser());
    this.addParseDevice(DEVICE_PARSER_LIST.NOTEBOOK, new NotebookParser());
    this.addParseDevice(DEVICE_PARSER_LIST.CONSOLE, new ConsoleParser());
    this.addParseDevice(DEVICE_PARSER_LIST.CAR_BROWSER, new CarBrowserParser());
    this.addParseDevice(DEVICE_PARSER_LIST.CAMERA, new CameraParser());
    this.addParseDevice(
      DEVICE_PARSER_LIST.PORTABLE_MEDIA_PLAYER,
      new PortableMediaPlayerParser(),
    );
    this.addParseDevice(DEVICE_PARSER_LIST.MOBILE, new MobileParser());

    this.addParseVendor(VENDOR_FRAGMENT_PARSER, new VendorFragmentParser());

    this.addParseBot(BOT_PARSER, new BotParser());
  }
  
  get skipBotDetection() {
    return this.__skipBotDetection;
  }
  
  set skipBotDetection(discard) {
    this.__skipBotDetection = discard;
  }

  /***
   * @deprecated - the method will be removed in v2.0 (detector.deviceIndexes)
   */
  get discardDeviceIndexes() {
    return !this.deviceIndexes;
  }
  /***
   * @deprecated - the method will be removed in v2.0 (detector.deviceIndexes)
   */
  set discardDeviceIndexes(discard) {
    this.deviceIndexes = !discard;
  }
  /***
   * @deprecated - the method will be removed in v2.0 (detector.deviceAliasCode)
   */
  get discardDeviceAliasCode() {
    return !this.deviceAliasCode;
  }
  /***
   * @deprecated - the method will be removed in v2.0 (detector.deviceAliasCode)
   */
  set discardDeviceAliasCode(discard) {
    return this.deviceAliasCode = !discard;
  }

  /**
   * @param {boolean} status - true use indexes, false not use indexes
   */
  set deviceIndexes(status) {
    this.__deviceIndexes = status;
  }

  /**
   * @return {boolean} - true use indexes, false not use indexes
   */
  get deviceIndexes() {
    return this.__deviceIndexes;
  }

  /**
   * @param {boolean} status - true use deviceAliasCode,  false not use deviceAliasCode
   */
  set deviceAliasCode(status) {
    this.__deviceAliasCode = status;
  }
  /**
   * @return {boolean} - true use deviceAliasCode, false not use deviceAliasCode
   */
  get deviceAliasCode() {
    return this.__deviceAliasCode;
  }

  set clientVersionTruncate(value) {
    this.__clientVersionTruncate = value;
    for (let name in this.clientParserList) {
      this.clientParserList[name].setVersionTruncation(value);
    }
  }
  
  get clientVersionTruncate() {
    return this.__clientVersionTruncate;
  }
  
  set osVersionTruncate(value) {
    this.__osVersionTruncate = value;
    for (let name in this.osParserList) {
      this.osParserList[name].setVersionTruncation(value);
    }
  }
  
  get osVersionTruncate() {
    return this.__osVersionTruncate;
  }
  
  setOsVersionTruncate(value) {
    this.osVersionTruncate = value;
  }

  setClientVersionTruncate(value) {
    this.clientVersionTruncate = value;
  }
  
  /**
   * @returns {string[]}
   */
  getAvailableDeviceTypes() {
    return Object.values(DEVICE_TYPE);
  }
  
  /**
   * get all brands
   * @returns {string[]}
   */
  getAvailableBrands() {
    return this.getParseDevice(DEVICE_PARSER_LIST.MOBILE).getAvailableBrands();
  }
  
  /**
   * has brand
   * @param brand
   * @returns {boolean}
   */
  hasBrand(brand) {
    return this.getParseDevice(DEVICE_PARSER_LIST.MOBILE).
    getCollectionBrands()[brand] !== void 0;
  }
  
  /**
   * get all browsers
   * @returns {string[]}
   */
  getAvailableBrowsers() {
    return this.getParseClient(CLIENT_PARSER_LIST.BROWSER).getAvailableBrowsers();
  }
  
  /**
   * get device parser by name
   * @param {string} name
   * @return {DeviceParserAbstract}
   */
  getParseDevice(name) {
    return this.deviceParserList[name] ? this.deviceParserList[name] : null;
  }
  
  /**
   * get client parser by name
   * @param {string} name
   * @return {*}
   */
  getParseClient(name) {
    return this.clientParserList[name] ? this.clientParserList[name] : null;
  }
  
  /**
   * get os parser by name
   * @param name
   * @return {*}
   */
  getParseOs(name) {
    return this.osParserList[name] ? this.osParserList[name] : null;
  }
  
  /**
   * get vendor parser by name (specific parsers)
   * @param {string} name
   * @return {*}
   */
  getParseVendor(name) {
    return this.vendorParserList[name] ? this.vendorParserList[name] : null;
  }
  
  /**
   * get alias device parser
   * @returns {AliasDevice}
   */
  getParseAliasDevice() {
    return aliasDevice;
  }

  /**
   * add device type parser
   * @param {string} name
   * @param parser
   */
  
  addParseDevice(name, parser) {
    this.deviceParserList[name] = parser;
  }
  
  /**
   * add os type parser
   * @param {string} name
   * @param {OsAbstractParser} parser
   */
  addParseOs(name, parser) {
    this.osParserList[name] = parser;
  }
  
  /**
   * add bot type parser
   * @param {string} name
   * @param {BotAbstractParser} parser
   */
  addParseBot(name, parser) {
    this.botParserList[name] = parser;
  }
  
  /**
   * add client type parser
   * @param {string} name
   * @param {ClientAbstractParser} parser
   */
  addParseClient(name, parser) {
    this.clientParserList[name] = parser;
  }
  
  /**
   * add vendor type parser
   * @param {string} name
   * @param {VendorFragmentAbstractParser} parser
   */
  addParseVendor(name, parser) {
    this.vendorParserList[name] = parser;
  }

  /**
   * parse OS
   * @param {string} userAgent
   * @param clientHintsData
   * @return {ResultOs}
   */
  parseOs(userAgent, clientHintsData = {}) {
    let result = {};

    for (let name in this.osParserList) {
      let parser = this.osParserList[name];
      let resultMerge = parser.parse(userAgent, clientHintsData);
      if (resultMerge) {
        result = Object.assign(result, resultMerge);
        break;
      }
    }
    return result;
  }
  
  /**
   * parse device type
   * @param {string} userAgent
   * @param {ResultOs} osData
   * @param {ResultClient} clientData
   * @param {ResultDevice} deviceData
   * @return {DeviceType}
   */
  parseDeviceType(
      userAgent,
      osData,
      clientData,
      deviceData,
      clientHintsData
  ) {
    let osName = attr(osData, 'name', '');
    let osFamily = attr(osData, 'family', '');
    let osVersion = attr(osData, 'version', '');
    
    let clientType = attr(clientData, 'type', '');
    let clientShortName = attr(clientData, 'short_name', '');

    let clientName = attr(clientData, 'name', '');
    let clientFamily = attr(clientData, 'family', '');
    let deviceType = attr(deviceData, 'type', '');
    
    if (
      deviceType === '' &&
      osFamily === 'Android' &&
      helper.matchUserAgent('Chrome/[.0-9]*', userAgent)
    ) {
      if (
        helper.matchUserAgent('(Mobile|eliboM) Safari/', userAgent) !==
        null
      ) {
        deviceType = DEVICE_TYPE.SMARTPHONE;
      } else if (
        helper.matchUserAgent('(?!Mobile )Safari/', userAgent) !== null
      ) {
        deviceType = DEVICE_TYPE.TABLET;
      }
    }

    if (
      deviceType === '' &&
      (helper.hasAndroidTableFragment(userAgent) ||
        helper.hasOperaTableFragment(userAgent))
    ) {
      deviceType = DEVICE_TYPE.TABLET;
    }
    
    if (deviceType === '' && helper.hasAndroidMobileFragment(userAgent)) {
      deviceType = DEVICE_TYPE.SMARTPHONE;
    }

    if (deviceType === '' && osName === 'Android' && osVersion !== '') {
      if (helper.versionCompare(osVersion, '2.0') === -1) {
        deviceType = DEVICE_TYPE.SMARTPHONE;
      } else if (
        helper.versionCompare(osVersion, '3.0') >= 0 &&
        helper.versionCompare(osVersion, '4.0') === -1
      ) {
        deviceType = DEVICE_TYPE.TABLET;
      }
    }
    
    if (deviceType === DEVICE_TYPE.FEATURE_PHONE && osFamily === 'Android') {
      deviceType = DEVICE_TYPE.SMARTPHONE;
    }

    /**
     * All unknown devices under running Java ME are more likely a features phones
     */
    if ('Java ME' === osName && '' === deviceType) {
      deviceType = DEVICE_TYPE.FEATURE_PHONE;
    }

    if (
      deviceType === '' &&
      (osName === 'Windows RT' ||
        (osName === 'Windows' && helper.versionCompare(osVersion, '8') >= 0)) &&
      helper.hasTouchFragment(userAgent)
    ) {
      deviceType = DEVICE_TYPE.TABLET;
    }

    // check tv fragments and tv clients
    if (helper.hasOperaTVStoreFragment(userAgent)) {
      deviceType = DEVICE_TYPE.TV;
    } else if(helper.hasAndroidTVFragment(userAgent)){
      deviceType = DEVICE_TYPE.TV;
    } else if (deviceType === '' && helper.hasTVFragment(userAgent)) {
      deviceType = DEVICE_TYPE.TV;
    } else if (deviceType === '' && CLIENT_TV_LIST.indexOf(clientName) !== -1) {
      deviceType = DEVICE_TYPE.TV;
    }

    if (
      DEVICE_TYPE.DESKTOP !== deviceType &&
      userAgent.indexOf('Desktop') !== -1
    ) {
      if (helper.hasDesktopFragment(userAgent)) {
        deviceType = DEVICE_TYPE.DESKTOP;
      }
    }

    let hasMobileBrowser =  (
      clientType === CLIENT_TYPE.BROWSER &&
      MOBILE_BROWSER_LIST.indexOf(clientShortName) !== -1
    );
    let hasDesktopOs = osName !== '' && (
      DESKTOP_OS_LIST.indexOf(osName) !== -1 ||
      DESKTOP_OS_LIST.indexOf(osFamily) !== -1
    );

    // check os desktop and not mobile browser
    if (deviceType === '') {
      if (!hasMobileBrowser && hasDesktopOs) {
        deviceType = DEVICE_TYPE.DESKTOP;
      }
    }

    return {
      type: deviceType,
    };
  }
  
  /**
   * get brand by device code (used in indexing)
   * @param {string} deviceCode
   * @returns {*[]}
   */
  getBrandsByDeviceCode(deviceCode) {
    if ('' === deviceCode) {
      return [];
    }
    if (this.__deviceIndexexHash === void 0) {
      this.__deviceIndexexHash = {};
      
      let path = __dirname + '/regexes/device-index-hash.yml';
      
      if (this.filePathDeviceIndexes) {
        path = this.filePathDeviceIndexes;
      }
      if (helper.hasFile(path)) {
        this.__deviceIndexexHash = helper.loadYMLFile(path);
      }
    }
    let lDeviceCode = deviceCode.toLowerCase();
    let brands = this.__deviceIndexexHash[lDeviceCode];
    if (brands !== void 0) {
      return brands;
    }
    return [];
  }

  /**
   * @param {string} userAgent
   * @returns {ResultDeviceCode}
   */
  parseDeviceCode(userAgent) {
    return this.getParseAliasDevice().parse(userAgent);
  }

  /**
   * parse device
   * @param {string} userAgent
   * @return {ResultDevice}
   */
  parseDevice(userAgent, clientHintData) {
    let brandIndexes = [];
    let deviceCode = '';
    
    if (this.deviceIndexes) {
      let alias = this.parseDeviceCode(userAgent);
      deviceCode = alias.name ? alias.name : '';
      brandIndexes = this.getBrandsByDeviceCode(deviceCode);
    } else if (this.deviceAliasCode) {
      let alias = this.parseDeviceCode(userAgent);
      deviceCode = alias.name ? alias.name : '';
    }
    
    let result = {
      id: '',
      type: '',
      brand: '',
      model: '',
    };
    
    for (let name in this.deviceParserList) {
      let parser = this.deviceParserList[name];
      let resultMerge = parser.parse(userAgent, brandIndexes);
      if (resultMerge) {
        result = Object.assign({}, result, resultMerge);
        break;
      }
    }
    
    if (result && result.brand === '') {
      let resultVendor = this.parseVendor(userAgent);
      if (resultVendor) {
        result.brand = resultVendor.name;
        result.id = resultVendor.id;
      }
    }
  
    if (this.deviceAliasCode) {
      result.code = deviceCode;
    }
    
    return result;
  }
  
  /**
   * parse vendor
   * @param {string} userAgent
   * @return {{name:'', id:''}|null}
   */
  parseVendor(userAgent) {
    let parser = this.getParseVendor(VENDOR_FRAGMENT_PARSER);
    return parser.parse(userAgent);
  }
  
  /**
   * parse bot
   * @param {string} userAgent
   * @return {ResultBot}
   */
  parseBot(userAgent) {
    let result = {};
    
    if (this.skipBotDetection) {
      return result;
    }
    
    for (let name in this.botParserList) {
      let parser = this.botParserList[name];
      let resultMerge = parser.parse(userAgent);
      if (resultMerge) {
        result = Object.assign(result, resultMerge);
        break;
      }
    }
    return result;
  }
  
  /**
   * parse client
   * @param {string} userAgent
   * @return {ResultClient|{}}
   */
  parseClient(userAgent, clientHintData) {

    let result = {};
    for (let name in this.clientParserList) {
      let parser = this.clientParserList[name];
      let resultMerge = parser.parse(userAgent, clientHintData);
      if (resultMerge) {
        result = Object.assign(result, resultMerge);
        break;
      }
    }
    return result;
  }
  
  /**
   * detect os, client and device
   * @param {string} userAgent - string from request header['user-agent']
   * @param clientHintsData
   * @return {DetectResult}
   */
  detect(userAgent, clientHintsData = {}) {

    let osData = this.parseOs(userAgent, clientHintsData);
    let clientData = this.parseClient(userAgent, clientHintsData);
    let deviceData = this.parseDevice(userAgent, clientHintsData);
    let deviceDataType = this.parseDeviceType(
      userAgent,
      osData,
      clientData,
      deviceData,
      clientHintsData
    );

    deviceData = Object.assign(deviceData, deviceDataType);

    if (deviceData.model === '') {
      if(clientHintsData.device && clientHintsData.device.model !== ''){
        deviceData.model = clientHintsData.device.model;
      }
    }

    /** Assume all devices running iOS / Mac OS are from Apple */
    if (
      deviceData.brand === '' &&
      osData.name !== '' &&
      APPLE_OS_LIST.indexOf(osData.name) !== -1
    ) {
      deviceData.id = 'AP';
      deviceData.brand = 'Apple';
    }

    return {
      os: osData,
      client: clientData,
      device: deviceData,
    };
  }
}

module.exports = DeviceDetector;

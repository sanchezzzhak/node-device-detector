module.exports = DeviceDetector;

const helper = require('./parser/helper');
// device parsers
const MobileParser = require('./parser/device/mobile');
const HbbTvParser = require('./parser/device/hbb-tv');
const Console = require('./parser/device/console');
const CarBrowser = require('./parser/device/car-browser');
const Camera = require('./parser/device/camera');
const PortableMediaPlayer = require('./parser/device/portable-media-player');
// client parsers
const MobileApp = require('./parser/client/mobile-app');
const MediaPlayer = require('./parser/client/media-player');
const Browser = require('./parser/client/browser');
const Library = require('./parser/client/library');
const FeedReader = require('./parser/client/feed-reader');
const PIM = require('./parser/client/pim');
// os parsers
const OsParser = require('./parser/os-abstract-parser');
// bot parsers
const BotParser= require('./parser/bot-abstract-parser');
// vendor fragment parsers
const VendorFragmentParser = require('./parser/vendor-fragment-abstract-parser');

const DEVICE_TYPE = require('./parser/const/device-type');

const VENDOR_FRAGMENT_PARSER = 'vendor-fragment';

const DEVICE_PARSER = {
  MOBILE: 'Mobile',
  HBBTV: 'hbbtv',
  CONSOLE: 'console',
  CAR_BROWSER: 'CarBrowser',
  CAMERA: 'Camera',
  PORTABLE_MEDIA_PLAYER: 'PortableMediaPlayer'
};
const CLIENT_PARSER = {
  FEED_READER: 'FeedReader',
  MEDIA_PLAYER: 'MediaPlayer',
  PIM: 'PIM',
  MOBILE_APP: 'MobileApp',
  LIBRARY: 'Library',
  BROWSER: 'Browser',
};

const TV_CLIENT_LIST = ['Kylo', 'Espial TV Browser'];
const DESKTOP_OS_LIST = ['AmigaOS', 'IBM', 'GNU/Linux', 'Mac', 'Unix', 'Windows', 'BeOS', 'Chrome OS'];
const CHROME_CLIENT_LIST = ['Chrome', 'Chrome Mobile'];


function DeviceDetector(options) {
  this.osData = null;
  this.deviceData = null;
  this.clientData = null;
  this.botData = null;

  this.vendorParserList = {};
  this.osParserList = {};
  this.botParserList = {};
  this.deviceParserList = {};
  this.clientParserList = {};

  this.skipBotDetection = helper.getPropertyValue(options, "skipBotDetection", false);

  this.init();
}

DeviceDetector.prototype.init = function () {

  this.addParseOs("Os", new OsParser);

  this.addParseClient(CLIENT_PARSER.FEED_READER, new FeedReader);
  this.addParseClient(CLIENT_PARSER.MOBILE_APP, new MobileApp);
  this.addParseClient(CLIENT_PARSER.MEDIA_PLAYER, new MediaPlayer);
  this.addParseClient(CLIENT_PARSER.PIM, new PIM);
  this.addParseClient(CLIENT_PARSER.BROWSER, new Browser);
  this.addParseClient(CLIENT_PARSER.LIBRARY, new Library);

  this.addParseDevice(DEVICE_PARSER.HBBTV, new HbbTvParser);
  this.addParseDevice(DEVICE_PARSER.CONSOLE, new Console);
  this.addParseDevice(DEVICE_PARSER.CAR_BROWSER, new CarBrowser);
  this.addParseDevice(DEVICE_PARSER.CAMERA, new Camera());
  this.addParseDevice(DEVICE_PARSER.PORTABLE_MEDIA_PLAYER, new PortableMediaPlayer);
  this.addParseDevice(DEVICE_PARSER.MOBILE, new MobileParser);

  this.addParseVendor(VENDOR_FRAGMENT_PARSER, new VendorFragmentParser);

  this.addParseBot("Bot", new BotParser);
};

DeviceDetector.prototype.getParseDevice = function (name) {
  return this.deviceParserList[name] ? this.deviceParserList[name] : null;
};

DeviceDetector.prototype.getParseClient = function (name) {
  return this.clientParserList[name] ? this.clientParserList[name] : null;
};

DeviceDetector.prototype.getParseOs = function (name) {
  return this.osParserList[name] ? this.osParserList[name] : null;
};

DeviceDetector.prototype.getParseVendor = function (name) {
    return this.vendorParserList[name] ? this.vendorParserList[name] : null;
};

DeviceDetector.prototype.addParseDevice = function (name, parser) {
  this.deviceParserList[name] = parser;
};

DeviceDetector.prototype.addParseOs = function (name, parser) {
  this.osParserList[name] = parser;
};

DeviceDetector.prototype.addParseBot = function (name, parser) {
  this.botParserList[name] = parser;
};

DeviceDetector.prototype.addParseClient = function (name, parser) {
  this.clientParserList[name] = parser;
};

DeviceDetector.prototype.addParseVendor = function (name, parser) {
    this.vendorParserList[name] = parser;
};

/**
 * parse os
 */
DeviceDetector.prototype.parseOs = function () {
  for (let name in this.osParserList) {
    let parser = this.osParserList[name];
    let result = parser.parse(this.userAgent);
    if (result) {
      this.osData = parser.getParseData();
      break;
    }
  }
};

DeviceDetector.prototype.getDeviceAttr = function (attr, defaultValue) {
  return this.deviceData && this.deviceData[attr] ? this.deviceData[attr] : defaultValue;
};

DeviceDetector.prototype.getOsAttr = function (attr, defaultValue) {
  return this.osData && this.osData[attr] ? this.osData[attr] : defaultValue;
};

DeviceDetector.prototype.getClientAttr = function (attr, defaultValue) {
  return this.clientData && this.clientData[attr] ? this.clientData[attr] : defaultValue;
};

/**
 * parse device
 */
DeviceDetector.prototype.parseDeviceType = function () {
  let osName = this.getOsAttr('name', '');
  let osFamily = this.getOsAttr('family', '');
  let osShortName = this.getOsAttr('short_name', '');
  let osVersion = this.getOsAttr('version', '');
  let clientName = this.getClientAttr('name', '');
  let deviceType = this.getDeviceAttr('type', '');

  if (this.deviceData.id === '' && ['ATV', 'IOS', 'MAC'].indexOf(osShortName) !== -1) {
    this.deviceData.id = 'AP';
  }

  if (deviceType === '' && this.isAndroid() && CHROME_CLIENT_LIST.indexOf(clientName) !== -1) {
    if (helper.matchUserAgent('Chrome/[\\.0-9]* Mobile', this.userAgent) !== null) {
      deviceType = DEVICE_TYPE.SMARTPHONE
    } else if (helper.matchUserAgent('Chrome/[\.0-9]* (?!Mobile)', this.userAgent) !== null) {
      deviceType = DEVICE_TYPE.TABLET
    }
  }

  if (deviceType === '' && (helper.hasAndroidTableFragment(this.userAgent) || helper.hasOperaTableFragment(this.userAgent)  )) {
    deviceType = DEVICE_TYPE.TABLET;
  }

  if (deviceType === '' && helper.hasAndroidMobileFragment(this.userAgent)) {
    deviceType = DEVICE_TYPE.SMARTPHONE;
  }

  if (deviceType === '' && osShortName === 'AND' && osVersion !== '') {
    if (helper.versionCompare(osVersion, '2.0') === -1) {
      deviceType = DEVICE_TYPE.SMARTPHONE;
    } else if (helper.versionCompare(osVersion, '3.0') >= 0 && helper.versionCompare(osVersion, '4.0') === -1) {
      deviceType = DEVICE_TYPE.TABLET;
    }
  }

  if (deviceType === DEVICE_TYPE.FEATURE_PHONE && this.isAndroid()) {
    deviceType = DEVICE_TYPE.SMARTPHONE;
  }

  if (deviceType === '' && (osShortName === 'WRT' || (osShortName === 'WIN' && helper.versionCompare(osVersion, '8.0'))) && helper.hasTouchFragment(this.userAgent)) {
    deviceType = DEVICE_TYPE.TABLET;
  }

  if (helper.hasOperaTVStoreFragment(this.userAgent)) {
    deviceType = DEVICE_TYPE.TABLET;
  }

  if (helper.hasOperaTVStoreFragment(this.userAgent)) {
    deviceType = DEVICE_TYPE.TV;
  }

  if (deviceType === '' && TV_CLIENT_LIST.indexOf(clientName) !== -1) {
    deviceType = DEVICE_TYPE.TV;
  }

  if (deviceType === '' && DESKTOP_OS_LIST.indexOf(osFamily) !== -1) {
    deviceType = DEVICE_TYPE.DESKTOP;
  }

  this.deviceData.type = deviceType;
};

DeviceDetector.prototype.parseDevice = function () {
  for (let name in this.deviceParserList) {
    let parser = this.deviceParserList[name];
    let result = parser.parse(this.userAgent);
    if (result) {
      this.deviceData = parser.getParseData();
      break;
    }
  }

  if(this.deviceData.brand === ''){
      let parser = this.getParseVendor(VENDOR_FRAGMENT_PARSER);
      let result = parser.parse(this.userAgent);
      if (result) {
          let vendorData = parser.getParseData();

          this.deviceData.brand = vendorData.name;
          this.deviceData.id = vendorData.id;
      }
  }
};

DeviceDetector.prototype.parseBot = function () {
  if(this.skipBotDetection){
    return;
  }
  for (let name in this.botParserList) {
    let parser = this.botParserList[name];
    let result = parser.parse(this.userAgent);
    if (result) {
      this.botData = parser.getParseData();
      break;
    }
  }
};

/**
 * parse client
 */
DeviceDetector.prototype.parseClient = function () {
  for (let name in this.clientParserList) {
    let parser = this.clientParserList[name];
    let result = parser.parse(this.userAgent);
    if (result) {
      this.clientData = parser.getParseData();
      break;
    }
  }
};


/**
 * @param userAgent
 * @return {{os: (null|*), device: (null|*), client: (null|*)}}
 */
DeviceDetector.prototype.detect = function (userAgent) {
  this.reset();
  this.userAgent = userAgent;

  this.parseOs();
  this.parseClient();
  this.parseDevice();
  this.parseDeviceType();
  this.parseBot();

  return {
    os: this.osData,
    device: this.deviceData,
    client: this.clientData
  };
};

/**
 * @return {boolean}
 */
DeviceDetector.prototype.isBot = function () {
  return this.botData !== null;
};

/**
 * is device type desktop
 * @return {boolean}
 */
DeviceDetector.prototype.isDesktop = function () {
  return !this.isMobile() && !this.isTabled() && !this.isPhablet();
};

/**
 * is device type mobile
 * @return {boolean}
 */
DeviceDetector.prototype.isMobile = function () {
  let type = this.getDeviceAttr('type', '');
  return [DEVICE_TYPE.SMARTPHONE, DEVICE_TYPE.FEATURE_PHONE].indexOf(type) !== -1;
};

/**
 * is device type table
 * @return {boolean}
 */
DeviceDetector.prototype.isTabled = function () {
  let type = this.getDeviceAttr('type', '');
  return [DEVICE_TYPE.TABLET].indexOf(type) !== -1;
};

/**
 * is device type phablet
 * @return {boolean}
 */
DeviceDetector.prototype.isPhablet = function () {
  let type = this.getDeviceAttr('type', '');
  return [DEVICE_TYPE.PHABLET].indexOf(type) !== -1;
};
/**
 * is device type android table
 * @return {boolean}
 */
DeviceDetector.prototype.isAndroid = function () {
  let osFamily = this.getOsAttr('family', '');
  return osFamily === 'Android';
};

/**
 * is device type apple table
 * @return {boolean}
 */
DeviceDetector.prototype.isIOS = function () {
  let osFamily = this.getOsAttr('family', '');
  return osFamily === 'iOS';
};

/**
 * reset detect result
 */
DeviceDetector.prototype.reset = function () {
  this.botData = null;
  this.userAgent = null;
  this.osData = null;
  this.clientData = null;
  this.deviceData = {
    id: '',
    type: '',
    brand: '',
    model: ''
  };
};

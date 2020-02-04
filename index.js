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
const CHROME_CLIENT_LIST = ['Chrome', 'Chrome Mobile', 'Chrome Webview'];


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
DeviceDetector.prototype.parseOs = function (userAgent) {
  let result = {};
  for (let name in this.osParserList) {
    let parser = this.osParserList[name];
    let resultMerge = parser.parse(userAgent);
    if (resultMerge) {
      result = Object.assign(result, resultMerge);
      break;
    }
  }
  return result;
};

DeviceDetector.prototype.parseDeviceType = function (userAgent, osData, clientData, deviceData) {
  let osName = osData && osData['name'] ? osData['name'] : '';
  let osFamily = osData && osData['family'] ? osData['family'] : '';
  let osShortName = osData && osData['short_name'] ? osData['short_name'] : '';
  let osVersion = osData && osData['version'] ? osData['version'] : '';
  
  let clientName = clientData && clientData['name'] ? clientData['name'] : '';
  let clientFamily = clientData && clientData['family'] ? clientData['family'] : '';
  
  let deviceType = deviceData && deviceData['type'] ? deviceData['type'] : '';
  let deviceId = deviceData && deviceData['id'] ? deviceData['id'] : '';

  
  let isAndroid = osFamily === 'Android';
  
  if (deviceId === '' && ['ATV', 'IOS', 'MAC'].indexOf(osShortName) !== -1) {
	deviceId = 'AP';
  }

  if (deviceType === '' && isAndroid && clientFamily === 'Chrome') {
    if (helper.matchUserAgent('Chrome/[\\.0-9]* Mobile', userAgent) !== null) {
      deviceType = DEVICE_TYPE.SMARTPHONE
    } else if (helper.matchUserAgent('Chrome/[\.0-9]* (?!Mobile)', userAgent) !== null) {
      deviceType = DEVICE_TYPE.TABLET
    }
  }

  if (deviceType === '' && (helper.hasAndroidTableFragment(userAgent) || helper.hasOperaTableFragment(userAgent)  )) {
    deviceType = DEVICE_TYPE.TABLET;
  }

  if (deviceType === '' && helper.hasAndroidMobileFragment(userAgent)) {
    deviceType = DEVICE_TYPE.SMARTPHONE;
  }

  if (deviceType === '' && osShortName === 'AND' && osVersion !== '') {
    if (helper.versionCompare(osVersion, '2.0') === -1) {
      deviceType = DEVICE_TYPE.SMARTPHONE;
    } else if (helper.versionCompare(osVersion, '3.0') >= 0 && helper.versionCompare(osVersion, '4.0') === -1) {
      deviceType = DEVICE_TYPE.TABLET;
    }
  }

  if (deviceType === DEVICE_TYPE.FEATURE_PHONE && osFamily === 'Android') {
    deviceType = DEVICE_TYPE.SMARTPHONE;
  }

  if (deviceType === '' && (osShortName === 'WRT' || (osShortName === 'WIN' && helper.versionCompare(osVersion, '8.0'))) && helper.hasTouchFragment(userAgent)) {
    deviceType = DEVICE_TYPE.TABLET;
  }

  if (helper.hasOperaTVStoreFragment(userAgent)) {
    deviceType = DEVICE_TYPE.TABLET;
  }

  if (helper.hasOperaTVStoreFragment(userAgent)) {
    deviceType = DEVICE_TYPE.TV;
  }

  if (deviceType === '' && TV_CLIENT_LIST.indexOf(clientName) !== -1) {
    deviceType = DEVICE_TYPE.TV;
  }

  if (deviceType === '' && DESKTOP_OS_LIST.indexOf(osFamily) !== -1) {
    deviceType = DEVICE_TYPE.DESKTOP;
  }
  
  return {
    id: deviceId,
    type: deviceType
  }
};

DeviceDetector.prototype.parseDevice = function (userAgent) {
  let result = {
	"id": "",
	"type": "",
	"brand": "",
	"model": ""
  };
  for (let name in this.deviceParserList) {
    let parser = this.deviceParserList[name];
    let resultMerge = parser.parse(userAgent);
    if (resultMerge) {
	  result = Object.assign(result, resultMerge);
	  break;
    }
  }
  
  if(result && result.brand === ''){
    let resultVendor = this.parseVendor(userAgent);
	if (resultVendor) {
	  result.brand = resultVendor.name;
	  result.id = resultVendor.id;
	}
  
  }
  
  return result;
};

DeviceDetector.prototype.parseVendor = function (userAgent) {
  let parser = this.getParseVendor(VENDOR_FRAGMENT_PARSER);
  return parser.parse(userAgent);
};

DeviceDetector.prototype.parseBot = function (userAgent) {
  let result = {};
  
  if(this.skipBotDetection){
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
};

/**
 * parse client
 */
DeviceDetector.prototype.parseClient = function (userAgent) {
  let result = {};
  for (let name in this.clientParserList) {
    let parser = this.clientParserList[name];
    let resultMerge = parser.parse(userAgent);
    if (resultMerge) {
      result = Object.assign(result, resultMerge);
	  break;
    }
    
  }
  return result;
};


/**
 * @param userAgent
 * @return {{os: (null|*), device: (null|*), client: (null|*)}}
 */
DeviceDetector.prototype.detect = function (userAgent) {
  
  let osData = this.parseOs(userAgent);
  let clientData = this.parseClient(userAgent);
  let deviceData = this.parseDevice(userAgent);
  let deviceDataType = this.parseDeviceType(userAgent, osData, clientData, deviceData);
  deviceData = Object.assign(deviceData, deviceDataType);
  
  return {
    os: osData,
	client: clientData,
    device: deviceData
  };
};
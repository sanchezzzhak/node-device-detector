const helper = require('./parser/helper');
// device parsers
const MobileParser = require('./parser/device/mobile');
const HbbTvParser = require('./parser/device/hbb-tv');
const NotebookParser = require('./parser/device/notebook');
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
const BotParser = require('./parser/bot-abstract-parser');
// vendor fragment parsers
const VendorFragmentParser = require('./parser/vendor-fragment-abstract-parser');

// const, lists
const DEVICE_TYPE = require('./parser/const/device-type');
const CLIENT_TV_LIST = require('./parser/const/clients-tv');
const DESKTOP_OS_LIST = require('./parser/const/desktop-os');

const MOBILE_BROWSER_LIST = require('./parser/client/browser-short-mobile');
const CHROME_CLIENT_LIST = ['Chrome', 'Chrome Mobile', 'Chrome Webview'];
const APPLE_OS_LIST = ['Apple TV', 'iOS', 'Mac'];

// parser names
const VENDOR_FRAGMENT_PARSER = 'VendorFragment';
const OS_PARSER = 'Os';
const BOT_PARSER = 'Bot';

const DEVICE_PARSER = {
  MOBILE: 'Mobile',
  HBBTV: 'hbbtv',
  NOTEBOOK: 'Notebook',
  CONSOLE: 'console',
  CAR_BROWSER: 'CarBrowser',
  CAMERA: 'Camera',
  PORTABLE_MEDIA_PLAYER: 'PortableMediaPlayer',
};
const CLIENT_PARSER = {
  FEED_READER: 'FeedReader',
  MEDIA_PLAYER: 'MediaPlayer',
  PIM: 'PIM',
  MOBILE_APP: 'MobileApp',
  LIBRARY: 'Library',
  BROWSER: 'Browser',
};

// private vars (later move to private properties of the class)
let osVersionTruncate;
let clientVersionTruncate;
let skipBotDetection;

class DeviceDetector {
  /**
   * @param {{skipBotDetection: false, osVersionTruncate: null, clientVersionTruncate: null}} options
   */
  constructor(options) {
    this.vendorParserList = {};
    this.osParserList = {};
    this.botParserList = {};
    this.deviceParserList = {};
    this.clientParserList = {};

    this.init();

    this.skipBotDetection = helper.getPropertyValue(
      options,
      'skipBotDetection',
      false
    );
    this.osVersionTruncate = helper.getPropertyValue(
      options,
      'osVersionTruncate',
      null
    );
    this.clientVersionTruncate = helper.getPropertyValue(
      options,
      'clientVersionTruncate',
      null
    );
  }

  init() {
    this.addParseOs(OS_PARSER, new OsParser());
    this.addParseClient(CLIENT_PARSER.FEED_READER, new FeedReader());
    this.addParseClient(CLIENT_PARSER.MOBILE_APP, new MobileApp());
    this.addParseClient(CLIENT_PARSER.MEDIA_PLAYER, new MediaPlayer());
    this.addParseClient(CLIENT_PARSER.PIM, new PIM());
    this.addParseClient(CLIENT_PARSER.BROWSER, new Browser());
    this.addParseClient(CLIENT_PARSER.LIBRARY, new Library());
    this.addParseDevice(DEVICE_PARSER.HBBTV, new HbbTvParser());
    this.addParseDevice(DEVICE_PARSER.NOTEBOOK, new NotebookParser());
    this.addParseDevice(DEVICE_PARSER.CONSOLE, new Console());
    this.addParseDevice(DEVICE_PARSER.CAR_BROWSER, new CarBrowser());
    this.addParseDevice(DEVICE_PARSER.CAMERA, new Camera());
    this.addParseDevice(
      DEVICE_PARSER.PORTABLE_MEDIA_PLAYER,
      new PortableMediaPlayer()
    );
    this.addParseDevice(DEVICE_PARSER.MOBILE, new MobileParser());
    this.addParseVendor(VENDOR_FRAGMENT_PARSER, new VendorFragmentParser());
    this.addParseBot(BOT_PARSER, new BotParser());
  }

  get skipBotDetection() {
    return skipBotDetection;
  }

  set skipBotDetection(value) {
    skipBotDetection = value;
  }

  set clientVersionTruncate(value) {
    clientVersionTruncate = value;

    for (let name in this.clientParserList) {
      this.clientParserList[name].setVersionTruncation(value);
    }
  }

  get clientVersionTruncate() {
    return clientVersionTruncate;
  }

  set osVersionTruncate(value) {
    osVersionTruncate = value;
    for (let name in this.osParserList) {
      this.osParserList[name].setVersionTruncation(value);
    }
  }

  get osVersionTruncate() {
    return osVersionTruncate;
  }

  setOsVersionTruncate(value) {
    this.osVersionTruncate = value;
  }

  setClientVersionTruncate(value) {
    this.clientVersionTruncate = value;
  }

  /**
   * @param {string} name
   * @return {DeviceParserAbstract}
   */
  getParseDevice(name) {
    return this.deviceParserList[name] ? this.deviceParserList[name] : null;
  }

  /**
   * @param {string} name
   * @return {*}
   */
  getParseClient(name) {
    return this.clientParserList[name] ? this.clientParserList[name] : null;
  }

  /**
   * @param name
   * @return {*}
   */
  getParseOs(name) {
    return this.osParserList[name] ? this.osParserList[name] : null;
  }

  /**
   * @param {string} name
   * @return {*}
   */
  getParseVendor(name) {
    return this.vendorParserList[name] ? this.vendorParserList[name] : null;
  }

  /**
   * @param {string} name
   * @param parser
   */

  addParseDevice(name, parser) {
    this.deviceParserList[name] = parser;
  }

  /**
   * @param {string} name
   * @param {OsAbstractParser} parser
   */
  addParseOs(name, parser) {
    this.osParserList[name] = parser;
  }

  /**
   * @param {string} name
   * @param {BotAbstractParser} parser
   */
  addParseBot(name, parser) {
    this.botParserList[name] = parser;
  }

  /**
   * @param {string} name
   * @param {ClientAbstractParser} parser
   */
  addParseClient(name, parser) {
    this.clientParserList[name] = parser;
  }

  /**
   * @param {string} name
   * @param {VendorFragmentParser} parser
   */
  addParseVendor(name, parser) {
    this.vendorParserList[name] = parser;
  }

  /**
   * parse OS
   * @param {string} userAgent
   * @return {ResultOs}
   */
  parseOs(userAgent) {
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
  }

  /**
   *
   * @param {string} userAgent
   * @param {ResultOs} osData
   * @param {ResultClient} clientData
   * @param {ResultDevice} deviceData
   * @return {DeviceType}
   */
  parseDeviceType(userAgent, osData, clientData, deviceData) {
    let osName = osData && osData['name'] ? osData['name'] : '';
    let osFamily = osData && osData['family'] ? osData['family'] : '';
    let osVersion = osData && osData['version'] ? osData['version'] : '';

    let clientType = clientData && clientData['type'] ? clientData['type'] : '';
    let clientShortName =
      clientData && clientData['short_name'] ? clientData['short_name'] : '';
    let clientName = clientData && clientData['name'] ? clientData['name'] : '';
    let clientFamily =
      clientData && clientData['family'] ? clientData['family'] : '';
    let deviceType = deviceData && deviceData['type'] ? deviceData['type'] : '';

    if (
      deviceType === '' &&
      osFamily === 'Android' &&
      helper.matchUserAgent('Chrome/[.0-9]*', userAgent)
    ) {
      if (
        helper.matchUserAgent('Chrome/[.0-9]* (Mobile|eliboM)', userAgent) !==
        null
      ) {
        deviceType = DEVICE_TYPE.SMARTPHONE;
      } else if (
        helper.matchUserAgent('Chrome/[.0-9]* (?!Mobile)', userAgent) !== null
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

    if (
      deviceType === '' &&
      (osName === 'Windows RT' ||
        (osName === 'Windows' && helper.versionCompare(osVersion, '8') >= 0)) &&
      helper.hasTouchFragment(userAgent)
    ) {
      deviceType = DEVICE_TYPE.TABLET;
    }

    if (helper.hasOperaTVStoreFragment(userAgent)) {
      deviceType = DEVICE_TYPE.TV;
    } else if (deviceType === '' && helper.hasTVFragment(userAgent)) {
      deviceType = DEVICE_TYPE.TV;
    } else if (deviceType === '' && CLIENT_TV_LIST.indexOf(clientName) !== -1) {
      deviceType = DEVICE_TYPE.TV;
    }

    if (deviceType === '') {
      if (
        DESKTOP_OS_LIST.indexOf(osName) !== -1 ||
        DESKTOP_OS_LIST.indexOf(osFamily) !== -1
      ) {
        if (MOBILE_BROWSER_LIST.indexOf(clientShortName) === -1) {
          deviceType = DEVICE_TYPE.DESKTOP;
        }
      }
    }

    if (
      DEVICE_TYPE.DESKTOP !== deviceType &&
      userAgent.indexOf('Desktop') !== -1
    ) {
      if (helper.hasDesktopFragment(userAgent)) {
        deviceType = DEVICE_TYPE.DESKTOP;
      }
    }

    return {
      type: deviceType,
    };
  }

  /**
   * parse device
   * @param {string} userAgent
   * @return {ResultDevice}
   */
  parseDevice(userAgent) {
    let result = {
      id: '',
      type: '',
      brand: '',
      model: '',
    };
    for (let name in this.deviceParserList) {
      let parser = this.deviceParserList[name];
      let resultMerge = parser.parse(userAgent);
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
  parseClient(userAgent) {
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
  }

  /**
   * @param {string} userAgent
   * @return {DetectResult}
   */
  detect(userAgent) {
    let osData = this.parseOs(userAgent);
    let clientData = this.parseClient(userAgent);
    let deviceData = this.parseDevice(userAgent);
    let deviceDataType = this.parseDeviceType(
      userAgent,
      osData,
      clientData,
      deviceData
    );

    deviceData = Object.assign(deviceData, deviceDataType);

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

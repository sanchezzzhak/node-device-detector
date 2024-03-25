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
const PortableMediaPlayerParser = require(
  './parser/device/portable-media-player');
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
const IndexerClient = require('./parser/client/indexer-client');
const IndexerDevice = require('./parser/device/indexer-device');
const InfoDevice = require('./parser/device/info-device');
// checks
const DeviceTrusted = require('./parser/device/device-trusted');
// const, lists, parser names
const DEVICE_TYPE = require('./parser/const/device-type');
const CLIENT_TV_LIST = require('./parser/const/clients-tv');
const CLIENT_TYPE = require('./parser/const/client-type');
const APPLE_OS_LIST = require('./parser/const/apple-os');
const DESKTOP_OS_LIST = require('./parser/const/desktop-os');
const DEVICE_PARSER_LIST = require('./parser/const/device-parser');
const CLIENT_PARSER_LIST = require('./parser/const/client-parser');
const MOBILE_BROWSER_LIST = require('./parser/client/browser-short-mobile');
const VENDOR_FRAGMENT_PARSER = 'VendorFragment';
const OS_PARSER = 'Os';
const BOT_PARSER = 'Bot';

// ===========================
// static private parser init
// ===========================

const aliasDevice = new AliasDevice();
aliasDevice.setReplaceBrand(false);
const infoDevice = new InfoDevice();

IndexerDevice.init();
IndexerClient.init();

class DeviceDetector {
  /**
   * @typedef DeviceDetectorOptions
   * @param {boolean} skipBotDetection
   * @param {number|null} osVersionTruncate
   * @param {number|null} clientVersionTruncate
   * @param {number|null} maxUserAgentSize
   * @param {boolean} deviceIndexes
   * @param {boolean} clientIndexes
   * @param {boolean} deviceAliasCode
   * @param {boolean} deviceInfo
   * @param {boolean} deviceTrusted
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
    this.__clientIndexes = false;
    this.__deviceAliasCode = false;
    this.__deviceTrusted = false;
    this.__deviceInfo = false;
    this.__clientVersionTruncate = null;
    this.__osVersionTruncate = null;
    this.__maxUserAgentSize = null;

    this.init();

    this.skipBotDetection = attr(options, 'skipBotDetection', false);
    this.osVersionTruncate = attr(options, 'osVersionTruncate', null);
    this.clientVersionTruncate = attr(options, 'clientVersionTruncate', null);
    this.deviceIndexes = attr(options, 'deviceIndexes', false);
    this.clientIndexes = attr(options, 'clientIndexes', false);
    this.deviceAliasCode = attr(options, 'deviceAliasCode', false);
    this.maxUserAgentSize = attr(options, 'maxUserAgentSize', null);
    this.deviceTrusted = attr(options, 'deviceTrusted', false);
    this.deviceInfo = attr(options, 'deviceInfo', false);
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
    this.addParseDevice(DEVICE_PARSER_LIST.PORTABLE_MEDIA_PLAYER, new PortableMediaPlayerParser());
    this.addParseDevice(DEVICE_PARSER_LIST.MOBILE, new MobileParser());

    this.addParseVendor(VENDOR_FRAGMENT_PARSER, new VendorFragmentParser());

    this.addParseBot(BOT_PARSER, new BotParser());
  }

  set deviceTrusted(check) {
    this.__deviceTrusted = check;
  }

  get deviceTrusted() {
    return this.__deviceTrusted;
  }

  set deviceInfo(stage) {
    this.__deviceInfo = stage;
  }

  get deviceInfo() {
    return this.__deviceInfo;
  }

  /**
   * Set string size limit for the useragent
   * @param {number} size
   */
  set maxUserAgentSize(size) {
    this.__maxUserAgentSize = size;
    for (let name in this.clientParserList) {
      this.clientParserList[name].setMaxUserAgentSize(size);
    }
    for (let name in this.osParserList) {
      this.osParserList[name].setMaxUserAgentSize(size);
    }
    for (let name in this.deviceParserList) {
      this.deviceParserList[name].setMaxUserAgentSize(size);
    }
  }

  /**
   * Get string size limit for the useragent
   * @returns {null|number}
   */
  get maxUserAgentSize() {
    return this.__maxUserAgentSize;
  }

  get skipBotDetection() {
    return this.__skipBotDetection;
  }

  set skipBotDetection(discard) {
    this.__skipBotDetection = discard;
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
   * @param {boolean} status - true use indexes, false not use indexes
   */
  set clientIndexes(status) {
    this.__clientIndexes = status;
    for (let name in this.clientParserList) {
      this.clientParserList[name].clientIndexes = status;
    }
  }

  /**
   * @return {boolean} - true use indexes, false not use indexes
   */
  get clientIndexes() {
    return this.__clientIndexes;
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

  /**
   * set truncate client version (default null - all)
   * @param value
   */
  set clientVersionTruncate(value) {
    this.__clientVersionTruncate = value;
    for (let name in this.clientParserList) {
      this.clientParserList[name].setVersionTruncation(value);
    }
  }

  /**
   * get truncate client version
   * @return int|null
   */
  get clientVersionTruncate() {
    return this.__clientVersionTruncate;
  }

  /**
   * set truncate os version (default null - all)
   * @param value
   */
  set osVersionTruncate(value) {
    this.__osVersionTruncate = value;
    for (let name in this.osParserList) {
      this.osParserList[name].setVersionTruncation(value);
    }
  }

  /**
   * get truncate os version
   * @return {null|number}
   */
  get osVersionTruncate() {
    return this.__osVersionTruncate;
  }

  /**
   * set truncate os version (default null - all)
   * @deprecated the method will be removed in v2.0 (use detector.osVersionTruncate)
   * @param value
   */
  setOsVersionTruncate(value) {
    this.osVersionTruncate = value;
  }

  /**
   * set truncate client version (default null - all)
   * @deprecated the method will be removed in v2.0 (use detector.clientVersionTruncate)
   * @param value
   */
  setClientVersionTruncate(value) {
    this.clientVersionTruncate = value;
  }

  /**
   * get all device types
   * @return {string[]}
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
   * has device brand
   * @param brand
   * @returns {boolean}
   */
  hasBrand(brand) {
    return this.getParseDevice(DEVICE_PARSER_LIST.MOBILE).getCollectionBrands()[brand] !== void 0;
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
   * get bot parser by name
   * @param name
   * @return {*}
   */
  getParseBot(name) {
    return this.botParserList[name] ? this.botParserList[name] : null;
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
   * get info device parser
   * @returns {InfoDevice}
   */
  getParseInfoDevice() {
    return infoDevice;
  }

  getDeviceParserNames() {
    return DEVICE_PARSER_LIST;
  }

  getClientParserNames() {
    return CLIENT_PARSER_LIST;
  }

  getBotParserNames() {
    return {
      'DEFAULT': BOT_PARSER
    };
  }

  getOsParserNames() {
    return {
      'DEFAULT': OS_PARSER
    };
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
   * @param clientHints
   * @return {ResultOs}
   */
  parseOs(userAgent, clientHints = {}) {
    let result = {};
    for (let name in this.osParserList) {
      let parser = this.osParserList[name];
      let resultMerge = parser.parse(userAgent, clientHints);
      if (resultMerge) {
        result = Object.assign(result, resultMerge);
        break;
      }
    }
    return result;
  }

  /**
   * prepare user agent for restrict rules
   * @param {string|*} userAgent
   * @returns {string|*}
   */
  prepareUserAgent(userAgent) {
    if (userAgent && this.maxUserAgentSize && this.maxUserAgentSize < userAgent.length) {
      return String(userAgent).substring(0, this.maxUserAgentSize);
    }
    return userAgent;
  }

  /**
   * parse device type
   * @param {string} userAgent
   * @param {ResultOs} osData
   * @param {ResultClient} clientData
   * @param {ResultDevice} deviceData
   * @param clientHints
   * @return {DeviceType}
   */
  parseDeviceType(
    userAgent,
    osData,
    clientData,
    deviceData,
    clientHints
  ) {

    userAgent = this.prepareUserAgent(userAgent);

    let osName = attr(osData, 'name', '');
    let osFamily = attr(osData, 'family', '');
    let osVersion = attr(osData, 'version', '');

    let clientType = attr(clientData, 'type', '');
    let clientShortName = attr(clientData, 'short_name', '');

    let clientName = attr(clientData, 'name', '');
    let clientFamily = attr(clientData, 'family', '');
    let deviceType = attr(deviceData, 'type', '');

    /**
     * All devices containing VR fragment are assumed to be a wearable
     */
    if (deviceType === '' && helper.hasVRFragment(userAgent)) {
      deviceType = DEVICE_TYPE.WEARABLE;
    }

    /**
     * Chrome on Android passes the device type based on the keyword 'Mobile'
     * If it is present the device should be a smartphone, otherwise it's a tablet
     * See https://developer.chrome.com/multidevice/user-agent#chrome_for_android_user_agent
     * Note: We do not check for browser (family) here, as there might be mobile apps using Chrome, that won't have
     *       a detected browser, but can still be detected. So we check the useragent for Chrome instead.
     */
    if (deviceType === '' && osFamily === 'Android' && helper.matchUserAgent('Chrome/[.0-9]*', userAgent)) {
      if (helper.matchUserAgent('(Mobile|eliboM)', userAgent) !== null) {
        deviceType = DEVICE_TYPE.SMARTPHONE;
      } else{
        deviceType = DEVICE_TYPE.TABLET;
      }
    }

    /**
     * Some UA contain the fragment 'Pad/APad', so we assume those devices as tablets
     */
    if (deviceType === DEVICE_TYPE.SMARTPHONE && helper.matchUserAgent('Pad/APad', userAgent)) {
      deviceType = DEVICE_TYPE.TABLET;
    }

    /**
     * Some UA contain the fragment 'Android; Tablet;' or 'Opera Tablet', so we assume those devices as tablets
     */
    if (deviceType === '' && (helper.hasAndroidTableFragment(userAgent) || helper.hasOperaTableFragment(userAgent))) {
      deviceType = DEVICE_TYPE.TABLET;
    }

    /**
     * Some user agents simply contain the fragment 'Android; Mobile;', so we assume those devices as smartphones
     */
    if (deviceType === '' && helper.hasAndroidMobileFragment(userAgent)) {
      deviceType = DEVICE_TYPE.SMARTPHONE;
    }

    /**
     * Android up to 3.0 was designed for smartphones only. But as 3.0, which was tablet only, was published
     * too late, there were a bunch of tablets running with 2.x
     * With 4.0 the two trees were merged and it is for smartphones and tablets
     *
     * So were are expecting that all devices running Android < 2 are smartphones
     * Devices running Android 3.X are tablets. Device type of Android 2.X and 4.X+ are unknown
     */
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

    /**
     * All detected feature phones running android are more likely a smartphone
     */
    if (deviceType === DEVICE_TYPE.FEATURE_PHONE && osFamily === 'Android') {
      deviceType = DEVICE_TYPE.SMARTPHONE;
    }

    /**
     * All unknown devices under running Java ME
     * are more likely a features phones
     */
    if (deviceType === '' && osName === 'Java ME') {
      deviceType = DEVICE_TYPE.FEATURE_PHONE;
    }

    /**
     * According to http://msdn.microsoft.com/en-us/library/ie/hh920767(v=vs.85).aspx
     * Internet Explorer 10 introduces the "Touch" UA string token. If this token is present at the end of the
     * UA string, the computer has touch capability, and is running Windows 8 (or later).
     * This UA string will be transmitted on a touch-enabled system running Windows 8 (RT)
     *
     * As most touch enabled devices are tablets and only a smaller part are desktops/notebooks we assume that
     * all Windows 8 touch devices are tablets.
     */
    if (
      deviceType === '' &&
      (osName === 'Windows RT' ||
        (osName === 'Windows' && helper.versionCompare(osVersion, '8') >= 0)) &&
      helper.hasTouchFragment(userAgent)
    ) {
      deviceType = DEVICE_TYPE.TABLET;
    }

    /**
     * All devices running Opera TV Store are assumed to be a tv
     */
    if (helper.hasOperaTVStoreFragment(userAgent)) {
      deviceType = DEVICE_TYPE.TV;
    }
    /**
     * All devices that contain Andr0id in string are assumed to be a tv
     */
    if (helper.hasAndroidTVFragment(userAgent)) {
      deviceType = DEVICE_TYPE.TV;
    }
    /**
     * All devices running Tizen TV or SmartTV are assumed to be a tv
     */
    if (deviceType === '' && helper.hasTVFragment(userAgent)) {
      deviceType = DEVICE_TYPE.TV;
    }
    /**
     * Devices running those clients are assumed to be a TV
     */
    if (CLIENT_TV_LIST.indexOf(clientName) !== -1) {
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

    // check os desktop and not mobile browser
    if (deviceType === '') {
      let hasMobileBrowser = (
        clientType === CLIENT_TYPE.BROWSER &&
        MOBILE_BROWSER_LIST.indexOf(clientShortName) !== -1
      );

      let hasDesktopOs = osName !== '' && (
        DESKTOP_OS_LIST.indexOf(osName) !== -1 ||
        DESKTOP_OS_LIST.indexOf(osFamily) !== -1
      );
      if (!hasMobileBrowser && hasDesktopOs) {
        deviceType = DEVICE_TYPE.DESKTOP;
      }
    }

    return {
      type: deviceType
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

    return IndexerDevice.findDeviceBrandsForDeviceCode(deviceCode);
  }

  /**
   * @param {string} userAgent
   * @returns {ResultDeviceCode}
   */
  parseDeviceCode(userAgent) {
    return aliasDevice.parse(userAgent);
  }

  /**
   * restore original userAgent for clientHints object
   * @param {string} userAgent
   * @param {{os:{version:''}, device: {model:''}}} clientHints
   */
  restoreUserAgentForClientHints(
    userAgent,
    clientHints
  ) {
    if (!clientHints || !clientHints.device) {
      return userAgent;
    }
    const deviceModel = clientHints.device.model;
    if (deviceModel && /Android 10[.\d]*; K(?: Build\/|[;)])/i.test(userAgent)) {
      const osHints = attr(clientHints, 'os', {});
      const osVersion = attr(osHints, 'version', '');
      return userAgent.replace(/(Android 10[.\d]*; K)/,
        `Android ${osVersion !== '' ? osVersion: '10'}; ${deviceModel}`
      );
    }

    return userAgent;
  }


  /**
   * parse device
   * @param {string} userAgent
   * @param {Object} clientHints
   * @return {ResultDevice}
   */
  parseDevice(userAgent, clientHints) {
    let ua = this.restoreUserAgentForClientHints(userAgent, clientHints);
    let brandIndexes = [];
    let deviceCode = '';

    let result = {
      id: '',
      type: '',
      brand: '',
      model: '',
      code: '',
      info: {},
      trusted: null
    };

    if (this.deviceIndexes || this.deviceAliasCode || this.deviceInfo || this.deviceTrusted) {
      if (clientHints.device && clientHints.device.model) {
        result.code = clientHints.device.model;
      } else {
        const alias = this.parseDeviceCode(ua);
        result.code = alias.name ? alias.name : '';
      }
    }

    if (this.deviceIndexes) {
      brandIndexes = this.getBrandsByDeviceCode(result.code);
    }

    if (result && result.brand === '') {
      for (let name in this.deviceParserList) {
        let parser = this.deviceParserList[name];
        let resultMerge = parser.parse(ua, brandIndexes);
        if (resultMerge) {
          result = Object.assign({}, result, resultMerge);
          break;
        }
      }
    }

    if (result && result.brand === '') {
      let resultVendor = this.parseVendor(ua);
      if (resultVendor) {
        result.brand = resultVendor.name;
        result.id = resultVendor.id;
      }
    }

    // client hints
    if (result.model === '' && clientHints.device && clientHints.device.model !== '') {
      result.model = clientHints.device.model;
    }

    // device info or deviceTrusted
    if (this.deviceInfo || this.deviceTrusted) {
      result.info = this.getParseInfoDevice().info(
        result.brand, result.code ? result.code : result.model
      );
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
   * @param {Object} clientHints
   * @return {ResultBot}
   */
  parseBot(userAgent, clientHints) {
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
   * @param clientHints
   * @return {ResultClient|{}}
   */
  parseClient(userAgent, clientHints) {
    const extendParsers = [CLIENT_PARSER_LIST.MOBILE_APP, CLIENT_PARSER_LIST.BROWSER];
    for (let name in this.clientParserList) {
      let parser = this.clientParserList[name];

      if (this.clientIndexes && extendParsers.includes(name)) {
        let hash = parser.parseFromHashHintsApp(clientHints);
        let hint = parser.parseFromClientHints(clientHints);
        let data = parser.parseUserAgentByPositions(userAgent);
        let result = parser.prepareParseResult(userAgent, data, hint, hash);
        if (result !== null && result.name) {
          return Object.assign({}, result);
        }
      }

      let result = parser.parse(userAgent, clientHints);
      if (result && result.name) {
        return Object.assign({}, result);
      }
    }
    return {};
  }

  prepareDetectResult(
    userAgent,
    osData,
    clientData,
    deviceData,
    clientHints
  ) {

    /**
     * if it's fake UA then it's best not to identify it as Apple running Android OS or GNU/Linux
     */
    if (deviceData.brand === 'Apple' && APPLE_OS_LIST.indexOf(osData.name) === -1) {
      deviceData.id = '';
      deviceData.brand = '';
      deviceData.model = '';
      deviceData.type = '';
    }

    /**
     * Assume all devices running iOS / Mac OS are from Apple
     */
    if (deviceData.brand === '' && APPLE_OS_LIST.indexOf(osData.name) !== -1) {
      deviceData.brand = 'Apple';
    }

    let deviceDataType = this.parseDeviceType(
      userAgent,
      osData,
      clientData,
      deviceData,
      clientHints
    );

    deviceData = Object.assign(deviceData, deviceDataType);


    if (this.deviceTrusted) {
      deviceData.trusted = DeviceTrusted.check(osData, clientData, deviceData, clientHints);
    } else {
      delete deviceData.trusted;
    }

    if (!this.deviceAliasCode) {
      delete deviceData.code;
    }

    if (!this.deviceInfo) {
      delete deviceData.info;
    }

    return {
      os: osData,
      client: clientData,
      device: deviceData
    };
  }

  /**
   * detect os, client and device for async
   * @param {string} userAgent - string from request header['user-agent']
   * @param clientHints
   * @return {DetectResult}
   */
  async detectAsync(userAgent, clientHints = {}) {
    userAgent = this.prepareUserAgent(userAgent);
    let devicePromise = new Promise((resolve) => {
      return resolve(this.parseDevice(userAgent, clientHints));
    });
    let osPromise = new Promise((resolve) => {
      return resolve(this.parseOs(userAgent, clientHints));
    });
    let clientPromise = new Promise((resolve) => {
      return resolve(this.parseClient(userAgent, clientHints));
    });

    let [deviceData, osData, clientData] = await Promise.all([
      devicePromise, osPromise, clientPromise
    ]);

    return this.prepareDetectResult(
      userAgent,
      osData,
      clientData,
      deviceData,
      clientHints
    );
  }

  /**
   * detect os, client and device for sync
   * @param {string} userAgent - string from request header['user-agent']
   * @param {{}} clientHints
   * @return {DetectResult}
   */
  detect(userAgent, clientHints = {}) {
    userAgent = this.prepareUserAgent(userAgent);
    let deviceData = this.parseDevice(userAgent, clientHints);
    let osData = this.parseOs(userAgent, clientHints);
    let clientData = this.parseClient(userAgent, clientHints);

    return this.prepareDetectResult(
      userAgent,
      osData,
      clientData,
      deviceData,
      clientHints
    );
  }
}

module.exports = DeviceDetector;

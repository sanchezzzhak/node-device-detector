// client-hints
import { JSONObject, ResultClientHints } from './client-hints';

// os parsers
import { OsParser } from './parser/os-parser';

// client parsers
import { FeedReaderParser } from './parser/client/feed-reader';
import { MobileAppParser } from './parser/client/mobile-app';
import { MediaPlayerParser } from './parser/client/media-player';
import { PimParser } from './parser/client/pim';
import { BrowserParser } from './parser/client/browser';
import { LibraryParser } from './parser/client/library';

// device parsers
import { HbbTvParser } from './parser/device/hbb-tv';
import { ShellTvParser } from './parser/device/shell-tv';
import { NotebookParser } from './parser/device/notebook';
import { ConsoleParser } from './parser/device/console';
import { CarParser } from './parser/device/car';
import { CameraParser } from './parser/device/camera';
import { PortableMediaPlayerParser } from './parser/device/portable-media-player';
import { MobileParser } from './parser/device/mobile';

// other parsers
import { AliasDevice } from './parser/device/alias-device';
import { IndexerClient } from './parser/client/indexer-client';
import { IndexerDevice } from './parser/device/indexer-device';
import { InfoDevice } from './parser/device/info-device';
import { VendorFragmentParser } from './parser/vendor-fragment-parser';
import { BotParser } from './parser/bot-parser';

// check parsers
import { DeviceTrusted } from './parser/device/device-trusted';

// constants, lists, parser names
const VENDOR_FRAGMENT_PARSER = 'VendorFragment';
const OS_PARSER = 'Os';
const BOT_PARSER = 'Bot';

import DEVICE_TYPE from './parser/const/device-type';
import CLIENT_TV_LIST from './parser/const/clients-tv';
import CLIENT_TYPE from './parser/const/client-type';
import APPLE_OS_LIST from './parser/const/apple-os';
import DESKTOP_OS_LIST from './parser/const/desktop-os';
import DEVICE_PARSER_LIST from './parser/const/device-parser';
import CLIENT_PARSER_LIST from './parser/const/client-parser';
import MOBILE_BROWSER_LIST from './parser/client/browser-short-mobile';
// helpers
import * as helper from './parser/helper';

const { hasUserAgentClientHintsFragment, hasDeviceModelByClientHints, attr } = helper;


// ===========================
// static private parser init
// ===========================
const infoDevice = new InfoDevice();
const aliasDevice = new AliasDevice();
aliasDevice.setReplaceBrand(false);

IndexerDevice.init();
IndexerClient.init();


export interface DeviceDetectorOptions {
  skipBotDetection?: boolean;
  osVersionTruncate?: number | null;
  clientVersionTruncate?: number | null;
  maxUserAgentSize?: number | null;
  clientIndexes?: boolean;
  deviceIndexes?: boolean;
  deviceAliasCode?: boolean;
  deviceInfo?: boolean;
  deviceTrusted?: boolean;
}

export interface ResultDeviceCode {
  name: string;
}

export interface ResultVendor {
  id: string;
  name: string;
}

export interface DetectResult {
  os: ResultOs;
  client: ResultClient;
  device: ResultDevice;
}

export interface ResultOs {
  name: string;
  short_name: string;
  version: string;
  platform: string;
  family: string;
}

export interface ResultClient {
  type: string;
  name: string;
  short_name?: string;
  version: string;
  engine?: string;
  engine_version?: string;
  family?: string;
}

export interface ResultDevice {
  id: string;
  type: string;
  brand: string;
  model: string;
  code?: string;
  trusted?: boolean | null;
  info?: ResultDeviceInfo | null;
  regex?: any
}

export interface ResultAliasDevice {
  name: string;
}

export interface DeviceType {
  id?: string;
  type: string;
}

export interface ResultBot {
  name: string;
  producer: any;
  category: string;
  url: string;
}

export interface ResultDeviceInfoDisplay {
  size: string;
  resolution?: string | ResultDeviceInfoResolution;
  ratio?: string;
  ppi?: string;
}

export interface ResultDeviceInfoResolution {
  width: string;
  height: string;
}

export interface ResultDeviceInfoPerformance {
  antutu?: number;
  geekbench?: number;
}

export interface ResultDeviceInfoHardwareGPU {
  name: string;
  clock_rate?: number;
}

export interface ResultDeviceInfoHardware {
  ram: number;
  cpu_id?: number;
  cpu?: ResultDeviceInfoHardwareCPU;
  gpu?: ResultDeviceInfoHardwareGPU;
}

export interface ResultDeviceInfoSize {
  width: string;
  height: string;
  thickness: string;
}

export interface ResultDeviceInfoHardwareCPU {
  name: string;
  type: string;
  cores?: number;
  clock_rate?: number;
  process?: string;
  gpu_id?: number;
}

export interface ResultDeviceInfo {
  display?: ResultDeviceInfoDisplay;
  sim?: number | null;
  size?: string | ResultDeviceInfoSize | null;
  weight?: string | null;
  release?: string | null;
  os?: string | null;
  hardware?: ResultDeviceInfoHardware | null;
  performance?: ResultDeviceInfoPerformance | null;
}


export class DeviceDetector {

  #vendorParserList = {};
  #osParserList = {};
  #botParserList = {};
  #deviceParserList = {};
  #clientParserList = {};
  #deviceTrusted = false;
  #deviceInfo = false;
  #skipBotDetection = false;
  #deviceIndexes = false;
  #clientIndexes = false;
  #deviceAliasCode = false;
  #clientVersionTruncate = null;
  #osVersionTruncate = null;
  #maxUserAgentSize = null;

  /**
   * @param {DeviceDetectorOptions} options
   */
  constructor(options: DeviceDetectorOptions) {

    this.init();

    this.skipBotDetection = options.skipBotDetection ?? false;
    this.osVersionTruncate = options.osVersionTruncate ?? null;
    this.clientVersionTruncate = options.clientVersionTruncate ?? null;
    this.deviceIndexes = options.deviceIndexes ?? false;
    this.deviceIndexes = options.deviceIndexes ?? false;
    this.clientIndexes = options.clientIndexes ?? false;
    this.deviceAliasCode = options.deviceAliasCode ?? false;
    this.deviceInfo = options.deviceInfo ?? false;
    this.maxUserAgentSize = options.maxUserAgentSize ?? null;
  }

  /**
   * init all parsers
   */
  public init(): void {
    this.addParseOs(OS_PARSER, new OsParser());

    this.addParseClient(CLIENT_PARSER_LIST.FEED_READER, new FeedReaderParser());
    this.addParseClient(CLIENT_PARSER_LIST.MOBILE_APP, new MobileAppParser());
    this.addParseClient(CLIENT_PARSER_LIST.MEDIA_PLAYER, new MediaPlayerParser());
    this.addParseClient(CLIENT_PARSER_LIST.PIM, new PimParser());
    this.addParseClient(CLIENT_PARSER_LIST.BROWSER, new BrowserParser());
    this.addParseClient(CLIENT_PARSER_LIST.LIBRARY, new LibraryParser());

    this.addParseDevice(DEVICE_PARSER_LIST.HBBTV, new HbbTvParser());
    this.addParseDevice(DEVICE_PARSER_LIST.SHELLTV, new ShellTvParser());
    this.addParseDevice(DEVICE_PARSER_LIST.NOTEBOOK, new NotebookParser());
    this.addParseDevice(DEVICE_PARSER_LIST.CONSOLE, new ConsoleParser());
    this.addParseDevice(DEVICE_PARSER_LIST.CAR_BROWSER, new CarParser());
    this.addParseDevice(DEVICE_PARSER_LIST.CAMERA, new CameraParser());
    this.addParseDevice(DEVICE_PARSER_LIST.PORTABLE_MEDIA_PLAYER, new PortableMediaPlayerParser());
    this.addParseDevice(DEVICE_PARSER_LIST.MOBILE, new MobileParser());
    this.addParseVendor(VENDOR_FRAGMENT_PARSER, new VendorFragmentParser());

    this.addParseBot(BOT_PARSER, new BotParser());
  }

  /**
   * get all device types
   * @return {string[]}
   */
  getAvailableDeviceTypes(): string[] {
    return Object.values(DEVICE_TYPE);
  }

  /**
   * get all brands
   * @returns {string[]}
   */
  public getAvailableBrands(): string[] {
    return this.getParseDevice(DEVICE_PARSER_LIST.MOBILE).getAvailableBrands();
  }

  /**
   * has device brand
   * @param {string} brand
   * @returns {boolean}
   */
  public hasBrand(brand: string): boolean {
    return this.getParseDevice(DEVICE_PARSER_LIST.MOBILE).getCollectionBrands()[brand] !== void 0;
  }

  /**
   * get all browsers
   * @returns {string[]}
   */
  public getAvailableBrowsers(): string[] {
    return this.getParseClient(CLIENT_PARSER_LIST.BROWSER).getAvailableBrowsers();
  }

  /**
   * get device parser by name
   * @param {string} name
   * @return {DeviceParserAbstract|null}
   */
  public getParseDevice(name: string) {
    return this.#deviceParserList[name] ?? null;
  }

  /**
   * get client parser by name
   * @param {string} name
   * @return {*}
   */
  public getParseClient(name: string) {
    return this.#clientParserList[name] ?? null;
  }

  /**
   * get bot parser by name
   * @param name
   * @return {*}
   */
  getParseBot(name: string) {
    return this.#botParserList[name] ?? null;
  }

  /**
   * get os parser by name
   * @param name
   * @return {*}
   */
  getParseOs(name: string) {
    return this.#osParserList[name] ?? null;
  }

  /**
   * get vendor parser by name (specific parsers)
   * @param {string} name
   * @return {*}
   */
  getParseVendor(name: string) {
    return this.#vendorParserList[name] ?? null;
  }

  /**
   * get alias device parser
   * @returns {AliasDevice}
   */
  getParseAliasDevice(): AliasDevice {
    return aliasDevice;
  }

  /**
   * get info device parser
   * @returns {InfoDevice}
   */
  getParseInfoDevice(): InfoDevice {
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
   * set truncate client version (default null - all)
   * @param {null|number} value
   */
  public set clientVersionTruncate(value: number | null) {
    this.#clientVersionTruncate = value;
    for (const name in this.#clientParserList) {
      this.#clientParserList[name].setVersionTruncation(value);
    }
  }

  /**
   * get truncate client version
   * @return {number|null}
   */
  public get clientVersionTruncate(): number | null {
    return this.#clientVersionTruncate;
  }

  /**
   * set truncate os version (default null - all)
   * @param {number|null} value
   */
  public set osVersionTruncate(value: number | null) {
    this.#osVersionTruncate = value;
    for (const name in this.#osParserList) {
      this.#osParserList[name].setVersionTruncation(value);
    }
  }

  /**
   * get truncate os version
   * @return {null|number}
   */
  public get osVersionTruncate(): number | null {
    return this.#osVersionTruncate;
  }


  /**
   * set stage device check trusted
   * @param {boolean} stage
   */
  public set deviceTrusted(stage: boolean) {
    this.#deviceTrusted = stage;
  }

  /**
   * get stage device check trusted
   * @return {boolean}
   */
  public get deviceTrusted(): boolean {
    return this.#deviceTrusted;
  }

  /**
   * set stage device info
   * @param {boolean} stage
   */
  public set deviceInfo(stage: boolean) {
    this.#deviceInfo = stage;
  }

  /**
   * get stage device info
   * @return {boolean}
   */
  public get deviceInfo(): boolean {
    return this.#deviceInfo;
  }

  /**
   * add device type parser
   * @param {string} name
   * @param parser
   */
  public addParseDevice(name: string, parser: any): void {
    this.#deviceParserList[name] = parser;
  }

  /**
   * add os type parser
   * @param {string} name
   * @param {OsAbstractParser} parser
   */
  public addParseOs(name: string, parser: any): void {
    this.#osParserList[name] = parser;
  }

  /**
   * add bot type parser
   * @param {string} name
   * @param {BotAbstractParser} parser
   */
  public addParseBot(name: string, parser: any): void {
    this.#botParserList[name] = parser;
  }

  /**
   * add client type parser
   * @param {string} name
   * @param {ClientAbstractParser} parser
   */
  public addParseClient(name: string, parser: any): void {
    this.#clientParserList[name] = parser;
  }

  /**
   * add vendor type parser
   * @param {string} name
   * @param {VendorFragmentAbstractParser} parser
   */
  public addParseVendor(name: string, parser: any): void {
    this.#vendorParserList[name] = parser;
  }

  /**
   * set string size limit for the useragent
   * @param {number|null} size
   */
  public set maxUserAgentSize(size: number | null) {
    this.#maxUserAgentSize = size;
    for (const name in this.#clientParserList) {
      this.#clientParserList[name].setMaxUserAgentSize(size);
    }
    for (const name in this.#osParserList) {
      this.#osParserList[name].setMaxUserAgentSize(size);
    }
    for (const name in this.#deviceParserList) {
      this.#deviceParserList[name].setMaxUserAgentSize(size);
    }
  }

  /**
   * get string size limit for the useragent
   * @returns {null|number}
   */
  public get maxUserAgentSize(): null | number {
    return this.#maxUserAgentSize;
  }

  /**
   * is result false then skip bot detectors
   */
  public get skipBotDetection(): boolean {
    return this.#skipBotDetection;
  }

  /**
   * is set true then skip bot detectors
   */
  public set skipBotDetection(discard: boolean) {
    this.#skipBotDetection = discard;
  }

  /**
   * is set true use indexes, false not use indexes
   * @param {boolean} stage
   */
  public set deviceIndexes(stage: boolean) {
    this.#deviceIndexes = stage;
  }

  /**
   * is result true use indexes, false not use indexes
   * @return {boolean}
   */
  public get deviceIndexes(): boolean {
    return this.#deviceIndexes;
  }

  /**
   * is set true use indexes, false not use indexes
   * @param {boolean} stage
   */
  public set clientIndexes(stage: boolean) {
    this.#clientIndexes = stage;
    for (const name in this.#clientParserList) {
      this.#clientParserList[name].clientIndexes = stage;
    }
  }

  /**
   * is result true use indexes, false not use indexes
   * @return {boolean}
   */
  public get clientIndexes(): boolean {
    return this.#clientIndexes;
  }

  /**
   * is set true use deviceAliasCode, false not use deviceAliasCode
   * @param {boolean} stage
   */
  public set deviceAliasCode(stage: boolean) {
    this.#deviceAliasCode = stage;
  }

  /**
   * is result true use deviceAliasCode, false not use deviceAliasCode
   * @return {boolean} -
   */
  public get deviceAliasCode(): boolean {
    return this.#deviceAliasCode;
  }

  /**
   * parse bot
   * @param {string} userAgent
   * @param {ResultClientHints|{}} clientHints
   * @return {ResultBot|{}}
   */
  parseBot(userAgent: string, clientHints: ResultClientHints | JSONObject = {}): ResultBot | JSONObject {
    const result = {};

    if (this.skipBotDetection) {
      return result;
    }

    for (const name in this.#botParserList) {
      const parser = this.#botParserList[name];
      const resultMerge = parser.parse(userAgent);
      if (resultMerge) {
        return Object.assign(result, resultMerge);
      }
    }

    return result;
  }

  /**
   * parse OS
   * @param {string} userAgent
   * @param {ResultClientHints|{}} clientHints
   * @return {ResultOs|JSONObject}
   */
  parseOs(userAgent: string, clientHints: ResultClientHints | JSONObject = {}): ResultOs | JSONObject {
    let result = {};
    for (const name in this.#osParserList) {
      const parser = this.#osParserList[name];
      const resultMerge = parser.parse(userAgent, clientHints);
      if (resultMerge) {
        result = Object.assign(result, resultMerge);
        break;
      }
    }
    return result;
  }

  /**
   * prepare user agent for restrict rules
   * @param {string} userAgent
   * @returns {string}
   */
  prepareUserAgent(userAgent: string): string {
    const size = this.maxUserAgentSize;
    if (userAgent && size && size < userAgent.length) {
      return String(userAgent).substring(0, size);
    }
    return userAgent;
  }

  /**
   * parse device type
   * @param {string} userAgent
   * @param {ResultOs|JSONObject} osData
   * @param {ResultClient|JSONObject} clientData
   * @param {ResultDevice|JSONObject} deviceData
   * @param {ResultClientHints|JSONObject} clientHints
   * @return {DeviceType}
   */
  parseDeviceType(
    userAgent: string,
    osData: ResultOs | JSONObject,
    clientData: ResultClient | JSONObject,
    deviceData: ResultDevice | JSONObject,
    clientHints: ResultClientHints | JSONObject
  ): DeviceType {

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
      } else {
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
      const hasMobileBrowser = (
        clientType === CLIENT_TYPE.BROWSER &&
        MOBILE_BROWSER_LIST.indexOf(clientShortName) !== -1
      );

      const hasDesktopOs = osName !== '' && (
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
   * @returns {string[]}
   */
  getBrandsByDeviceCode(deviceCode: string): string[] {
    if ('' === deviceCode) {
      return [];
    }
    return IndexerDevice.findDeviceBrandsForDeviceCode(deviceCode);
  }

  /**
   * parse device model code from useragent string
   * @param {string} userAgent
   * @returns {ResultDeviceCode}
   */
  parseDeviceCode(userAgent: string): ResultDeviceCode {
    return aliasDevice.parse(userAgent);
  }

  /**
   * restore original userAgent from clientHints object
   * @param {string} userAgent
   * @param {ResultClientHints} clientHints
   */
  restoreUserAgentFromClientHints(userAgent: string, clientHints: ResultClientHints | any = {}): string {
    if (!hasDeviceModelByClientHints(clientHints)) {
      return userAgent;
    }
    const deviceModel = clientHints.device.model;
    if (deviceModel && hasUserAgentClientHintsFragment(userAgent)) {
      const osHints = attr(clientHints, 'os', {});
      const osVersion = attr(osHints, 'version', '');
      return userAgent.replace(/(Android 10[.\d]*; K)/,
        `Android ${osVersion !== '' ? osVersion : '10'}; ${deviceModel}`
      );
    }

    return userAgent;
  }

  /**
   * parse device
   * @param {string} userAgent
   * @param {ResultClientHints} clientHints
   * @return {ResultDevice}
   */
  parseDevice(userAgent: string, clientHints: ResultClientHints | any = {}): ResultDevice {

    const ua = this.restoreUserAgentFromClientHints(userAgent, clientHints);

    let brandIndexes = [];

    let result = {
      id: '',
      type: '',
      brand: '',
      model: '',
      code: '',
      info: {},
      trusted: null
    };

    if (!hasDeviceModelByClientHints(clientHints) && hasUserAgentClientHintsFragment(userAgent)) {
      return Object.assign({}, result);
    }

    if (this.deviceIndexes || this.deviceAliasCode || this.deviceInfo || this.deviceTrusted) {
      if (hasDeviceModelByClientHints(clientHints)) {
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
      for (const name in this.#deviceParserList) {
        const parser = this.#deviceParserList[name];
        const resultMerge = parser.parse(ua, brandIndexes);
        if (resultMerge) {
          result = Object.assign({}, result, resultMerge);
          break;
        }
      }
    }

    if (result && result.brand === '') {
      const resultVendor = this.parseVendor(ua);
      if (resultVendor) {
        result.brand = resultVendor.name;
        result.id = resultVendor.id;
      }
    }

    // client hints
    if (result.model === '' && hasDeviceModelByClientHints(clientHints)) {
      result.model = clientHints.device.model;
    }

    // device info or deviceTrusted
    if (this.deviceInfo || this.deviceTrusted) {
      const deviceModel = result.code ? result.code : result.model;
      result.info = this.getParseInfoDevice().info(result.brand, deviceModel);
    }

    return result;
  }

  /**
   * parse vendor
   * @param {string} userAgent
   * @return {ResultVendor|null}
   */
  parseVendor(userAgent: string): ResultVendor | null {
    const parser = this.getParseVendor(VENDOR_FRAGMENT_PARSER);
    return parser.parse(userAgent);
  }

  /**
   * parse client
   * @param {string} userAgent
   * @param {ResultClientHints} clientHints
   * @return {ResultClient|{}}
   */
  parseClient(userAgent: string, clientHints: ResultClientHints | any = {}): ResultClient | any {
    const extendParsers = [CLIENT_PARSER_LIST.MOBILE_APP, CLIENT_PARSER_LIST.BROWSER];
    for (const name in this.#clientParserList) {
      const parser = this.#clientParserList[name];

      if (this.clientIndexes && extendParsers.includes(name)) {
        const hash = parser.parseFromHashHintsApp(clientHints);
        const hint = parser.parseFromClientHints(clientHints);
        const data = parser.parseUserAgentByPositions(userAgent);
        const result = parser.prepareParseResult(userAgent, data, hint, hash);
        if (result !== null && result.name) {
          return Object.assign({}, result);
        }
      }

      const result = parser.parse(userAgent, clientHints);
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
   * @param {ResultClientHints|{}} clientHints
   * @return Promise<DetectResult>
   */
  async detectAsync(
    userAgent: string,
    clientHints: ResultClientHints | any = {}
  ): Promise<DetectResult> {
    userAgent = this.prepareUserAgent(userAgent);

    const devicePromise = new Promise((resolve) => {
      return resolve(this.parseDevice(userAgent, clientHints));
    });
    const osPromise = new Promise((resolve) => {
      return resolve(this.parseOs(userAgent, clientHints));
    });
    const clientPromise = new Promise((resolve) => {
      return resolve(this.parseClient(userAgent, clientHints));
    });

    const [deviceData, osData, clientData] = await Promise.all([
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
   * @param {ResultClientHints|{}} clientHints
   * @return {DetectResult}
   */
  detect(userAgent: string, clientHints: ResultClientHints | any = {}): DetectResult {
    userAgent = this.prepareUserAgent(userAgent);
    const deviceData = this.parseDevice(userAgent, clientHints);
    const osData = this.parseOs(userAgent, clientHints);
    const clientData = this.parseClient(userAgent, clientHints);

    return this.prepareDetectResult(
      userAgent,
      osData,
      clientData,
      deviceData,
      clientHints
    );
  }

}
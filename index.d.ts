import { JSONObject, ResultClientHints } from './client-hints';

export default class DeviceDetector {
  /**
   * @param {DeviceDetectorOptions} options
   **/
  constructor(options?: DeviceDetectorOptions);

  detect: (userAgent: string, clientHints?: ResultClientHints|JSONObject) => DetectResult;
  detectAsync: (userAgent: string, clientHints?: ResultClientHints|JSONObject) => Promise<DetectResult>;
  parseBot: (userAgent: string, clientHints?: ResultClientHints|JSONObject) => ResultBot;
  parseOs: (userAgent: string, clientHints?: ResultClientHints|JSONObject) => ResultOs;
  parseClient: (userAgent: string, clientHints?: ResultClientHints|JSONObject) => ResultClient;
  parseDevice: (userAgent: string, clientHints?: ResultClientHints|JSONObject) => ResultDevice;
  parseDeviceType: (
    userAgent: string,
    os?: ResultOs,
    client?: ResultClient,
    deviceData?: ResultDevice,
    clientHints?: ResultClientHints|JSONObject
  ) => DeviceType;
  parseVendor: (userAgent: string) => ResultVendor|null;
  parseDeviceCode: (userAgent: string) => ResultDeviceCode;
  set skipBotDetection(arg: boolean);
  get skipBotDetection(): boolean;
  set osVersionTruncate(arg: any);
  get osVersionTruncate(): any;
  set clientVersionTruncate(arg: any);
  get clientVersionTruncate(): any;
  set clientIndexes(arg: boolean);
  get clientIndexes(): boolean;
  get maxUserAgentSize(): number|null;
  set maxUserAgentSize(size: number);
  setOsVersionTruncate(value: any): void;
  setClientVersionTruncate(value: any): void;

  set deviceTrusted(stage: boolean);
  get deviceTrusted(): boolean;

  set deviceInfo(stage: boolean);
  get deviceInfo(): boolean;

  /**
   * @param {boolean} stage - true use indexes, false not use indexes
   */
  set osIndexes(stage: boolean);

  /**
   * @return {boolean} - true use indexes, false not use indexes
   */
  get osIndexes(): boolean;

  /**
   * @param {boolean} stage - true use indexes, false not use indexes
   */
  set deviceIndexes(stage: boolean);

  /**
   * @return {boolean} - true use indexes, false not use indexes
   */
  get deviceIndexes(): boolean;

  /**
   * @param {boolean} arg - true use deviceAliasCode,  false not use deviceAliasCode
   */
  set deviceAliasCode(arg: boolean);

  /**
   * @return {boolean} - true use deviceAliasCode, false not use deviceAliasCode
   */
  get deviceAliasCode(): boolean;

  /**
   * @returns {string[]}
   */
  getAvailableDeviceTypes(): string[];

  /**
   * get all brands
   * @returns {string[]}
   */
  getAvailableBrands(): string[];

  /**
   * has device brand
   * @param brand
   * @returns {boolean}
   */
  hasBrand(brand: any): boolean;
  /**
   * get all browsers
   * @returns {string[]}
   */
  getAvailableBrowsers(): string[];

  /**
   * get brand by device code (used in indexing)
   * @param {string} deviceCode
   * @returns {*[]}
   */
  getBrandsByDeviceCode(deviceCode: string): any[];

  /**
   * get alias device parser
   * @returns {*}
   */
  getParseAliasDevice(): any;

  /**
   * get device parser by name
   * @param {string} name
   * @return {*}
   */

  getParseDevice(name: string): any;

  /**
   * get client parser by name
   * @param {string} name
   * @return {*}
   */
  getParseClient(name: string): any;

  /**
   * get os parser by name
   * @param name
   * @return {*}
   */
  getParseOs(name: any): any;

  /**
   * get vendor parser by name (specific parsers)
   * @param {string} name
   * @return {*}
   */
  getParseVendor(name: string): any;

  /**
   * add device type parser
   * @param {string} name
   * @param parser
   */
  addParseDevice(name: string, parser: any): void;

  /**
   * add os type parser
   * @param {string} name
   * @param {*} parser
   */
  addParseOs(name: string, parser: any): void;

  /**
   * add bot type parser
   * @param {string} name
   * @param {*} parser
   */
  addParseBot(name: string, parser: any): void;

  /**
   * add client type parser
   * @param {string} name
   * @param {*} parser
   */
  addParseClient(name: string, parser: any): void;

  /**
   * add vendor type parser
   * @param {string} name
   * @param {*} parser
   */
  addParseVendor(name: string, parser: any): void;

  /**
   * restore original userAgent from clientHints object
   * @param {string} userAgent
   * @param {ResultClientHints|JSONObject} clientHints
   * @return string
   */
  restoreUserAgentFromClientHints(userAgent: string, clientHints?: JSONObject|ResultClientHints): string;
}

export interface DeviceDetectorOptions {
  skipBotDetection?: boolean;
  osVersionTruncate?: number | null;
  clientVersionTruncate?: number | null;
  maxUserAgentSize?: number | null;
  osIndexes?: boolean;
  deviceIndexes?: boolean;
  clientIndexes?: boolean;
  deviceAliasCode?: boolean;
  deviceTrusted?: boolean;
  deviceInfo?: boolean;
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
  trusted?: boolean|null;
  info?: ResultDeviceInfo|null
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
  resolution?: string|ResultDeviceInfoResolution;
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
  ram: number
  cpu_id?: number
  cpu?: ResultDeviceInfoHardwareCPU
  gpu?: ResultDeviceInfoHardwareGPU
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
  sim?: number|null;
  size?: string|ResultDeviceInfoSize|null;
  weight?: string|null;
  release?: string|null;
  os?: string|null;
  hardware?: ResultDeviceInfoHardware|null;
  performance?: ResultDeviceInfoPerformance|null;
}

export default class ClientHints {
  static getHeaderClientHints(): JSONObject;
  static isSupport(headers: JSONObject): boolean;

  parse(hints: JSONObject, meta: JSONObject): ResultClientHints;
}

export interface ResultMetaClientHints {
  width?: string;
  height?: string;
  gpu?: string;
  gamut?: string;
  ram?: string;
  colorDepth?: string;
  cpuCores?: number;
}

export interface ResultPrefersClientHints {
  colorScheme: string;
}

export interface ResultClientPropClientHints {
  brands: string[];
  version: string;
}

export interface ResultOsPropClientHints {
  name: string;
  platform: string;
  bitness: string;
  version: string;
}

export interface ResultDevicePropClientHints {
  model: string;
}

export interface ResultClientHints {
  upgradeHeader: boolean;
  formFactors?: string[];
  meta?: ResultMetaClientHints;
  prefers?: ResultPrefersClientHints;
  os: ResultOsPropClientHints;
  client: ResultClientPropClientHints;
  device: ResultDevicePropClientHints;
}

export type JSONValue =
  | string
  | number
  | boolean
  | JSONObject
  | JSONArray
  | null;

export interface JSONObject {
  [k: string]: JSONValue;
}
export type JSONArray = Array<JSONValue>;

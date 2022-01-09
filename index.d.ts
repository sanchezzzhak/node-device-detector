declare module 'node-device-detector' {
  // export  module to be used in .ts file
  export default class DeviceDetector {
    detect: (userAgent: string) => DetectResult;
    parseBot: (userAgent: string) => ResultBot;
    parseOs: (userAgent: string) => ResultOs;
    parseClient: (userAgent: string) => ResultClient;
    parseDevice: (userAgent: string) => ResultDevice;
    parseVendor: (userAgent: string) => ResultVendor;
    parseDeviceCode: (userAgent: string) => ResultDeviceCode;
    parseDeviceType: (
      userAgent: string,
      os: ResultOs,
      client: ResultClient,
      data?: any
    ) => DeviceType;
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
  }

  export interface DeviceType {
    id: string;
    type: string;
  }

  export interface ResultBot {
    name: string;
    producer: any;
    category: string;
    url: string;
  }
}

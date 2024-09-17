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

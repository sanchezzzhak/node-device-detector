const DEVICE_TYPES = require('./parser/const/device-type');

const getDeviceType = (result) => {
  return result.device && result.device.type ? result.device.type : null;
};

const isTablet = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.TABLET;
};

const isPhablet = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.PHABLET;
};
const isFeaturePhone = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.FEATURE_PHONE;
};

const isSmartphone = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.SMARTPHONE;
};

const isCar = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.CAR_BROWSER;
};

const isMobile = (result) => {
  return isSmartphone(result) || isFeaturePhone(result) || isPhablet(result);
};

const isDesktop = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.DESKTOP;
};

const isAndroid = (result) => {
  return result.os && result.os.family === 'Android';
};

const isIOS = (result) => {
  return result.os && result.os.family === 'iOS';
};

const isTv = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.TV;
};

const isConsole = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.CONSOLE;
};

const isCamera = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.CAMERA;
};

const isPortableMediaPlayer = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.PORTABLE_MEDIA_PLAYER;
};

const isSmartSpeaker = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.SMART_SPEAKER;
};

const isPeripheral = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.PERIPHERAL;
};

const isSmartDisplay = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.SMART_DISPLAY;
};

const isWearable = (result) => {
  return getDeviceType(result) === DEVICE_TYPES.WEARABLE;
};

/*
const isOS = (name) => {};
const isBrowser = (name) => {};
*/

module.exports = {
  isCamera,
  isCar,
  isConsole,
  isDesktop,
  isFeaturePhone,
  isMobile,
  isPeripheral,
  isPhablet,
  isPortableMediaPlayer,
  isSmartDisplay,
  isSmartSpeaker,
  isSmartphone,
  isTablet,
  isTv,
  isWearable,
  isAndroid,
  isIOS,
};

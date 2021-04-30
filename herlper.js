const DEVICE_TYPES = require('./parser/const/device-type');

const isTabled = (result) => {
  return result.device && result.device === DEVICE_TYPES.TABLET;
};

const isPhablet = (result) => {
  return result.device && result.device === DEVICE_TYPES.PHABLET;
};
const isFeaturePhone = (result) => {
  return result.device && result.device === DEVICE_TYPES.FEATURE_PHONE;
};

const isSmartphone = (result) => {
  return result.device && result.device === DEVICE_TYPES.SMARTPHONE;
};

const isCar = (result) => {
  return result.device && result.device === DEVICE_TYPES.CAR_BROWSER;
};

const isMobile = (result) => {
  return isSmartphone(result) || isFeaturePhone(result) || isPhablet(result);
};

const isDesktop = (result) => {
  return result.device === DEVICE_TYPES.DESKTOP;
};

const isAndroid = (result) => {
  return result.os && result.os.family === 'Android';
};

const isIOS = (result) => {
  return result.os && result.os.family === 'iOS';
};

const isTv = (result) => {
  return result.device && result.device === DEVICE_TYPES.TV;
};

const isConsole = (result) => {
  return result.device && result.device === DEVICE_TYPES.CONSOLE;
};

const isCamera = (result) => {
  return result.device && result.device === DEVICE_TYPES.CAMERA;
};

const isPortableMediaPlayer = (result) => {
  return result.device && result.device === DEVICE_TYPES.PORTABLE_MEDIA_PLAYER;
};

const isSmartSpeaker = (result) => {
  return result.device && result.device === DEVICE_TYPES.SMART_SPEAKER;
};

const isPeripheral = (result) => {
  return result.device && result.device === DEVICE_TYPES.PERIPHERAL;
};

const isSmartDisplay = (result) => {
  return result.device && result.device === DEVICE_TYPES.SMART_DISPLAY;
};

const isWearable = (result) => {
  return result.device && result.device === DEVICE_TYPES.WEARABLE;
};

/*
const isOS = (name) => {};
const isBrowser = (name) => {};
*/

exports = {
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
  isTabled,
  isTv,
  isWearable,

  isAndroid,
  isIOS,
};

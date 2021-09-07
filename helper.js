const DEVICE_TYPES = require('./parser/const/device-type');
const DEVICE_TYPE_IDS = require('./parser/const/device-type-id');
const CLIENT_TYPES = require('./parser/const/client-type');


const getDeviceType = (result) => {
  return result.device && result.device.type ? result.device.type : null;
};

/**
 * @param {string} name
 * @returns {number|null}
 */
const getDeviceTypeIdForName = (name) => {
  return name && DEVICE_TYPE_IDS[name] ? DEVICE_TYPE_IDS[name]: null;
};

const getDeviceTypeId = (result) => {
  return getDeviceTypeIdForName(getDeviceType(result))
};

const getClientType = (result) => {
  return result.client && result.client.type ? result.client.type : null;
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

const isBrowser = (result) => {
  return getClientType(result) === CLIENT_TYPES.BROWSER;
};

const isApp = (result) => {
  return getClientType(result) !== null && !isBrowser(result);
};

const isDesktopApp = (result) => {
  return isApp(result) && isDesktop(result);
};

const isMobileApp = (result) => {
  return isApp(result) && isMobile(result);
};


module.exports = {
  getDeviceType,
  getDeviceTypeId,
  getDeviceTypeIdForName,
  getClientType,
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
  isBrowser,
  isApp,
  isDesktopApp,
  isMobileApp,
  isIOS,
};

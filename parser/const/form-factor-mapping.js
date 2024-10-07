const DEVICE_TYPE = require('./device-type');

module.exports =  {
  'automotive' : DEVICE_TYPE.CAR_BROWSER,
  'xr'         : DEVICE_TYPE.WEARABLE,
  'watch'      : DEVICE_TYPE.WEARABLE,
  'mobile'     : DEVICE_TYPE.SMARTPHONE,
  'tablet'     : DEVICE_TYPE.TABLET,
  'desktop'    : DEVICE_TYPE.DESKTOP,
  'eink'       : DEVICE_TYPE.TABLET,
};
const ParserAbstract = require('./../abstract-parser');
const DataPacker = require('./../../lib/data-packer');

// this is a test functionality do not try to use this class in production
// this is a test functionality do not try to use this class in production
// this is a test functionality do not try to use this class in production
// this is a test functionality do not try to use this class in production
// this is a test functionality do not try to use this class in production
// this is a test functionality do not try to use this class in production
// this is a test functionality do not try to use this class in production


// declaration doc object

/*

### Get more information about a device (experimental)
> year, weight, release, display.size, display.resolution, display.ratio
```js
const InfoDevice = require('node-device-detector/parser/device/info-device');
const infoDevice = new InfoDevice;
const result = infoDevice.info('Asus', 'Zenfone 4');
console.log('Result information about device', result);
/*
result
{
  display: { size: '5.5', resolution: '1080x1920', ratio: '16:9' },
  size: '155.4x75.2x7.7',
  weight: '165',
  release: '2017'
}
is not found result null
*/
/*
```
cast methods
```js
infoDevice.setSizeConvertObject(true);
infoDevice.setResolutionConvertObject(true);
```
 */


/**
 * @typedef InfoDisplay
 * @param {string} size
 * @param {string} resolution
 * @param {string} ratio
 *
 * @typedef InfoResult
 * @param {InfoDisplay} display
 * @param {string} size
 * @param {string} weight
 * @param {string|null} release
 */

// private methods

/**
 * Convert string 100x100 to object {width, height}
 * @param size
 * @return {{width: string, height: string}}
 */
const castResolutionToObject = (size) => {
  let [width, height] = size.split('x');
  return {width, height}
}
/**
 * Convert string 100x100x100 to object {width, height,thickness}
 * @param size
 * @return {{thickness: string, width: string, height: string}}
 */
const castSizeToObject = (size) => {
  let [width, height, thickness] = size.split('x');
  return {width, height, thickness}
}

/**
 * calculate PPI
 * @param width
 * @param height
 * @param size
 * @returns {number}
 */
const castResolutionPPI = (width, height, size) => {
  return Math.round(
    Math.sqrt(Math.pow(parseInt(width), 2) + Math.pow(parseInt(height), 2)) / parseFloat(size)
  );
}

/**
 * port gcd function
 * @param u
 * @param v
 * @returns {*}
 */
const gcd = (u, v) => {
  if (u === v) return u;
  if (u === 0) return v;
  if (v === 0) return u;
  if (~u & 1) {
    return (v & 1) ? gcd(u >> 1, v) : gcd(u >> 1, v >> 1) << 1;
  }
  if (~v & 1) return gcd(u, v >> 1);
  if (u > v) return gcd((u - v) >> 1, v);
  return gcd((v - u) >> 1, u);
};

/**
 * calculate ratio
 * @param width
 * @param height
 * @returns {string}
 */
const castResolutionRatio = (width, height) => {
  let d = gcd(width, height);
  return `${Math.round(height / d)}:${Math.round(width / d)}`;
}

// help block

/**
 * @usage
 * let i = new InfoDevice
 * let result = i.info('Asus', 'ZenFone 4')
 * console.log({result});
 * // result if found
 * {
 *   display: {size: "5.5", resolution: "1080x1920", ratio: "16:9", ppi: 401},
 *   size: "155.4x75.2x7.7",
 *   weight: "165",
 *   release: "2017"
 * }
 * // result in not found
 * null
 */

const SHORT_KEYS = {
  DS: 'display.size',
  // DT: 'display.type',  // string: display type IPS, LCD, OLED, SLED etc.
  // TS: 'display.touch'  // boolean: touch support
  RS: 'display.resolution',
  SZ: 'size',
  WT: 'weight',       // int: weight
  RE: 'release',      // string:year release
  // SM: 'sim',       // int: count SIM
  // RM: 'ram',       // int: RAM in MB
  // CP: 'cpu',       // string: MediaTek MT6582M,1300
  // CU: 'cpu_count', // int: of cpu 4
  // GP: 'gpu',       // string: Mali-400 MP2
};

/**
 * Class for obtaining information on a device
 */
class InfoDevice extends ParserAbstract {
  
  constructor() {
    super();
    
    /** @type {boolean} convert size 75.2x155.4x7.7 to object {width, height, thickness} */
    this.sizeConvertObject = false;
    /** @type {boolean} convert display.resolution 1080x1920 to object {width, height} */
    this.resolutionConvertObject = false;
    /** @type {string} fixture path to file */
    this.fixtureFile = 'device/info-device.yml';
    
    this.loadCollection();
  }
  
  /**
   * Overwrite config sizeConvertObject
   * @param {boolean} value
   */
  setSizeConvertObject(value) {
    this.sizeConvertObject = !!value;
  }
  
  /**
   * Overwrite config resolutionConvertObject
   * @param {boolean} value
   */
  setResolutionConvertObject(value) {
    this.resolutionConvertObject = !!value;
  }
  
  /**
   * The main method for obtaining information on brand and device
   * @param {String} deviceBrand
   * @param {String} deviceModel
   * @return {InfoResult|null}
   */
  info(deviceBrand, deviceModel) {
    if (!deviceBrand.length || !deviceModel.length) {
      return null;
    }
    
    const fixStringName = (str) => str.replace(new RegExp('_', 'g'), ' ');
    
    deviceBrand = fixStringName(deviceBrand);
    deviceModel = fixStringName(deviceModel);
    
    let brand = deviceBrand.trim().toLowerCase();
    let model = deviceModel.trim().toLowerCase();
    
    if (this.collection[brand] === void 0 || this.collection[brand][model] === void 0) {
      return null;
    }
    
    let data = this.collection[brand][model];
    
    // check redirect
    let dataRedirect = /^->(.+)$/i.exec(data);
    if (dataRedirect !== null) {
      return this.info(deviceBrand, dataRedirect[1]);
    }
    
    // get normalise data
    let result = DataPacker.unpack(data, SHORT_KEYS);
    
    // calculate ration & ppi
    let resolution = result.display.resolution ? castResolutionToObject(result.display.resolution) : "";
    let ratio = '';
    let ppi = '';
    if (typeof resolution !== 'string') {
      let resolutionWidth = parseInt(resolution.width);
      let resolutionHeight = parseInt(resolution.height);
      ppi = castResolutionPPI(resolutionWidth, resolutionHeight, result.display.size);
      ratio = castResolutionRatio(resolutionWidth, resolutionHeight);
    }
    
    return {
      display: {
        size: result.display.size,
        resolution: this.resolutionConvertObject && result.display.resolution ? resolution : result.display.resolution,
        ratio: ratio,
        ppi: ppi,
      },
      size: this.sizeConvertObject && result.size
        ? castSizeToObject(result.size)
        : result.size,
      weight: result.weight,
      release: result.release
    };
  }
  
}

module.exports = InfoDevice;

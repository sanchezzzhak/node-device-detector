const ParserAbstract = require('./../abstract-parser');
const DataPacker = require('./../../lib/data-packer');
const collectionHardwareCPU = require('../../regexes/device-info/hardware-cpu');
const collectionHardwareGPU = require('../../regexes/device-info/hardware-gpu');
const collectionSoftware = require('../../regexes/device-info/software');
const SHORT_KEYS = require('../../regexes/device-info/schema');
const { mergeDeep, sortObject } = require('../helper');

/*

### Get more information about a device (experimental)
> year, weight, release, display.size, display.resolution, display.ratio
```js
const InfoDevice = require('node-device-detector/parser/device/info-device');
const infoDevice = new InfoDevice();
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

// private methods

/**
 * Convert string 100x100 to object {width, height}
 * @param size
 * @return {{width: string, height: string}}
 */
const castResolutionToObject = (size) => {
  let [width, height] = size.split('x');
  return { width, height };
};
/**
 * Convert string 100x100x100 to object {width, height, thickness}
 * @param size
 * @return {{thickness: string, width: string, height: string}}
 */
const castSizeToObject = (size) => {
  let [width, height, thickness] = size.split('x');
  return { width, height, thickness };
};

/**
 *
 * @param {*} collection
 * @param {number|string} id
 * @returns {null|*}
 * @private
 */
const getDataByIdInCollection = (collection, id) => {
  let data = collection[parseInt(id)];
  if (data === void 0) {
    return null;
  }
  return data;
};

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
    return v & 1 ? gcd(u >> 1, v) : gcd(u >> 1, v >> 1) << 1;
  }
  if (~v & 1) return gcd(u, v >> 1);
  if (u > v) return gcd((u - v) >> 1, v);
  return gcd((v - u) >> 1, u);
};
// help block

/**
 * @usage
 * let i = new InfoDevice();
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
    this.collection = require('../../regexes/device-info/device');
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
   * @param id
   * @returns {null|*}
   */
  getOsById(id) {
    if (collectionSoftware['os'] === void 0) {
      return null;
    }
    return getDataByIdInCollection(collectionSoftware['os'], id);
  }

  getGpuIdFromName(name) {
    const lName = name.toLowerCase();
    if (collectionHardwareGPU['gpu'] === void 0) {
      return null;
    }
    for (let id in collectionHardwareGPU['gpu']) {
      let gpu = collectionHardwareGPU['gpu'][id];
      if (gpu !== void 0 && gpu.name.toLowerCase() === lName){
        return id;
      }
    }
    return null;
  }

  getGpuById(id) {
    if (collectionHardwareGPU['gpu'] === void 0) {
      return null;
    }
    return getDataByIdInCollection(collectionHardwareGPU['gpu'], id);
  }

  getCpuIdFromName(name) {
    const lName = name.toLowerCase();
    if (collectionHardwareCPU['cpu'] === void 0) {
      return null;
    }
    for (let id in collectionHardwareCPU['cpu']) {
      let cpu = collectionHardwareCPU['cpu'][id];
      if (cpu !== void 0 && cpu.name !== void 0 && cpu.name.toLowerCase() === lName){
        return id;
      }
    }
    return null
  }

  getCpuById(id) {
    if (collectionHardwareCPU['cpu'] === void 0) {
      return null;
    }
    return getDataByIdInCollection(collectionHardwareCPU['cpu'], id);
  }

  find(deviceBrand, deviceModel, mergeData = {}) {

    if (!deviceBrand.length || !deviceModel.length) {
      return null;
    }

    const fixStringName = (str) => str.replace(new RegExp('_', 'g'), ' ');

    let brand = fixStringName(deviceBrand).trim().toLowerCase();
    let model = fixStringName(deviceModel).trim().toLowerCase();

     const isSkip = this.collection[brand] === void 0 ||
       this.collection[brand] === null ||
       this.collection[brand][model] === void 0;

     if (isSkip) {
       return null;
     }

    let data = this.collection[brand][model];
    // get normalise data
    let result = DataPacker.unpack(data, SHORT_KEYS);

    this.prepareResultDisplay(result);
    this.prepareResultHardware(result);
    this.prepareResultSoftware(result);
    this.prepareResultSize(result);
    this.prepareResultPerformance(result);
    result = mergeDeep(result, mergeData);

    // redirect and overwrite params
    let dataRedirect = /^->([^;]+)/i.exec(data);
    if (dataRedirect !== null) {
      return this.find(deviceBrand, dataRedirect[1], result);
    }
    return sortObject(result);
  }

  prepareResultSize(result) {
    if (this.sizeConvertObject && result.size) {
      result.size = castSizeToObject(result.size);
    }
  }

  prepareResultSoftware(result) {
    if (result.os_id) {
      let output = [];
      let os = this.getOsById(result.os_id);
      delete result.os_id;
      if (os !== null) {
        output.push(os.name);
      }
      if (result.os_version) {
        output.push(result.os_version);
        delete result.os_version;
      }
      if (output.length === 2) {
        result.os = output.join(' ');
      }
    }
  }

  prepareResultHardware(result) {
    // set hardware data
    if (result.hardware) {
      let gpu;
      let cpu;
      if (result.hardware.gpu === void 0 && result.hardware.gpu_id !== void 0) {
        gpu = this.getGpuById(result.hardware.gpu_id);
        if (gpu !== null) {
          result.hardware.gpu = gpu;
        }
      }
      if (result.hardware.cpu_id !== void 0) {
        cpu = this.getCpuById(result.hardware.cpu_id);
        if (cpu !== null) {
          result.hardware.cpu = cpu;
          if (result.hardware.gpu === void 0 && result.hardware.cpu.gpu_id) {
            result.hardware.gpu = this.getGpuById(result.hardware.cpu.gpu_id);
          }
        }
      }
    }
  }


  prepareResultDisplay(result) {
    // set display data
    if (result.display) {
      // calculate ration & ppi
      let resolution =
        result.display && result.display.resolution
          ? castResolutionToObject(result.display.resolution)
          : '';

      let ratio = '';
      let ppi = '';
      if (typeof resolution !== 'string') {
        let resolutionWidth = parseInt(resolution.width);
        let resolutionHeight = parseInt(resolution.height);

        if (resolutionWidth && resolutionHeight) {
          if (result.display.size) {
            ppi = this.castResolutionPPI(
              resolutionWidth,
              resolutionHeight,
              result.display.size
            );
          }
          ratio = this.castResolutionRatio(resolutionWidth, resolutionHeight);
        }
      }

      result.display.size = result.display.size ? result.display.size : null;
      result.display.resolution = this.resolutionConvertObject
        ? resolution
        : result.display.resolution;

      if (ratio) {
        result.display.ratio = ratio;
      }

      if (ppi) {
        result.display.ppi = String(ppi);
      }
    }
  }

  /**
   * Converts the values of the performance section to the desired format type
   * @param result {ResultDeviceInfo}
   */
  prepareResultPerformance(result) {
    if (result.performance !== void 0 && result.performance.antutu !== void 0) {
      result.performance.antutu = parseInt(result.performance.antutu);
    }
    if (result.performance !== void 0 && result.performance.geekbench !== void 0) {
      result.performance.geekbench = parseInt(result.performance.geekbench);
    }
  }

  /**
   * The main method for obtaining information on brand and device
   * @param {String} deviceBrand
   * @param {String} deviceModel
   * @return {ResultDeviceInfo|null}
   */
  info(deviceBrand, deviceModel) {
    return this.find(deviceBrand, deviceModel, {});
  }

  castScreenSizeInInches(widthPx, heightPx, dpi) {
    const diagonalPx = Math.hypot(parseInt(widthPx), parseInt(heightPx));
    return parseFloat((diagonalPx / dpi).toFixed(2));
  }

  /**
   * calculate ratio
   * @param width
   * @param height
   * @returns {string}
   */
  castResolutionRatio(width, height){
    let d = gcd(width, height);
    return `${Math.round(height / d)}:${Math.round(width / d)}`;
  };

  /**
   * calculate PPI
   * @param width
   * @param height
   * @param size
   * @returns {number}
   */
  castResolutionPPI(width, height, size) {
    return Math.round(
      Math.sqrt(Math.pow(parseInt(width), 2) + Math.pow(parseInt(height), 2)) /
      parseFloat(size)
    );
  };
}

module.exports = InfoDevice;

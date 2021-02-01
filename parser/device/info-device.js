const ParserAbstract = require('./../abstract-parser');

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
 *
 * @param {string|null} release
 *
 */


/**
 * @usage
 * let i = new InfoDevice
 * let result = i.info('Asus', 'ZenFone 4')
 * console.log({result});
 * // result if found
 * {
 *   display: {size: "5.5", resolution: "1080x1920", ratio: "16:9"},
 *   size: "155.4x75.2x7.7",
 *   weight: "165",
 *   release: "2017"
 * }
 * // result in not found
 * null
 */
class InfoDevice extends ParserAbstract {
  
  constructor() {
	super();
	this.sizeConvertObject = false;  // convert result.size 155.4x75.2x7.7 to object {width, height, thickness}
	this.resolutionConvertObject = false;  // convert result.display.resolution 1080x1920 to object {width, height}
	this.fixtureFile = 'device/info-device.yml';
	this.loadCollection();
  }
  
  /**
   * Overwrite config sizeConvertObject
   * @param {Boolean} value
   */
  setSizeConvertObject(value) {
	this.sizeConvertObject = !!value;
  }
  
  setResolutionConvertObject(value) {
	this.resolutionConvertObject = !!value;
  }
  
  /**
   * result info device
   * @param {String} deviceBrand
   * @param {String} deviceModel
   * @return {InfoResult|null}
   */
  info(deviceBrand, deviceModel) {
	if (!deviceBrand.length || !deviceModel.length) {
	  return null;
	}
	
	let brand = deviceBrand.trim().toLowerCase();
	let model = deviceModel.trim().toLowerCase();
	
	if (this.collection[brand] === undefined) {
	  return null;
	}
	if (this.collection[brand][model] === undefined) {
	  return null;
	}
	let result = this.collection[brand][model];
	
	if (this.resolutionConvertObject && result.display.resolution && result.display.resolution.length > 0) {
	  result.display.resolution = castResolutionToObject(result.display.resolution);
	}
	
	if (this.sizeConvertObject && result.size && result.size.length > 0) {
	  result.size = castSizeToObject(result.size);
	}
	
	return result;
  }
  
}


const castResolutionToObject = (size) => {
  let [width, height] = size.split('x');
  return {width, height}
}


const castSizeToObject = (size) => {
  let [width, height, thickness] = size.split('x');
  return {width, height, thickness}
}

module.exports = InfoDevice;
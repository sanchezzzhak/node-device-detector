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

// help block

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

const SHORT_KEYS = {
	DS: 'display.size',
	RS: 'display.resolution',
	RT: 'display.ratio',
	SZ: 'size',
	WT: 'weight',
	RE: 'release'
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
		
		const finStringName = (str) => str.replace(new RegExp('_', 'g'), ' ');
		
		deviceBrand = finStringName(deviceBrand);
		deviceModel = finStringName(deviceModel);
		
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
		// get date
		let result = DataPacker.unpack(data, SHORT_KEYS);
		return {
			display: {
				size: result.display.size,
				resolution: this.resolutionConvertObject && result.display.resolution
					? castResolutionToObject(result.display.resolution)
					: result.display.resolution,
				ratio: result.display.ratio
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

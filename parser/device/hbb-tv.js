const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

const DEVICE_TYPE = require('./../const/device-type');

function HbbTv() {
  HbbTv.super_.call(this);
  this.fixtureFile = 'device/televisions.yml';
  this.loadCollection();
}

util.inherits(HbbTv, DeviceAbstractParser);

HbbTv.prototype.parse = function (userAgent) {
  if (!this.isHubTv(userAgent)) {
	return null;
  }
  
  let result = {
	id: '',
	type: DEVICE_TYPE.TV,
	brand: '',
	model: ''
  };
  
  let resultParse = DeviceAbstractParser.prototype.parse.call(this, [userAgent]);
  if (resultParse) {
	result.id = resultParse.id;
	result.brand = resultParse.brand;
	result.model = resultParse.model;
  }
  return result;
};

/**
 * has check userAgent fragment is hub tv
 * @param {String} userAgent
 * @return {Boolean}
 */
HbbTv.prototype.isHubTv = function (userAgent) {
  let regex = 'HbbTV/([1-9]{1}(?:\.[0-9]{1}){1,2})';
  let match = this.getBaseRegExp(regex).exec(userAgent);
  return match !== null;
};


module.exports = HbbTv;
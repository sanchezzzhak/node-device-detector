const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

const DEVICE_TYPE = require('./../const/device-type');

function Notebook() {
  Notebook.super_.call(this);
  this.fixtureFile = 'device/notebooks.yml';
  this.loadCollection();
}

util.inherits(Notebook, DeviceAbstractParser);

Notebook.prototype.parse = function (userAgent) {
  if (!this.isFBMD(userAgent)) {
	return null;
  }
  let resultParse = DeviceAbstractParser.prototype.parse.call(this, [userAgent]);
  
  if (resultParse) {
	let result = {
	  id: '',
	  type: DEVICE_TYPE.DESKTOP,
	  brand: '',
	  model: ''
	};
	result.id = resultParse.id;
	result.brand = resultParse.brand;
	result.model = resultParse.model;
	return result;
  }
  
  return null;
};

/**
 * has check userAgent fragment is FBMD
 * @param {String} userAgent
 * @return {Boolean}
 */
Notebook.prototype.isFBMD = function (userAgent) {
  let regex = 'FBMD/';
  let match = this.getBaseRegExp(regex).exec(userAgent);
  return match !== null;
};


module.exports = Notebook;

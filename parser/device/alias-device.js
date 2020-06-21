const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');


function AliasDevice() {
  AliasDevice.super_.call(this);
  this.fixtureFile = 'device/alias-device.yml';
  this.__brandReplaceRegexp = '';
  this.loadCollection();
}

AliasDevice.prototype.parse = function (userAgent) {
  let result = {
	name: '',
  };
  for (let cursor in this.collection) {
	let item = this.collection[cursor];
	let match = this.getBaseRegExp(item['regex']).exec(userAgent);
	if (match) {
	  result.name = this.buildByMatch(item['name'], match).replace(
	    new RegExp(this.getBrandReplaceRegexp(), 'isg'),
		''
	  ).trim();
	  break;
	}
  }
  return result;
};

AliasDevice.prototype.getBrandReplaceRegexp = function () {
  if (!this.__brandReplaceRegexp) {
    let escapeeChars = [/\+/gi, /\./gi];
    let replaceChars = ['\\\+', '\\\.'];
	let brands = Object.keys(this.getCollectionBrands()).join('|');
	for(let i =0, l= escapeeChars.length; i < l; i++){
	  brands = brands.replace(escapeeChars[i], replaceChars[i]);
	}
	this.__brandReplaceRegexp = brands;
  }

  return this.__brandReplaceRegexp;
};

util.inherits(AliasDevice, DeviceAbstractParser);

module.exports = AliasDevice;
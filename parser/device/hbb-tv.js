const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

const DEVICE_TYPE = require('./../const/device-type');

function HbbTv() {
  this.fixtureFile = 'device/televisions.yml';
  this.loadCollection();
}

util.inherits(HbbTv, DeviceAbstractParser);

HbbTv.prototype.parse = function (userAgent) {
  if(!this.isHubTv(userAgent)){
      return false;
  }
  DeviceAbstractParser.prototype.parse.call(this, [userAgent]);
  this.type = DEVICE_TYPE.TV;
  return true;
};

/**
 * has check userAgent fragment is hub tv
 * @param {String} userAgent
 * @return {Boolean}
 */
HbbTv.prototype.isHubTv = function(userAgent){
  let regex =  'HbbTV/([1-9]{1}(?:\.[0-9]{1}){1,2})';
  let match = this.getBaseRegExp(regex).exec(userAgent);
  return match !== null;
};


module.exports = HbbTv;
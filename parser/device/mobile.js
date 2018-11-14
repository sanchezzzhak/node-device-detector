const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');


function Mobile() {
  Mobile.super_.call(this);
  this.fixtureFile = 'device/mobiles.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(Mobile, DeviceAbstractParser);

module.exports = Mobile;
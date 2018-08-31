const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');


function Mobile() {
  this.fixtureFile = 'device/mobiles.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(Mobile, DeviceAbstractParser);

module.exports = Mobile;
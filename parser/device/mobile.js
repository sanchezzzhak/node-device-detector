const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');


function Mobile() {
  this.fixtureFile = 'device/mobiles.yml';
  this.loadCollection();
}

util.inherits(Mobile, DeviceAbstractParser);

module.exports = Mobile;
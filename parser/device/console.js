const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

function Console() {
  this.fixtureFile = 'device/consoles.yml';
  this.loadCollection();
}

util.inherits(Console, DeviceAbstractParser);


module.exports = Console;
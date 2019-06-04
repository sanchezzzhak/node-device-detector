const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

function Console() {
  Console.super_.call(this);
  this.fixtureFile = 'device/consoles.yml';
  this.loadCollection();
}

util.inherits(Console, DeviceAbstractParser);


module.exports = Console;
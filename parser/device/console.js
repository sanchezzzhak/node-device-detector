const DeviceAbstractParser = require('./../device-abstract-parser');

class Console extends DeviceAbstractParser {
  constructor() {
    super();
    this.collection = require('../../regexes/device/consoles');
  }
}

module.exports = Console;

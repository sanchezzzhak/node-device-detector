const DeviceAbstractParser = require('./../device-abstract-parser');

class Mobile extends DeviceAbstractParser {
  constructor() {
    super();
    this.collection = require('../../regexes/device/mobiles');
  }
}

module.exports = Mobile;

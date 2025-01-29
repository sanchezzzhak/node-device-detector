const DeviceAbstractParser = require('./../device-abstract-parser');

class Camera extends DeviceAbstractParser {
  constructor() {
    super();
    this.collection = require('../../regexes/device/cameras');
  }
}

module.exports = Camera;

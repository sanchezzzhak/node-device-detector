const DeviceAbstractParser = require('./../device-abstract-parser');

class CarBrowser extends DeviceAbstractParser {
  constructor() {
    super();
    this.collection = require('../../regexes/device/car_browsers');
  }
}

module.exports = CarBrowser;

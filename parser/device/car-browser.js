const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

function CarBrowser() {
  CarBrowser.super_.call(this);
  this.fixtureFile = 'device/car_browsers.yml';
  this.loadCollection();
}

util.inherits(CarBrowser, DeviceAbstractParser);


module.exports = CarBrowser;
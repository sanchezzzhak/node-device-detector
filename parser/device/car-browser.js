const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

const DEVICE_TYPE = require('./../const/device-type');

function CarBrowser() {
  CarBrowser.super_.call(this);
  this.fixtureFile = 'device/car_browsers.yml';
  this.loadCollection();
}

util.inherits(CarBrowser, DeviceAbstractParser);


module.exports = CarBrowser;
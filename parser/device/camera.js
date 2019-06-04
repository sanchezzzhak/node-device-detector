const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

const DEVICE_TYPE = require('./../const/device-type');

function Camera() {
  Camera.super_.call(this);
  this.fixtureFile = 'device/cameras.yml';
  this.loadCollection();
}

util.inherits(Camera, DeviceAbstractParser);

module.exports = Camera;
const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

const DEVICE_TYPE = require('./../const/device-type');

function PortableMediaPlayer() {
  this.fixtureFile = 'device/portable_media_player.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(PortableMediaPlayer, DeviceAbstractParser);


module.exports = PortableMediaPlayer;
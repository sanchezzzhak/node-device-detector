const DeviceAbstractParser = require('./../device-abstract-parser');
const util = require('util');

const DEVICE_TYPE = require('./../const/device-type');

function PortableMediaPlayer() {
  PortableMediaPlayer.super_.call(this);
  this.fixtureFile = 'device/portable_media_player.yml';
  this.loadCollection();
}

util.inherits(PortableMediaPlayer, DeviceAbstractParser);


module.exports = PortableMediaPlayer;
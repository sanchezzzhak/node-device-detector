const DeviceAbstractParser = require('./../device-abstract-parser');

class PortableMediaPlayer extends DeviceAbstractParser {
  constructor() {
    super();
    this.collection = require('../../regexes/device/portable_media_player');
  }
}

module.exports = PortableMediaPlayer;

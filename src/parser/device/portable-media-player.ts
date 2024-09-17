import DeviceParserAbstract from '../device-abstract-parser';

export default class PortableMediaPlayerParser extends DeviceParserAbstract {
  constructor() {
    super();
    this.fixtureFile = 'device/portable_media_player.yml';
    this.loadCollection();
  }
}


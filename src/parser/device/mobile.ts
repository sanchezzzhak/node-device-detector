import DeviceParserAbstract from '../device-abstract-parser';

export default class MobileParser extends DeviceParserAbstract {
  constructor() {
    super();
    this.fixtureFile = 'device/mobiles.yml';
    this.loadCollection();
  }
}


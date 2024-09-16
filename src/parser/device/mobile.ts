import { DeviceParserAbstract } from '../device-abstract-parser';

export class MobileParser extends DeviceParserAbstract {
  constructor() {
    super();
    this.fixtureFile = 'device/mobiles.yml';
    this.loadCollection();
  }
}


import { DeviceParserAbstract } from '../device-abstract-parser';

export class CarParser extends DeviceParserAbstract {
  constructor() {
    super();
    this.fixtureFile = 'device/car_browsers.yml';
    this.loadCollection();
  }
}

import DeviceParserAbstract from '../device-abstract-parser';

export default class CarParser extends DeviceParserAbstract {
  constructor() {
    super();
    this.fixtureFile = 'device/car_browsers.yml';
    this.loadCollection();
  }
}

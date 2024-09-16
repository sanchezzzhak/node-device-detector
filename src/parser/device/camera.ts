import {DeviceParserAbstract} from '../device-abstract-parser';

export class CameraParser extends DeviceParserAbstract {
  constructor() {
    super();
    this.fixtureFile = 'device/cameras.yml';
    this.loadCollection();
  }
}
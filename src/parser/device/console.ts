import DeviceParserAbstract from '../device-abstract-parser';


export default class ConsoleParser extends DeviceParserAbstract {
  constructor() {
    super();
    this.fixtureFile = 'device/consoles.yml';
    this.type = ''
    this.loadCollection();
  }
}

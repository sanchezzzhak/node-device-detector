
import DEVICE_TYPE from './../const/device-type';
import { DeviceParserAbstract } from '../device-abstract-parser';

export class ShellTvParser extends DeviceParserAbstract {

  constructor() {
    super();
    this.fixtureFile = 'device/shell_tv.yml';
    this.loadCollection();
  }
  
  /**
   * @param {string} userAgent
   * @returns {null|{model: string, id: string, type: string, brand: string}}
   */
  parse(userAgent: string) {
    if (!this.isShellTv(userAgent)) {
      return null;
    }

    const result = {
      id: '',
      type: DEVICE_TYPE.TV,
      brand: '',
      model: '',
    };

    const resultParse = super.parse(userAgent);
    if (resultParse) {
      result.id = resultParse.id;
      result.brand = resultParse.brand;
      result.model = resultParse.model;
    }
    return result;
  }
  
  /**
   * has checked userAgent fragment is shell tv
   * @param {String} userAgent
   * @return {Boolean}
   */
  isShellTv(userAgent: string) {
    const regex = '[a-z]+[ _]Shell[ _]\\w{6}|tclwebkit\\d+[\\.\\d]*';
    const match = this.getBaseRegExp(regex).exec(userAgent);
    return match !== null;
  }
}

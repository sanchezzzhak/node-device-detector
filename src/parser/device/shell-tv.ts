
import DEVICE_TYPE from './../const/device-type';
import DeviceParserAbstract from '../device-abstract-parser';
import { ResultDevice } from '../../types';
import { JSONObject } from '../../client-hints';

export default class ShellTvParser extends DeviceParserAbstract {

  constructor() {
    super();
    this.fixtureFile = 'device/shell_tv.yml';
    this.loadCollection();
  }
  
  /**
   * @param {string} userAgent
   * @returns {ResultDevice|JSONObject|null}
   */
  parse(userAgent: string): ResultDevice | JSONObject | null {
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
   * @param {string} userAgent
   * @return {boolean}
   */
  isShellTv(userAgent: string): boolean {
    const regex = '[a-z]+[ _]Shell[ _]\\w{6}|tclwebkit\\d+[\\.\\d]*';
    const match = this.getBaseRegExp(regex).exec(userAgent);
    return match !== null;
  }
}

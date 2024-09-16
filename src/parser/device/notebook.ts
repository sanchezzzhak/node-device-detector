import { DeviceParserAbstract } from '../device-abstract-parser';

import DEVICE_TYPE from './../const/device-type';

export class NotebookParser extends DeviceParserAbstract {
  constructor() {
    super();
    this.fixtureFile = 'device/notebooks.yml';
    this.loadCollection();
  }

  /**
   * @param userAgent
   * @returns {null|{model: string, id: string, type: string, brand: string}}
   */
  parse(userAgent) {
    if (!this.isFBMD(userAgent)) {
      return null;
    }
    let resultParse = super.parse(userAgent);

    if (resultParse) {
      const result = {
        id: '',
        type: DEVICE_TYPE.DESKTOP,
        brand: '',
        model: '',
      };
      result.id = resultParse.id;
      result.brand = resultParse.brand;
      result.model = resultParse.model;
      return result;
    }

    return null;
  }

  /**
   * has check userAgent fragment is FBMD
   * @param {String} userAgent
   * @return {Boolean}
   */
  isFBMD(userAgent) {
    const regex = 'FBMD/';
    const match = this.getBaseRegExp(regex).exec(userAgent);
    return match !== null;
  }
}

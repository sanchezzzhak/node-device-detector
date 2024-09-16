import { ResultDevice } from '../../index';
import { DeviceParserAbstract } from '../device-abstract-parser';
import DEVICE_TYPE from './../const/device-type';

export class HbbTvParser extends DeviceParserAbstract {
  /**
   *
   */
  constructor() {
    super();
    this.fixtureFile = 'device/televisions.yml';
    this.loadCollection();
  }

  /**
   *
   * @param {string} userAgent
   * @param {string[]} brandIndexes
   * @returns {ResultDevice|null}
   */
  parse(userAgent: string, brandIndexes): ResultDevice|null {
    if (!this.isHubTv(userAgent)) {
      return null;
    }

    const result = {
      id: '',
      type: DEVICE_TYPE.TV,
      brand: '',
      model: '',
    };

    const resultParse = super.parse(userAgent, brandIndexes)
    if (resultParse) {
      result.id = resultParse.id;
      result.brand = resultParse.brand;
      result.model = resultParse.model;
    }
    return result;
  }

  /**
   * has check userAgent fragment is hub tv
   * @param {String} userAgent
   * @return {Boolean}
   */
  isHubTv(userAgent) {
    const regex = 'HbbTV/([1-9]{1}(?:.[0-9]{1}){1,2})';
    const match = this.getBaseRegExp(regex).exec(userAgent);
    return match !== null;
  }
}


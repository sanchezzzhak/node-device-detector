import { ResultDevice } from '../../types';
import DeviceParserAbstract from '../device-abstract-parser';
import DEVICE_TYPE from './../const/device-type';
import { JSONObject } from '../../client-hints';

export default class HbbTvParser extends DeviceParserAbstract {
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
  parse(userAgent: string, brandIndexes): ResultDevice | JSONObject | null {
    if (!this.isHubTv(userAgent)) {
      return null;
    }

    const result = {
      id: '',
      type: DEVICE_TYPE.TV,
      brand: '',
      model: ''
    };

    const resultParse = super.parse(userAgent, brandIndexes);
    if (resultParse) {
      result.id = resultParse.id;
      result.brand = resultParse.brand;
      result.model = resultParse.model;
    }
    return result;
  }

  /**
   * has checked userAgent fragment is hub tv
   * @param {string} userAgent
   * @return {boolean}
   */
  isHubTv(userAgent: string): boolean {
    const regex = 'HbbTV/([1-9]{1}(?:.[0-9]{1}){1,2})';
    const match = this.getBaseRegExp(regex).exec(userAgent);
    return match !== null;
  }
}


const DeviceAbstractParser = require('./../device-abstract-parser');

const DEVICE_TYPE = require('./../const/device-type');

class HbbTv extends DeviceAbstractParser {
  /**
   *
   */
  constructor() {
    super();
    this.collection = require('../../regexes/device/televisions');
  }

  /**
   * @param {string} userAgent
   * @param brandIndexes
   * @returns {null|{model: string, id: string, type: string, brand: string}}
   */
  parse(userAgent, brandIndexes) {
    // only parse user agents containing fragments: hbbtv or SmartTvA
    if (!this.isHubTv(userAgent)) {
      return null;
    }

    let result = {
      id: '',
      type: DEVICE_TYPE.TV,
      brand: '',
      model: '',
    };

    let resultParse = super.parse(userAgent, brandIndexes)
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
    let regex = '(?:HbbTV|SmartTvA)/([1-9]{1}(?:[.][0-9]{1}){1,2})';
    let match = this.getBaseRegExp(regex).exec(userAgent);
    return match !== null;
  }
}

module.exports = HbbTv;

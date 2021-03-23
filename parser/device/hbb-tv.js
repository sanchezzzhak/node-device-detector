const DeviceAbstractParser = require('./../device-abstract-parser');

const DEVICE_TYPE = require('./../const/device-type');

class HbbTv extends DeviceAbstractParser {
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
   * @returns {null|{model: string, id: string, type: string, brand: string}}
   */
  parse(userAgent) {
    if (!this.isHubTv(userAgent)) {
      return null;
    }

    let result = {
      id: '',
      type: DEVICE_TYPE.TV,
      brand: '',
      model: '',
    };

    let resultParse = DeviceAbstractParser.prototype.parse.call(this, [
      userAgent,
    ]);
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
    let regex = 'HbbTV/([1-9]{1}(?:.[0-9]{1}){1,2})';
    let match = this.getBaseRegExp(regex).exec(userAgent);
    return match !== null;
  }
}

module.exports = HbbTv;

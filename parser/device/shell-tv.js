const DeviceAbstractParser = require('./../device-abstract-parser');

const DEVICE_TYPE = require('./../const/device-type');

class ShellTv extends DeviceAbstractParser {
  /**
   *
   */
  constructor() {
    super();
    this.collection = require('../../regexes/device/shell_tv');
  }
  
  /**
   * @param {string} userAgent
   * @returns {null|{model: string, id: string, type: string, brand: string}}
   */
  parse(userAgent) {
    if (!this.isShellTv(userAgent)) {
      return null;
    }
    
    let result = {
      id: '',
      type: DEVICE_TYPE.TV,
      brand: '',
      model: '',
    };
    
    let resultParse = super.parse(userAgent);
    if (resultParse) {
      result.id = resultParse.id;
      result.brand = resultParse.brand;
      result.model = resultParse.model;
    }
    return result;
  }
  
  /**
   * has check userAgent fragment is shell tv
   * @param {String} userAgent
   * @return {Boolean}
   */
  isShellTv(userAgent) {
    const regex = '[a-z]+[ _]Shell[ _]\\w{6}|tclwebkit(\\d+[.\\d]*)';
    const match = this.getBaseRegExp(regex).exec(userAgent);
    return match !== null;
  }
}

module.exports = ShellTv;

const DeviceAbstractParser = require('./../device-abstract-parser');

class AliasDevice extends DeviceAbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'device/alias-device.yml';
    this.__brandReplaceRegexp = '';
    this.loadCollection();
  }

  /**
   * @param {string} userAgent
   * @returns {{name: string}}
   */
  parse(userAgent) {
    let result = {
      name: '',
    };
    for (let cursor in this.collection) {
      let item = this.collection[cursor];
      let match = this.getBaseRegExp(item['regex']).exec(
        decodeURIComponent(userAgent)
      );
      if (match) {
        result.name = this.buildByMatch(item['name'], match)
          .replace(new RegExp(this.getBrandReplaceRegexp(), 'isg'), '')
          .trim();

        break;
      }
    }
    return result;
  }

  getBrandReplaceRegexp() {
    if (!this.__brandReplaceRegexp) {
      let escapeeChars = [/\+/gi, /\./gi];
      let replaceChars = ['\\+', '\\.'];
      let customBrands = ['HUAWEI HUAWEI'];
      let brands = customBrands
        .concat(Object.keys(this.getCollectionBrands()))
        .join('|');
      for (let i = 0, l = escapeeChars.length; i < l; i++) {
        brands = brands.replace(escapeeChars[i], replaceChars[i]);
      }
      this.__brandReplaceRegexp =
        '(?:^|[^A-Z0-9-_]|[^A-Z0-9-]_|sprd-)(' + brands + ')[ _]';
    }
    return this.__brandReplaceRegexp;
  }
}

module.exports = AliasDevice;

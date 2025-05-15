const AbstractParser = require('./../abstract-parser');
const helper = require('./../helper');

const COLLECTION_BRAND_LIST = helper.revertObject(require('./brand-short'));

const createReplaceBrandRegexp = () => {
  let escapeeChars = [/\+/gi, /\./gi];
  let replaceChars = ['\\+', '\\.'];
  let customBrands = ['HUAWEI HUAWEI', 'viv-vivo'];
  let brands = customBrands.concat(Object.keys(COLLECTION_BRAND_LIST)).
  join('|');
  for (let i = 0, l = escapeeChars.length; i < l; i++) {
    brands = brands.replace(escapeeChars[i], replaceChars[i]);
  }
  return new RegExp(
      '(?:^|[^A-Z0-9-_]|[^A-Z0-9-]_|sprd-)(' + brands + ')[ _]',
      'isg',
  );
};

const normalizationUserAgent = (userAgent) => {
  let rawUA = String(userAgent)
  if (
      /;ip(?:ad|hone): build\//i.test(rawUA) &&
      /android /i.test(rawUA)
  ) {
    rawUA = rawUA.replace(/;ip(?:ad|hone):/i, '')
  }
  return rawUA
}

const REPLACE_BRAND_REGEXP = createReplaceBrandRegexp();

class AliasDevice extends AbstractParser {
  #replaceBrand = true;
  constructor() {
    super();
    this.collection = require('../../regexes/device/alias-device');
  }

  /**
   * @return {boolean}
   */
  hasReplaceBrand() {
    return Boolean(this.#replaceBrand);
  }

  /**
   * @param {boolean} replace
   */
  setReplaceBrand(replace) {
    this.#replaceBrand = replace;
  }

  getBaseRegExp(str) {
    str = str.replace(new RegExp('/', 'g'), '\\/');
    str = str.replace(new RegExp('\\+\\+', 'g'), '+');
    str = '(?:' + str + ')';
    return new RegExp(str, 'i');
  }

  /**
   * @param {string} userAgent
   * @returns {{name: string}}
   */
  parse(userAgent) {
    const result = {
      name: '',
    };

    if (helper.hasDesktopFragment(userAgent)) {
      return result;
    }

    userAgent = normalizationUserAgent(this.prepareUserAgent(userAgent));

    const isDecodeUA = /%[2-4][0-6A-F]/i.test(userAgent);
    let decodeUserAgent = '';
    try {
      decodeUserAgent = isDecodeUA ? decodeURIComponent(userAgent) : userAgent;
    } catch (err) {}

    for (let cursor in this.collection) {
      const item = this.collection[cursor];
      const match = this.getBaseRegExp(item['regex']).exec(decodeUserAgent);
      if (match) {
        const name = this.buildByMatch(item['name'], match);
        if (name) {
          result.name = name;
        }
        if (this.hasReplaceBrand()) {
          result.name = result.name.replace(REPLACE_BRAND_REGEXP, '');
        }
        break;
      }
    }
    if (result.name) {
      result.name = result.name.trim();
    }
    return result;
  }

}

module.exports = AliasDevice;

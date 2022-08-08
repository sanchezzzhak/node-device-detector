const ParserAbstract = require('./abstract-parser');

const helper = require('./helper');

const COLLECTION_BRAND_LIST = helper.revertObject(
  require('./device/brand-short')
);

const DESKTOP_PATTERN = '(?:Windows (?:NT|IoT)|X11; Linux x86_64)';
const DESKTOP_EXCLUDE_PATTERN = ' Mozilla/|Andr[o0]id|Tablet|Mobile|iPhone|Windows Phone|OculusBrowser|ricoh|Lenovo|compatible; MSIE|Trident/|Tesla/|XBOX|FBMD/|ARM; ?([^)]+)';

class DeviceParserAbstract extends ParserAbstract {
  constructor() {
    super();
    this.resultModelRegex = false; // used in tests
  }

  getAvailableBrands() {
    return Object.keys(this.getCollectionBrands());
  }

  getCollectionBrands() {
    return COLLECTION_BRAND_LIST;
  }

  /**
   * @param {string} userAgent
   * @param {array} brandIndexes
   * @returns {[]}
   */
  parseAll(userAgent, brandIndexes = []) {
    return this.__parse(userAgent, false, brandIndexes);
  }

  /**
   * iteration item parse, see __parse
   * @param {string} cursor
   * @param {string} userAgent
   * @returns {{model: *, id: *, type, brand}|null}
   * @private
   */
  __parseForBrand(cursor, userAgent) {
    let item = this.collection[cursor];
    if (item === void 0) {
      return null;
    }
    
    let model = '';
    let deviceType = '';
    let brandName = '';
    let regex = item['regex'];
    
    let match = this.getBaseRegExp(regex).exec(userAgent);

    if (match) {
      brandName = String(cursor).trim();
      if (brandName === 'Unknown') {
        brandName = '';
      }
      if (item['device'] !== void 0) {
        deviceType = item['device'];
      }
      if (item['models'] !== void 0) {
        let models = item['models'];
        for (let i = 0, l = models.length; i < l; i++) {
          let data = models[i];
          regex = data.regex;
          let modelMatch = this.getBaseRegExp(regex).exec(userAgent);
          if (modelMatch) {
            model = this.buildModel(data.model, modelMatch);
            if (data.device !== void 0) {
              deviceType = data.device;
            }
            if (data.brand !== void 0) {
              brandName = data.brand;
            }
            break;
          }
        }
      } else if (item['model'] !== void 0) {
        model = this.buildModel(item['model'], match);
      }
      let brandId = this.getBrandIdByName(brandName);
      let result = {
        id: brandId !== void 0 ? brandId : '',
        brand: brandName,
        model: model ? String(model).trim() : '',
        type: deviceType,
      };
      if (this.resultModelRegex) {
        result.regex = regex;
      }
      return result;
    }

    return null;
  }

  /**
   * iterations parse for collection
   * @param {string} userAgent
   * @param {boolean} canBreak
   * @param {array} brandIndexes
   * @returns {[]}
   * @private
   */
  __parse(userAgent, canBreak = true, brandIndexes = []) {
  
    let isDesktop =
      helper.matchUserAgent(DESKTOP_PATTERN, userAgent) &&
      !helper.matchUserAgent(DESKTOP_EXCLUDE_PATTERN, userAgent);
    
    if (isDesktop) {
      return [];
    }
    
    let output = [];
    if (brandIndexes.length) {
      for (let cursor of brandIndexes) {
        let result = this.__parseForBrand(cursor, userAgent);
        if (result === null) {
          continue;
        }
        output.push(result);
        if (canBreak) break;
      }
    }

    if (!output.length) {
      for (let cursor in this.collection) {
        let result = this.__parseForBrand(cursor, userAgent);
        if (result === null) {
          continue;
        }
        output.push(result);
        if (canBreak) break;
      }
    }

    return output;
  }

  /**
   * Result brand and model
   * @param {string} userAgent    - useragent string
   * @param {array} brandIndexes  - check the devices in this list
   * @returns {{model: (string|string), id: (*|string), type: string, brand: string}|null}
   */
  parse(userAgent, brandIndexes = []) {
    
    let result = this.__parse(userAgent, true, brandIndexes);
    if (result.length) {
      return result[0];
    }
    return null;
  }

  /**
   * get brand short id by name
   * @param {string} brandName
   * @returns {string|void}
   */
  getBrandIdByName(brandName) {
    return COLLECTION_BRAND_LIST[brandName];
  }
}

module.exports = DeviceParserAbstract;

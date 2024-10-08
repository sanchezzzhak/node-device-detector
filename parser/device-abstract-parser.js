const ParserAbstract = require('./abstract-parser');

const helper = require('./helper');

const COLLECTION_BRAND_IDS =  require('./device/brand-short');
const COLLECTION_BRAND_LIST = helper.revertObject(COLLECTION_BRAND_IDS);

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
   * @param {string[]} brandIndexes
   * @returns {[]}
   */
  parseAll(userAgent, brandIndexes = []) {
    return this.#parse(userAgent, false, brandIndexes);
  }

  /**
   * iteration item parse, see __parse
   * @param {string} cursor
   * @param {string} userAgent
   * @return {{model: *, id: *, type, brand}|null}
   * @private
   */
  #parseForBrand(cursor, userAgent) {
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
   * @param {string[]} brandIndexes
   * @return {[]}
   * @private
   */
  #parse(userAgent, canBreak = true, brandIndexes = []) {

    const output = [];
    if (brandIndexes.length) {
      for (let cursorId of brandIndexes) {
        const cursor = this.getBrandNameById(cursorId);
        const result = this.#parseForBrand(cursor, userAgent);
        if (result === null) {
          continue;
        }
        output.push(result);
        if (canBreak) break;
      }
    }

    if (!output.length) {
      for (let cursor in this.collection) {
        const result = this.#parseForBrand(cursor, userAgent);
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
   * @return {{model: (string|string), id: (*|string), type: string, brand: string}|null}
   */
  parse(userAgent, brandIndexes = []) {
    userAgent = this.prepareUserAgent(userAgent);
    let result = this.#parse(userAgent, true, brandIndexes);
    if (result.length) {
      // if it is fake device iphone/ipad then result empty
      if (result[0].brand === 'Apple' && /android /i.test(userAgent)) {
        return {
          id: '',
          brand: '',
          model: '',
          type: '',
        };
      }

      return result[0];
    }
    return null;
  }

  /**
   * get brand short id by name
   * @param {string} brandName
   * @return {string|void}
   */
  getBrandIdByName(brandName) {
    return COLLECTION_BRAND_LIST[brandName];
  }

  /**
   * get brand name by short id
   * @param {string} id
   * @return {string|void}
   */
  getBrandNameById(id) {
    return COLLECTION_BRAND_IDS[id];
  }
}

module.exports = DeviceParserAbstract;

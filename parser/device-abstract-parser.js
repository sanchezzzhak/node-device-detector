const ParserAbstract = require('./abstract-parser');

const COLLECTION_BRAND_LIST = Object.assign(
  {},
  ...Object.entries(require('./device/brand-short')).map(([a, b]) => ({
    [b]: a,
  })),
  {}
);

class DeviceParserAbstract extends ParserAbstract {
  constructor() {
    super();
    this.resultModelRegex = false; // used in tests
  }

  getCollectionBrands() {
    return COLLECTION_BRAND_LIST;
  }

  /**
   * @param {string} userAgent
   * @returns {{model: (string|string), id: (*|string), type: string, brand: string}|null}
   */
  parse(userAgent) {
    let model = '';
    let deviceType = '';
    let brandName = '';

    for (let cursor in this.collection) {
      let item = this.collection[cursor];
      let regex = item['regex'];
      let match = this.getBaseRegExp(regex).exec(userAgent);

      if (match) {
        brandName = String(cursor).trim();
        if (brandName === 'Unknown') {
          brandName = '';
        }
        if (item['device'] !== undefined) {
          deviceType = item['device'];
        }

        if (item['models'] !== undefined) {
          let models = item['models'];
          for (let i = 0, l = models.length; i < l; i++) {
            let data = models[i];
            regex = data.regex;
            let modelMatch = this.getBaseRegExp(regex).exec(userAgent);
            if (modelMatch) {
              model = this.buildModel(data.model, modelMatch);
              if (data.device !== undefined) {
                deviceType = data.device;
              }
              if (data.brand !== undefined) {
                brandName = data.brand;
              }
              break;
            }
          }
        } else if (item['model'] !== undefined) {
          model = this.buildModel(item['model'], match);
        }

        let brandId = COLLECTION_BRAND_LIST[brandName];
        let result = {
          id: brandId !== undefined ? brandId : '',
          brand: brandName,
          model: model !== null ? String(model).trim() : '',
          type: deviceType,
        };

        if (this.resultModelRegex) {
          result.regex = regex;
        }

        return result;
      }
    }
    return null;
  }
}

module.exports = DeviceParserAbstract;

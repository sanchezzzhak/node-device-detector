const ParserAbstract = require('./abstract-parser');
const AliasDevice = require('./device/alias-device');
const helper = require('./helper');

const aliasDevice = new AliasDevice();
aliasDevice.setReplaceBrand(false);

const DEVICE_INDEX_HASH = helper.loadYMLFile(
  __dirname + '/../regexes/device-index-hash.yml'
);
const COLLECTION_BRAND_LIST = helper.revertObject(
  require('./device/brand-short')
);

class DeviceParserAbstract extends ParserAbstract {
  constructor() {
    super();
    this.resultModelRegex = false; // used in tests
  }
  
  getAvailableBrands(){
    return Object.keys(this.getCollectionBrands())
  }
  
  getCollectionBrands() {
    return COLLECTION_BRAND_LIST;
  }
  
  /**
   * Result all brands and models
   * @param userAgent
   * @returns {[]}
   */
  parseAllMatch(userAgent) {
    return this.__parse(userAgent, false)
  }
  
  /**
   * iteration item parse, see __parse
   * @param {string} cursor
   * @param {string} userAgent
   * @returns {{model: *, id: *, type, brand}|null}
   * @private
   */
  __parseByCursor(cursor, userAgent ){
    let model = '';
    let deviceType = '';
    let brandName = '';
    let item = this.collection[cursor];
    if (item === void 0) {
      return null;
    }
    
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
      let brandId = this.getBrandIdByName(brandName)
      let result = {
        id: brandId !== void 0 ? brandId : '',
        brand: brandName,
        model: model !== null ? String(model).trim() : '',
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
   * @param userAgent
   * @param canBreak
   * @returns {[]}
   * @private
   */
  __parse(userAgent, canBreak = true) {
    let output = [];
    
    let deviceCode = aliasDevice.parse(userAgent);
    if(deviceCode.name) {
      let hashBrands = DEVICE_INDEX_HASH[deviceCode.name];
      if(hashBrands !== void 0) {
        hashBrands.forEach(cursor => {
          let result = this.__parseByCursor(cursor, userAgent)
          if(result !== null) {
            output.push(result);
          }
        })
      }
    }
    
    if(!output.length){
      for (let cursor in this.collection) {
        let result = this.__parseByCursor(cursor, userAgent)
        if(result !== null) {
          output.push(result);
          if(canBreak) {
            break;
          }
        }
      }
    }
    
    return output;
  }
  
  /**
   * Result brand and model
   * @param {string} userAgent
   * @returns {{model: (string|string), id: (*|string), type: string, brand: string}|null}
   */
  parse(userAgent) {
    let result = this.__parse(userAgent);
    return result.length ? result[0]: null;
  }
  
  getBrandIdByName(brandName) {
    return COLLECTION_BRAND_LIST[brandName];
  }
}

module.exports = DeviceParserAbstract;

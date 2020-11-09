const ParserAbstract = require('./abstract-parser');

const COLLECTION_BRAND_LIST = Object.assign({},
    ...Object.entries(require('./device/brand-short')).map(([a, b]) => ({[b]: a})), {});

class VendorFragmentAbstractParser extends ParserAbstract {
  constructor() {
    super();
    this.fixtureFile = 'vendorfragments.yml';
    this.loadCollection();
  }

  /**
   *
   * @param userAgent
   * @returns {null|{name: string, id: (*|string)}}
   */
  parse(userAgent) {

    for (let key in this.collection) {
      let collection = this.collection[key];
      for (let i = 0, l = collection.length; i < l; i++) {
        let item = collection[i];
        let regex = this.getBaseRegExp(item);
        let match = regex.exec(userAgent);
        if (match !== null) {
          let brandId = COLLECTION_BRAND_LIST[key];
          return {
            name: key,
            id: brandId !== undefined ? brandId : ''
          };
        }
      }
    }

    return null;
  }
}


module.exports = VendorFragmentAbstractParser;

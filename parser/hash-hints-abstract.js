const ParserAbstract = require('./abstract-parser');
const DataPacker = require('../lib/data-packer');

const SHORT_KEYS = {
  NM: 'name',              // name app
  CT: 'category_id',       // category id
  TP: 'type',              // type app
  ST: 'is_store',          // is store playmarket
  BD: 'is_bad',            // is bad app
};

class HashHintsAbstract extends ParserAbstract {
  constructor() {
    super();
    // load category properties
    this.collectionCategories = this.loadYMLFile(
        'hints/categories.yml'
    );
  }

  parse(clientHints) {
    let appId = clientHints.app;

    if (!appId) {
      return null;
    }

    if (this.collection[appId] === void 0) {
      return null;
    }

    // get normalise data
    let data = this.collection[appId];
    let result = DataPacker.unpack(data, SHORT_KEYS);
    this.prepareResultCategory(result);

    return result;
  }

  prepareResultCategory(result) {
    let categoryId = Number(result.category_id);
    delete result.category_id;
    result.category = '';
    if (this.collectionCategories[categoryId]) {
      result.category = String(this.collectionCategories[categoryId]);
    }
  }

}


module.exports = HashHintsAbstract;
const ParserAbstract = require('./abstract-parser');
const DataPacker = require('../lib/data-packer');


class HashHintsAbstract extends ParserAbstract {
  constructor() {
    super();
  }

  parse(clientHints) {
    let appId = clientHints.app;

    if (!appId) {
      return null;
    }

    if (this.collection[appId] === void 0) {
      return null;
    }

    let name = this.collection[appId];
    return {
      name: String(name)
    };
  }

}


module.exports = HashHintsAbstract;
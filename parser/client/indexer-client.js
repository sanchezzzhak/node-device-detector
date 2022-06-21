const helper = require("../helper");

let collection;
let path = __dirname + '/../../regexes/client-index-hash.yml';

class IndexerClient
{
  static findClientRegexPositionsForUserAgent(userAgent) {
    if(!IndexerClient.ready()) {
      return null;
    }
    let data = helper.splitUserAgent(userAgent);
    let positions = collection[data.hash]

    if (positions !== void 0) {
      return positions;
    }

    return null;
  }

  static ready() {
    return collection !== void 0;
  }

  static load() {
    if (helper.hasFile(path)) {
      collection = helper.loadYMLFile(path);
    }
  }

}

module.exports = IndexerClient;
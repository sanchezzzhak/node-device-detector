const helper = require('../helper');
const CLIENT_TYPES = require('../const/client-type');
const collection = require('../../regexes/client-index-hash');

const CLIENT_TYPES_MAP = {}
CLIENT_TYPES_MAP[CLIENT_TYPES.BROWSER] = 0;
CLIENT_TYPES_MAP[CLIENT_TYPES.MOBILE_APP] = 1;
CLIENT_TYPES_MAP[CLIENT_TYPES.LIBRARY] = 2;
CLIENT_TYPES_MAP[CLIENT_TYPES.MEDIA_PLAYER] = 3;
CLIENT_TYPES_MAP[CLIENT_TYPES.FEED_READER] = 4;
CLIENT_TYPES_MAP[CLIENT_TYPES.PIM] = 5;


class IndexerClient {
  
  /**
   * @param {string} userAgent
   * @param {string} type
   * @returns {null|array}
   */
  static findClientRegexPositionsForUserAgent(userAgent, type) {
    let index = CLIENT_TYPES_MAP[type];
    if (index === void 0) {
      return null;
    }
    
    let data = helper.splitUserAgent(userAgent);
    let positions = collection[data.hash];
    
    if (positions !== void 0 && positions[index] !== void 0) {
      return positions[index];
    }
    
    return null;
  }
  
}

module.exports = IndexerClient;
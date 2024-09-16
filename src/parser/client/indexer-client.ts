import * as helper from '../helper';

import CLIENT_TYPES from '../const/client-type';

const CLIENT_TYPES_MAP = {}
CLIENT_TYPES_MAP[CLIENT_TYPES.BROWSER] = 0;
CLIENT_TYPES_MAP[CLIENT_TYPES.MOBILE_APP] = 1;
CLIENT_TYPES_MAP[CLIENT_TYPES.LIBRARY] = 2;
CLIENT_TYPES_MAP[CLIENT_TYPES.MEDIA_PLAYER] = 3;
CLIENT_TYPES_MAP[CLIENT_TYPES.FEED_READER] = 4;
CLIENT_TYPES_MAP[CLIENT_TYPES.PIM] = 5;

let collection;
const path = __dirname + '/../../regexes/client-index-hash.yml';

export class IndexerClient {
  
  /**
   * @param {string} userAgent
   * @param {string} type
   * @returns {null|array}
   */
  static findClientRegexPositionsForUserAgent(userAgent, type) {
    if (!IndexerClient.ready()) {
      return null;
    }
    
    const index = CLIENT_TYPES_MAP[type];
    if (index === void 0) {
      return null;
    }
    
    const data = helper.splitUserAgent(userAgent);
    const positions = collection[data.hash];
    
    if (positions !== void 0 && positions[index] !== void 0) {
      return positions[index];
    }
    
    return null;
  }
  
  static ready() {
    return collection !== void 0;
  }
  
  static init() {
    if (helper.hasFile(path)) {
      collection = helper.loadYMLFile(path);
    }
  }
  
}

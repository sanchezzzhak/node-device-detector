const helper = require('../helper');
const collection = require('../../regexes/os-index-hash');

class IndexerOs {
  
  /**
   * @param {string} userAgent
   * @returns {null|array}
   */
  static findOsRegexPositionsForUserAgent(userAgent) {
    const data = helper.splitOsUserAgent(userAgent);
    const positions = collection[data.hash];
    return positions !== void 0 ? positions: null;
  }
}

module.exports = IndexerOs;
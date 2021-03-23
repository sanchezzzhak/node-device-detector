const ParserAbstract = require('./abstract-parser');

class ClientAbstractParser extends ParserAbstract {
  constructor() {
    super();
  }

  /**
   * @param {string} userAgent
   * @returns {{name: (string|*), type: string, version: string}|null}
   */
  parse(userAgent) {
    for (let i = 0, l = this.collection.length; i < l; i++) {
      let item = this.collection[i];
      let regex = this.getBaseRegExp(item.regex);
      let match = regex.exec(userAgent);
      if (match !== null) {
        return {
          type: '',
          name: this.buildByMatch(item.name, match),
          version: this.buildVersion(item.version, match),
        };
      }
    }
    return null;
  }
}

module.exports = ClientAbstractParser;

const ParserAbstract = require('./abstract-parser');

class BotAbstractParser extends ParserAbstract {
  constructor() {
    super();
    this.collection = require('../regexes/bots');
  }

  /**
   * Returns an array of rules with precompiled RegExp
   *
   * @return {RegExp[]}
   */
  getCompiledRegexes() {
    if (!this._compiledRegexes) {
      this._compiledRegexes = this.collection.map((item) => this.getBaseRegExp(item.regex));
    }
    return this._compiledRegexes;
  }

  /**
   * Returns compiled combined RegExp for quick pre-check
   *
   * @returns {RegExp}
   */
  getPreMatchRegExp() {
    if (!this._preMatchRegExp) {
      const pattern = this.collection.map((item) => `(?:${item.regex})`).join('|');
      this._preMatchRegExp = this.getBaseRegExp(pattern);
    }
    return this._preMatchRegExp;
  }

  /**
   * Parse user agent is bot
   *
   * @param {string} userAgent
   * @param {*} clientHintData
   * @returns {{name: string, producer: {}, category: string, url: string}|null}
   */
  parse(userAgent, clientHintData) {
    if (!userAgent || !this.getPreMatchRegExp().test(userAgent)) {
      return null;
    }

    const compiledRegexes = this.getCompiledRegexes();
    for (let i = 0, l = this.collection.length; i < l; i++) {
      const item = this.collection[i];
      const match = compiledRegexes[i].exec(userAgent);

      if (match !== null) {
        const producer = item.producer ? { ...item.producer } : {};
        if (producer.name === null) {
          producer.name = '';
        }

        return {
          name: item.name ? this.buildByMatch(item.name, match) : '',
          category: item.category || '',
          url: item.url || '',
          producer: producer,
        };
      }
    }

    return null;
  }
}

module.exports = BotAbstractParser;

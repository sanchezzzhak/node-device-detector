const ClientAbstractParser = require('./../client-abstract-parser');

const CLIENT_TYPE = require('./../const/client-type');

class PIM extends ClientAbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'client/pim.yml';
    this.loadCollection();
  }

  /**
   *
   * @param userAgent
   * @returns {{name: (string|*), type: string, version: string} & {type: string}}
   */
  parse(userAgent) {
    let result = super.parse(userAgent);
    if (result) {
      result = Object.assign(result, {
        type: CLIENT_TYPE.PIM,
      });
      return result;
    }
  }
}

module.exports = PIM;

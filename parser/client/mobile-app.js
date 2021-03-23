const ClientAbstractParser = require('./../client-abstract-parser');

const CLIENT_TYPE = require('./../const/client-type');

class MobileApp extends ClientAbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'client/mobile_apps.yml';
    this.loadCollection();
  }

  /**
   *
   * @param userAgent
   * @returns {({name: (string|*), type: string, version: string} & {type: string})|null}
   */
  parse(userAgent) {
    let result = super.parse(userAgent);
    if (result) {
      result = Object.assign(result, {
        type: CLIENT_TYPE.MOBILE_APP,
      });
      return result;
    }
    return null;
  }
}

module.exports = MobileApp;

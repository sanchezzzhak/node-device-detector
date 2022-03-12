const ClientAbstractParser = require('./../client-abstract-parser');
const AppHashHints = require('./app-hash-hints');

const CLIENT_TYPE = require('./../const/client-type');

const appHashHints = new AppHashHints;

class MobileApp extends ClientAbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'client/mobile_apps.yml';
    this.loadCollection();
  }

  parseFromHashHintsApp(clientHints) {
    return appHashHints.parse(clientHints);
  }

  /**
   *
   * @param userAgent
   * @param clientHints
   * @returns {({name: string, type: string, version: string})|null}
   */
  parse(userAgent, clientHints){
    let hash  = this.parseFromHashHintsApp(clientHints);
    let result = super.parse(userAgent, clientHints);

    let name = '';
    let type =  CLIENT_TYPE.MOBILE_APP
    let version = '';

    if (result) {
      name = result.name;
      version = result.version;
    }

    if (hash && name !== hash.name) {
      name = hash.name;
      version = '';
    }

    if(name === '') {
      return null;
    }

    return {
      name: String(name),
      type: String(type),
      version: String(version)
    };
  }
}

module.exports = MobileApp;

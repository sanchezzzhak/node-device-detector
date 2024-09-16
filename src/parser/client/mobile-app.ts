import { ClientAbstractParser } from '../client-abstract-parser';

import CLIENT_TYPE from './../const/client-type';
import { AppHints } from './hints/app-hints';
import { ResultClientHints } from '../../client-hints';

const appHints = new AppHints();

export class MobileAppParser extends ClientAbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'client/mobile_apps.yml';
    this.loadCollection();
    this.collectionLength = this.collection.length;
    this.type = CLIENT_TYPE.MOBILE_APP;
  }
  
  parseFromHashHintsApp(clientHints) {
    return appHints.parse(clientHints);
  }
  
  parseFromClientHints(clientHints: ResultClientHints) {
    return {name: '', version: ''}
  }
  
  prepareParseResult(userAgent, data, hint, hash) {
    let name = '';
    let version = '';
    
    if (data) {
      name = data.name;
      version = data.version;
    }
    
    if (hash && name !== hash.name) {
      name = hash.name;
      version = '';
    }
    
    if (name === '') {
      return null;
    }
    
    return {
      name: String(name),
      type: String(CLIENT_TYPE.MOBILE_APP),
      version: String(version),
    };
  }

  /**
   * @param userAgent
   * @param clientHints
   * @returns {({name: string, type: string, version: string})|null}
   */
  parse(userAgent, clientHints) {
    const hash = this.parseFromHashHintsApp(clientHints);
    const hint = this.parseFromClientHints(clientHints);
    const data = super.parse(userAgent, clientHints);
    return this.prepareParseResult(userAgent, data, hint, hash);
  }
}

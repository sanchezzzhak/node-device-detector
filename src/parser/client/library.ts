import { ResultClientHints } from '../../client-hints';
import { ResultClient } from '../../index';
import { ClientAbstractParser } from '../client-abstract-parser';

import CLIENT_TYPE from './../const/client-type';

export class LibraryParser extends ClientAbstractParser {

  constructor() {
    super();
    this.fixtureFile = 'client/libraries.yml';
    this.loadCollection();
    this.collectionLength = this.collection.length;
    this.type = CLIENT_TYPE.LIBRARY;
  }

  /**
   *
   * @param {string} userAgent
   * @param {ResultClientHints} clientHintsData
   * @returns {ResultClient|null}
   */
  parse(userAgent: string, clientHintsData: ResultClientHints): ResultClient | null {
    let result = super.parse(userAgent, clientHintsData);
    if (result) {
      result = Object.assign(result, {
        type: CLIENT_TYPE.LIBRARY
      });
      return result;
    }
    return null;
  }
}


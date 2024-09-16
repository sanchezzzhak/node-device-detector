import CLIENT_TYPE from './../const/client-type';
import {ClientAbstractParser} from '../client-abstract-parser'
import { ResultClientHints } from '../../client-hints';
import { ResultClient } from '../../index';

export class PimParser extends ClientAbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'client/pim.yml';
    this.loadCollection();
    this.collectionLength = this.collection.length;
    this.type = CLIENT_TYPE.PIM;
  }

  /**
   *
   * @param {string} userAgent
   * @param {ResultClientHints} clientHintsData
   * @returns {ResultClient}
   */
  parse(userAgent: string, clientHintsData: ResultClientHints): ResultClient {
    let result = super.parse(userAgent, clientHintsData);
    if (result) {
      result = Object.assign(result, {
        type: CLIENT_TYPE.PIM,
      });
      return result;
    }
  }
}

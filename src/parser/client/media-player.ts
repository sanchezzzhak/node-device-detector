import ClientAbstractParser from '../client-abstract-parser';

import CLIENT_TYPE from './../const/client-type';
import { JSONObject, ResultClientHints } from '../../client-hints';
import { ResultClient } from '../../types';

export default class MediaPlayerParser extends ClientAbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'client/mediaplayers.yml';
    this.loadCollection();
    this.collectionLength = this.collection.length;
    this.type = CLIENT_TYPE.MEDIA_PLAYER;
  }

  /**
   * @param {string} userAgent
   * @param {ResultClientHints} clientHintsData
   * @returns {ResultClient|JSONObject|null}
   */
  parse(userAgent: string, clientHintsData: ResultClientHints): ResultClient | JSONObject | null {
    let result = super.parse(userAgent, clientHintsData);
    if (result) {
      result = Object.assign(result, {
        type: CLIENT_TYPE.MEDIA_PLAYER
      });
      return result;
    }
    return null;
  }
}


import CLIENT_TYPE from './../const/client-type';
import ClientAbstractParser from '../client-abstract-parser';
import { ResultClient } from '../../types';
import { JSONObject, ResultClientHints } from '../../client-hints';

export default class FeedReaderParser extends ClientAbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'client/feed_readers.yml';
    this.loadCollection();
    this.collectionLength = this.collection.length;
    this.type = CLIENT_TYPE.FEED_READER;
  }

  /**
   *
   * @param {string }userAgent
   * @param {ResultClientHints} clientHintsData
   * @returns {ResultClient|null}
   */
  parse(userAgent: string, clientHintsData: ResultClientHints): ResultClient | JSONObject | null {
    let result = super.parse(userAgent, clientHintsData);
    if (result) {
      result = Object.assign(result, {
        type: CLIENT_TYPE.FEED_READER
      });

      return result;
    }

    return null;
  }
}

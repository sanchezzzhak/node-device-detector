import { IndexerClient } from './client/indexer-client';

import { AbstractParser } from './abstract-parser';
import { JSONObject, ResultClientHints } from '../client-hints';
import { ResultClient } from '../index';

export class ClientAbstractParser extends AbstractParser {

  #clientIndexes = false;

  constructor() {
    super();
    this.collectionLength = 0;
    this.type = '';
    this.clientIndexes = true;
  }

  get clientIndexes(): boolean {
    return this.#clientIndexes;
  }

  set clientIndexes(stage: boolean) {
    this.#clientIndexes = stage;
  }

  /**
   * @param {string} userAgent
   * @param {ResultClientHints} clientHintData
   * @returns {ResultClient|null}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parse(userAgent: string, clientHintData: ResultClientHints|JSONObject): ResultClient | null {
    if (!userAgent) {
      return null;
    }
    userAgent = this.prepareUserAgent(userAgent);

    // scan indexes
    if (this.clientIndexes) {
      const result = this.parseUserAgentByPositions(userAgent);
      if (result !== null) {
        return result;
      }
    }

    // full scan
    for (let i = 0, l = this.collectionLength; i < l; i++) {
      const result = this.parseUserAgentByPosition(userAgent, i);
      if (result !== null) {
        return result;
      }
    }
    return null;
  }

  /**
   * @param {string} userAgent
   */
  parseUserAgentByPositions(userAgent: string): ResultClient | null {
    const positions = IndexerClient.findClientRegexPositionsForUserAgent(userAgent, String(this.type));
    if (positions !== null && positions.length) {
      for (let i = 0, l = positions.length; i < l; i++) {
        const result = this.parseUserAgentByPosition(userAgent, positions[i]);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }

  /**
   * Inline parse userAgent by position collection
   *
   * @param {String} userAgent
   * @param {Number} position
   * @returns {{ResultClient|null}
   */
  parseUserAgentByPosition(userAgent: string, position = 0): ResultClient | null {
    const item = this.collection[position];

    if (item === void 0) {
      return null;
    }

    const regex = this.getBaseRegExp(item.regex);
    const match = regex.exec(userAgent);

    if (match !== null) {
      return {
        type: String(this.type),
        name: this.buildByMatch(item.name, match),
        version: this.buildVersion(item.version, match)
      };
    }

    return null;
  }
}

module.exports = ClientAbstractParser;

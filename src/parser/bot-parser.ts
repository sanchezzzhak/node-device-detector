import AbstractParser from './abstract-parser';
import { ResultBot } from '../index';

export class BotParser extends AbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'bots.yml';
    this.loadCollection();
  }

  /**
   * parse user agent is bot
   * @param {string} userAgent
   * @returns {{name: string, producer: {}, category: string, url: string}|null}
   */
  parse(userAgent: string): ResultBot|null {
    for (let i = 0, l = this.collection.length; i < l; i++) {
      const item = this.collection[i];
      const regex = this.getBaseRegExp(item.regex);
      const match = regex.exec(userAgent);

      if (match !== null) {
        const producer = item.producer ? item.producer : {};
        if (producer.name === null) {
          producer.name = '';
        }

        return {
          name: item.name ? item.name : '',
          category: item.category ? item.category : '',
          url: item.url ? item.url : '',
          producer: producer
        };
      }
    }
    return null;
  }
}

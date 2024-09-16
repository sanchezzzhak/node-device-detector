import * as helper from './helper';

import BRAND_SHORTS from './device/brand-short';
import { ResultVendor } from '../index';
import { AbstractParser } from './abstract-parser';

const COLLECTION_BRAND_LIST = helper.revertObject(BRAND_SHORTS);

export class VendorFragmentParser extends AbstractParser {

  constructor() {
    super();
    this.fixtureFile = 'vendorfragments.yml';
    this.loadCollection();
  }

  /**
   * @param {string} userAgent
   * @returns {ResultVendor|null}
   */
  parse(userAgent: string): ResultVendor | null {
    for (const cursor in this.collection) {
      const name = String(cursor);
      const collection = this.collection[name];

      for (let i = 0, l = collection.length; i < l; i++) {
        const item = collection[i];
        const pattern = item + '[^a-z0-9]+';
        const regex = this.getBaseRegExp(pattern);
        const match = regex.exec(userAgent);
        if (match !== null) {
          const brandId = COLLECTION_BRAND_LIST[name];
          return {
            name: name,
            id: brandId !== void 0 ? brandId : ''
          };
        }
      }
    }
    return null;
  }
}

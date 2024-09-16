import {ResultAliasDevice } from '../../index';
import AbstractParser  from '../abstract-parser';


import * as helper from './../helper';
import BRAND_SHORTS from './brand-short';

const COLLECTION_BRAND_LIST = helper.revertObject(BRAND_SHORTS);

const createReplaceBrandRegexp = () => {
  const escapeeChars = [/\+/gi, /\./gi];
  const replaceChars = ['\\+', '\\.'];
  const customBrands = ['HUAWEI HUAWEI', 'viv-vivo'];
  let brands = customBrands.concat(Object.keys(COLLECTION_BRAND_LIST)).
  join('|');
  for (let i = 0, l = escapeeChars.length; i < l; i++) {
    brands = brands.replace(escapeeChars[i], replaceChars[i]);
  }
  return new RegExp(
      '(?:^|[^A-Z0-9-_]|[^A-Z0-9-]_|sprd-)(' + brands + ')[ _]',
      'isg',
  );
};

const normalizationUserAgent = (userAgent) => {
  let rawUA = String(userAgent)
  if (
      /;ip(?:ad|hone): build\//i.test(rawUA) &&
      /android /i.test(rawUA)
  ) {
    rawUA = rawUA.replace(/;ip(?:ad|hone):/i, '')
  }
  return rawUA
}

const REPLACE_BRAND_REGEXP = createReplaceBrandRegexp();

export class AliasDevice extends AbstractParser {

  #replaceBrand = true

  constructor() {
    super();
    this.fixtureFile = 'device/alias-device.yml';
    this.loadCollection();
  }

  hasReplaceBrand() {
    return Boolean(this.#replaceBrand);
  }

  setReplaceBrand(stage: boolean) {
    this.#replaceBrand = stage;
  }

  getBaseRegExp(str) {
    str = str.replace(new RegExp('/', 'g'), '\\/');
    str = str.replace(new RegExp('\\+\\+', 'g'), '+');
    str = '(?:' + str + ')';
    return new RegExp(str, 'i');
  }

  /**
   * @param {string} userAgent
   * @returns {{name: string}}
   */
  parse(userAgent:string): ResultAliasDevice {
    userAgent = this.prepareUserAgent(userAgent);
    userAgent = normalizationUserAgent(userAgent);
    const result = {
      name: '',
    };
    let decodeUserAgent = '';
    const isDecodeUA = /%[2-4][0-6A-F]/i.test(userAgent);
    try {
      decodeUserAgent = isDecodeUA ? decodeURIComponent(userAgent) : userAgent;
    } catch (err) { /* empty */ }

    for (const cursor in this.collection) {
      const item = this.collection[cursor];
      const match = this.getBaseRegExp(item['regex']).exec(decodeUserAgent);
      if (match) {
        result.name = this.buildByMatch(item['name'], match);
        if (this.hasReplaceBrand()) {
          result.name = result.name.replace(REPLACE_BRAND_REGEXP, '');
        }
        break;
      }
    }
    result.name = result.name.trim();
    return result;
  }
}


import {ArrayPath} from './array-path';
import { JSONObject } from './client-hints';

export class DataPacker {
  /**
   * pack objects to str
   * format: shortcode=value;
   * @param obj
   * @param shortKeys
   * @returns {string}
   */
  static pack(obj: JSONObject, shortKeys: JSONObject) {
    const data = [];
    for (const key in shortKeys) {
      const value = ArrayPath.get(obj, <string>shortKeys[key]);
      data.push(`${key}=${value};`);
    }
    return data.join('');
  }
  
  /**
   * unpack string to objects
   * @param str
   * @param shortKeys
   * @returns {{}}
   */
  static unpack(str, shortKeys) {
    const regex = /([a-z]{2})=([^;]+)?;/gi;
    const obj = {};
    let match = null;
    while ((match = regex.exec(str))) {
      const short = match[1];
      const value = match[2] !== void 0 ? match[2] : '';
      const path = shortKeys[short];
      ArrayPath.set(obj, path, value, true);
    }
    return obj;
  }
}



const helper = require('./parser/helper');

const CH_UA_FULL_VERSION = 'sec-ch-ua-full-version';
const CH_UA_FULL_VERSION_LIST = 'sec-ch-ua-full-version-list';
const CH_UA_MODEL = 'sec-ch-ua-model';
const CH_UA_PLATFORM_VERSION = 'sec-ch-ua-platform-version';
const CH_UA_PLATFORM = 'sec-ch-ua-platform';
const CH_UA_ARCH = 'sec-ch-ua-arch';
const CH_UA = 'sec-ch-ua';
const CH_BITNESS = 'sec-ch-ua-bitness';
const CH_UA_PREFERS_COLOR_SCHEME = 'sec-ch-prefers-color-scheme';

/*
  All combinations
[
  'device-memory',
  'downlink',
  'dpr',
  'ect',
  'lang',
  'rtt',
  'save-data',
  'sec-ch-device-memory',
  'sec-ch-downlink',
  'sec-ch-dpr',
  'sec-ch-ect',
  'sec-ch-forced-colors',
  'sec-ch-lang',
  'sec-ch-prefers-color-scheme',
  'sec-ch-prefers-contrast',
  'sec-ch-prefers-reduced-data'
  'sec-ch-prefers-reduced-motion',
  'sec-ch-prefers-reduced-transparency',
  'sec-ch-rtt',
  'sec-ch-save-data',
  'sec-ch-ua',
  'sec-ch-ua-arch',
  'sec-ch-ua-bitness',
  'sec-ch-ua-full-version',
  'sec-ch-ua-full-version-list',
  'sec-ch-ua-mobile',
  'sec-ch-ua-model',
  'sec-ch-ua-platform',
  'sec-ch-ua-platform-version',
  'sec-ch-viewport-height',
  'sec-ch-viewport-width',
  'sec-ch-width',
  'ua',
  'ua-arch',
  'ua-bitness',
  'ua-full-version',
  'ua-mobile',
  'ua-model',
  'ua-platform',
  'ua-platform-version',
  'viewport-height',
  'viewport-width',
  'width',
]
*/


class ClientHints {

  /**
   * @returns {{'accept-ch': ''}}
   * @example
   * ```js
   const hintHeaders = ClientHints.getHeaderClientHints();
   for (let name in hintHeaders) {
   res.setHeader(name, hintHeaders[headerName]);
   }
   * ```
   */
  static getHeaderClientHints() {
    return {
      'accept-ch': [
        CH_UA_FULL_VERSION,
        CH_UA_FULL_VERSION_LIST,
        CH_UA_PLATFORM,
        CH_UA_PLATFORM_VERSION,
        CH_UA_MODEL,
        CH_UA_ARCH,
        CH_BITNESS,
        CH_UA_PREFERS_COLOR_SCHEME
      ].join(', ')
    };
  }

  /**
   * @param {{}} headers - key/value
   * @return {boolean}
   * @example
   * ```js
   console.log('is support client hints', ClientHints.isSupport(res.headers));
   * js
   */
  static isSupport(headers) {
    return headers[CH_UA] !== void 0 || headers[CH_UA.toLowerCase()] !== void 0 || headers[CH_UA_FULL_VERSION_LIST.toLowerCase()] !== void 0;
  }

  /**
   * @param {{}} hints
   * @param {{}} result
   * @private
   */
  __parseHints(hints, result) {
    for (let key in hints) {
      let value = hints[key];
      let lowerCaseKey = key.toLowerCase().replace('_', '-');

      switch (lowerCaseKey) {
        case 'http-sec-ch-ua-arch':
        case 'sec-ch-ua-arch':
        case 'arch':
        case 'architecture':
          result.os.platform = helper.trimChars(value, '"');
          break;
        case 'http-sec-ch-ua-bitness':
        case 'sec-ch-ua-bitness':
        case 'bitness':
          result.os.bitness = helper.trimChars(value, '"');
          break;
        case 'http-sec-ch-ua-mobile':
        case 'sec-ch-ua-mobile':
        case 'mobile':
          result.isMobile = true === value || '1' === value || '?1' === value;
          break;
        case 'http-sec-ch-ua-model':
        case 'sec-ch-ua-model':
        case 'model':
          result.device.model = helper.trimChars(value, '"');
          break;
        case 'http-sec-ch-ua-full-version':
        case 'sec-ch-ua-full-version':
        case 'uafullversion':
          result.upgradeHeader = true;
          result.client.version = helper.trimChars(value, '"');
          break;
        case 'http-sec-ch-ua-platform':
        case 'sec-ch-ua-platform':
        case 'platform':
          result.os.name = helper.trimChars(value, '"');
          break;
        case 'http-sec-ch-ua-platform-version':
        case 'sec-ch-ua-platform-version':
        case 'platformversion':
          result.os.version = helper.trimChars(value, '"');
          break;
        case 'brands':
          if (result.client.brands.length > 0) {
            break;
          }
        // eslint-disable-next-line no-fallthrough
        case 'fullversionlist':
          if (Array.isArray(value)) {
            result.client.brands = value;
          }
          break;
        case 'http-sec-ch-ua':
        case 'sec-ch-ua':
          if (result.client.brands.length > 0) {
            break;
          }
        // eslint-disable-next-line no-fallthrough
        case 'http-sec-ch-ua-full-version-list':
        case 'sec-ch-ua-full-version-list':
          let pattern = new RegExp('"([^"]+)"; ?v="([^"]+)"(?:, )?', 'gi');
          let items = [];
          let matches = null;
          while (matches = pattern.exec(value)) {
            let brand = matches[1];
            let skip = brand.indexOf('Not;A') !== -1 || brand.indexOf('Not A;') !== -1 || brand.indexOf('Not.A') !== -1;
            if (skip) {
              continue;
            }
            items.push({ brand, version: helper.trimChars(matches[2], '"') });
          }
          if (items.length > 0) {
            result.client.brands = items;
          }
          break;
        case 'x-requested-with':
        case 'http-x-requested-with':
          result.app = value;
          if (value.toLowerCase() === 'xmlhttprequest') {
            result.app = '';
          }
          break;
      }
    }
  }

  /**
   * @param {{}} meta
   * @param {{}} result
   * @private
   */
  __parseMeta(meta, result) {
    for (let key in meta) {
      let value = meta[key];
      let lowerCaseKey = key.toLowerCase();

      if (value === void 0) {
        continue;
      }

      switch (lowerCaseKey) {
        case 'width':
        case 'height':
          result.meta[key] = String(parseInt(value));
          break;
        case 'gpu':
        case 'gamut':
        case 'ram':
          result.meta[key] = value;
          break;
        case 'colordepth':
          result.meta.colorDepth = value;
          break;
        case 'cores':
          result.meta.cpuCores = value;
          break;
      }
    }
  }

  /**
   * @param {{}} hints - headers or client-hints params
   * @param {{}} meta  - client custom js metric params
   */
  parse(hints, meta = {}) {
    let result = {
      upgradeHeader: false,
      isMobile: false,
      meta: {
        width: '',
        height: '',
        gpu: '',
        gamut: '',
        ram: '',
        colorDepth: '',
        cpuCores: ''
      },
      prefers: { colorScheme: '' },
      os: { name: '', platform: '', bitness: '', version: '' },
      client: { brands: [], version: '' },
      device: { model: '' }
    };
    this.__parseHints(hints, result);
    this.__parseMeta(meta, result);

    return result;
  }

}

module.exports = ClientHints;
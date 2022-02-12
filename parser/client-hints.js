const header = require('./helper');
const attr = header.getPropertyValue;

const CH_UA_FULL_VERSION = 'sec-ch-ua-full-version';
const CH_UA_FULL_VERSION_LIST = 'sec-ch-ua-full-version-list';
const CH_UA_MOBILE = 'sec-ch-ua-mobile';
const CH_UA_MODEL = 'sec-ch-ua-model';
const CH_UA_PLATFORM_VERSION = 'sec-ch-ua-platform-version';
const CH_UA_PLATFORM = 'sec-ch-ua-platform';
const CH_UA_ARCH = 'sec-ch-ua-arch';
const CH_UA = 'sec-ch-ua';
const CH_UA_PREFERS_COLOR_SCHEME = 'sec-ch-prefers-color-scheme';

/*
  sec-ch-ua',ua,
  sec-ch-ua-platform, ua-platform',
  sec-ch-ua-mobile,ua-mobile
  sec-ch-ua-full-version',ua-full-version,sec-ch-ua-full-version-list
  sec-ch-ua-platform-version,ua-platform-version,
  sec-ch-ua-arch,ua-arch,
  sec-ch-ua-bitness,ua-bitness,
  sec-ch-ua-model,ua-model,
  sec-ch-lang,lang,
  sec-ch-save-data,save-data,
  sec-ch-width, width,
  sec-ch-viewport-width,viewport-width,
  sec-ch-viewport-height,viewport-height,
  sec-ch-dpr,dpr,
  sec-ch-device-memory,device-memory,
  sec-ch-rtt,rtt,
  sec-ch-downlink,downlink,
  sec-ch-ect,ect,
  sec-ch-prefers-color-scheme,
  sec-ch-prefers-reduced-motion,
  sec-ch-prefers-reduced-transparency,
  sec-ch-prefers-contrast,sec-ch-forced-colors,
  sec-ch-prefers-reduced-data];
*/

function getBrowserNames(headers) {
  let value = attr(headers, CH_UA, '');
  let pattern = new RegExp('"([^"]+)"; ?v="([^"]+)"(?:, )?', 'gi');
  let items = [];
  let matches = null;
  while (matches = pattern.exec(value)) {
    let brand = matches[1];
    let skip = brand.indexOf('Not;A') !== -1
        || brand.indexOf('Not A;') !== -1
        || brand.indexOf('Chromium') !== -1;
    if (skip) {
      continue
    }
    items.push({brand, version: matches[2]});
  }
  return items;
}


class ClientHints {

  /**
   * @returns {{"accept-ch": string}}
   */
  static getHeaderClientHints() {
    return {
      'accept-ch':
          'sec-ch-prefers-color-scheme, sec-ch-ua-full-version, sec-ch-ua-full-version-list, sec-ch-ua-platform, sec-ch-ua-platform-version, sec-ch-ua-model, sec-ch-ua-arch',
    };
  }

  /**
   * @param {{}} headers - key/value
   * @return {boolean}
   */
  static isSupport(headers) {
    return headers[CH_UA] !== void 0;
  }


  /**
   * @param {{}} headers - key/value
   */
  parse(headers) {
    if (!ClientHints.isSupport(headers)) {
      return {};
    }

    let result = {};

    result.upgradeHeader = headers[CH_UA_FULL_VERSION] !== void 0;

    result.isMobile = attr(headers, CH_UA_MOBILE, '') === '?1';
    result.prefers = {
      colorScheme: attr(headers, CH_UA_PREFERS_COLOR_SCHEME, '')
    }
    // os
    result.os = {
      name: attr(headers, CH_UA_PLATFORM, ''),
      platform: attr(headers, CH_UA_ARCH, '')
    };
    let osVersion = attr(headers, CH_UA_PLATFORM_VERSION, '');
    if (result.os.name === 'Windows' && osVersion !== '') {
      let majorOsVersion = ~~osVersion.split('.')[0];
      if (majorOsVersion === 0) {
        osVersion = "";  // 7 | 8 | 8.1
      }
      if (majorOsVersion > 0 && majorOsVersion < 11) {
        osVersion = "10";
      } else if (majorOsVersion > 11 && majorOsVersion < 16) {
        osVersion = "11";
      }
    }
    result.os.verion = osVersion;

    // client
    let clientData = getBrowserNames(headers);
    let clientItem = clientData.length ? clientData[0] : {};

    result.client = {
      name: clientItem.brand || "",
      version: attr(headers, CH_UA_FULL_VERSION, '') || clientItem.version || ""
    };

    result.device = {
      code: attr(headers, CH_UA_MODEL, '')
    }

    result.appId = attr(headers, 'x-requested-with' , '')
    if (result.appId.toLowerCase() === 'xmlhttprequest') {
      result.appId = '';
    }

    return result;
  }

}

module.exports = ClientHints;
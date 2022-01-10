const header = require('./helper');

const attr = header.getPropertyValue;

class ClientHintParser {

  /**
   * @returns {{"Accept-CH": string}}
   */
  static getHeaderClientHints() {
    return {
      'Accept-CH':
          'Sec-CH-UA-Full-Version, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Model, Sec-CH-UA-Arch',
    };
  }

  /**
   * @param {{}} headers - key/value
   * @return {boolean}
   */
  isNeedUpgradeHeader(headers) {
    return headers['sec-ch-ua-full-version'] !== void 0;
  }

  /**
   * @param {{}} headers - key/value
   * @return {boolean}
   */
  isSupport(headers) {
    return headers['sec-ch-ua'] !== void 0;
  }

  /**
   * @param headers {{}}
   * @returns {boolean}
   */
  isMobile(headers) {
    return attr(headers, 'sec-ch-ua-mobile', '') === '?1';
  }

  /**
   * @param headers {{}}
   * @returns {string}
   */
  getDeviceCode(headers) {
    return attr(headers, 'sec-ch-ua-model', '');
  }

  /**
   * @param headers {{}}
   * @returns {string}
   */
  getOsName(headers) {
    return attr(headers, 'sec-ch-ua-platform', '');
  }

  /**
   * @param headers {{}}
   * @returns {string}
   */
  getOsVersion(headers) {
    let osName = this.getOsName(headers);
    let osVersion = attr(headers, 'sec-ch-ua-platform-version', '');
    if (osName === 'Windows' && osVersion !== '') {
      let majorOsVersion = ~~osVersion.split('.')[0];
      if (majorOsVersion === 0) {
        osVersion = "7";  // 7 | 8 | 8.1
      }
      if (majorOsVersion > 0 && majorOsVersion < 11) {
        osVersion = "10";
      } else if (majorOsVersion > 10 && majorOsVersion < 16) {
        osVersion = "11";
      }
    }
    return osVersion;
  }

  /**
   * @param headers {{}}
   * @returns {string}
   */
  getOsPlatform(headers) {
    return attr(headers, 'sec-ch-ua-arch', '');
  }

  /**
   * @param headers {{}}
   * @returns {string}
   */
  getBrowserVersion(headers) {
    return attr(headers, 'sec-ch-ua-full-version', '');
  }

  /**
   * @param headers {{}}
   * @returns {string}
   */
  getBrowserName(headers) {
    let clientUA = attr(headers, 'sec-ch-ua', '');
    let browserHeaders = clientUA.split(', ');
    let match = /"([^"]+)"/i.exec(browserHeaders[browserHeaders.length - 1])[1];
    return match && match.length ? match[0] : "";
  }

  /**
   * @param {{}} headers - key/value
   */
  parse(headers) {
    if (!this.isSupport(headers)) {
      return {};
    }

    return {
      upgradeHeader: his.isNeedUpgradeHeader(headers),
      isMobile: this.isMobile(headers),
      os: {
        name: this.getOsName(headers),
        version: this.getOsVersion(headers),
        platform: this.getOsPlatform(heaedrs),
      },
      client: {
        name: this.getBrowserName(headers),
        version: this.getBrowserVersion(headers)
      },
      device: {
        code: this.getDeviceCode(headers)
      }
    }
  }

}

module.exports = ClientHintParser;
const collection = require('../../regexes/device-index-hash');

class IndexerDevice {
  static findDeviceBrandsForDeviceCode(deviceCode) {
    let lDeviceCode = deviceCode.toLowerCase();
    let brands = collection[lDeviceCode];
    if (brands !== void 0) {
      return brands;
    }

    return [];
  }

}

module.exports = IndexerDevice;
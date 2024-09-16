import * as helper from '../helper';

let collection;
const path = __dirname + '/../../regexes/device-index-hash.yml';

export class IndexerDevice {
  static findDeviceBrandsForDeviceCode(deviceCode) {
    if (!IndexerDevice.ready()) {
      return null;
    }

    const lDeviceCode = deviceCode.toLowerCase();
    const brands = collection[lDeviceCode];
    if (brands !== void 0) {
      return brands;
    }

    return [];
  }

  static ready() {
    return collection !== void 0;
  }

  static init() {
    if (helper.hasFile(path)) {
      collection = helper.loadYMLFile(path);
    }
  }

}

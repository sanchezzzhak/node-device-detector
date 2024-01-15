const AbstractParser = require('../../abstract-parser');

/**
 *
 * @param {Object} data
 * @return {{code: string, model: string, type: string, brand: string}}
 */
const makeResult = (data) => {

  if (data.code == void 0) {
    return {};
  }

  return {
    code: String(data.code),
    brand: String(data.brand),
    type: String(data.device),
    model: String(data.model)
  };
};

const fuzzyCompareNumber = (value1, value2, num = 3) => {
  return parseFloat(value1).toFixed(num) === parseFloat(value2).toFixed(num);
};

class DeviceHint extends AbstractParser {

  constructor() {
    super();
    this.fixtureFile = 'device-hint.yml';
    this.loadCollection();
  }

  parse(clientHints = {}) {
    if (!clientHints.meta || !clientHints.meta.hashG) {
      return {};
    }

    let hashG = clientHints.meta.hashG;
    let record = this.collection[hashG];

    if (record === void 0) {
      return {};
    }

    if (!record.devices) {
      return makeResult(record);
    }

    const ratio = String(clientHints.meta.ratio);
    const width = String(clientHints.meta.width);
    const height = String(clientHints.meta.height);
    const hashC = parseFloat(clientHints.meta.hashC);

    for (let item of record.devices) {
      const check = item.check;
      // check ratio and size screen
      if (check.ratio === void 0 || check.width === void 0 || check.height === void 0) {
        continue;
      }
      if (false === fuzzyCompareNumber(check.ratio, ratio)) {
        continue;
      }
      if (false === (fuzzyCompareNumber(check.width, width) && fuzzyCompareNumber(check.height, height))) {
        continue;
      }
      // check operations hashC;
      if (check.o !== void 0 && Array.isArray(check.o)) {
        for (let operations of check.o) {
          if (hashC >= operations[0] && hashC <= operations[1]) {
            return makeResult(item);
          }
        }
        continue;
      }

      return makeResult(item);
    }

    return {};
  }

}

module.exports = DeviceHint;
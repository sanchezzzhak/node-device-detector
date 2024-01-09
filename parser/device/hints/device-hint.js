const AbstractParser = require('../../abstract-parser');

class DeviceHint extends AbstractParser {

  constructor() {
    super();
    this.fixtureFile = 'device-hint.yml';
    this.loadCollection();
  }

  parse(clientHints = {}){
    if (!clientHints.meta || !clientHints.meta.hashG) {
      return {};
    }

    let hash = clientHints.meta.hashG;
    let item = this.collection[hash];

    if (item === void 0) {
      return {};
    }

    if (item && !item.devices) {
      return {
        code: String(item.code),
        brand: String(item.brand),
        type: String(item.device),
        model: String(item.model),
      };
    }

    return {};
  }

}

module.exports = DeviceHint;
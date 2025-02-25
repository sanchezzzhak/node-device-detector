const AbstractParser = require("../../abstract-parser");

class BrowserHints extends AbstractParser
{
  constructor() {
    super();
    this.collection = require('../../../regexes/client/hints/browsers');
  }

  parse(clientHints) {
    if (!clientHints) {
      return null;
    }
    let appId = clientHints.app;
    if (!appId) {
      return null;
    }
    if (this.collection[appId] === void 0) {
      return null;
    }
    let name = this.collection[appId];
    return {
      name: String(name)
    };
  }

}

module.exports = BrowserHints;
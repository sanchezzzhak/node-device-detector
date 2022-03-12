const HashHintsAbstract = require("../hash-hints-abstract");

class BrowserHashHints extends HashHintsAbstract
{
  constructor() {
    super();
    this.fixtureFile = 'hints/browsers.yml';
    this.loadCollection();
  }
}

module.exports = BrowserHashHints;
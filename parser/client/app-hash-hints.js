const HashHintsAbstract = require("../hash-hints-abstract");

class AppHashHints extends HashHintsAbstract
{
  constructor() {
    super();
    this.fixtureFile = 'hints/apps.yml';
    this.loadCollection();
  }
}

module.exports = AppHashHints;
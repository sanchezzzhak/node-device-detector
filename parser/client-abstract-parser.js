const ParserAbstract = require('./abstract-parser');
const util = require('util');

function ClientAbstractParser() {}

util.inherits(ClientAbstractParser, ParserAbstract);


ClientAbstractParser.prototype.parse = function (userAgent) {
  for (let i = 0, l = this.collection.length; i < l; i++) {
    let item = this.collection[i];
    let regex = this.getBaseRegExp(item.regex);
    let match = regex.exec(userAgent);
    if (match !== null) {
	  return {
		type: '',
		name: this.buildByMatch(item.name, match),
		version: this.buildVersion(item.version, match)
	  };
    }
  }
  return null;
};


module.exports = ClientAbstractParser;
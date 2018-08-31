const ParserAbstract = require('./abstract-parser');
const util = require('util');

function ClientAbstractParser() {
  this.type = '';
  this.name = '';
  this.version = '';
}

util.inherits(ClientAbstractParser, ParserAbstract);

ClientAbstractParser.prototype.getParseData = function(){
  return {
    type: this.type,
    name: this.name,
    version: this.version
  };
};

ClientAbstractParser.prototype.parse = function (userAgent) {
  this.reset();
  for (let i = 0, l = this.collection.length; i < l; i++) {
    let item = this.collection[i];
    let regex = this.getBaseRegExp(item.regex);
    let match = regex.exec(userAgent);
    if (match !== null) {
      this.name = this.buildByMatch(item.name, match);
      this.version = this.buildVersion(item.version, match);
      return true;
    }
  }
  return false;
};

ClientAbstractParser.prototype.reset = function () {
  this.type = '';
  this.name = '';
  this.version = '';
};




module.exports = ClientAbstractParser;
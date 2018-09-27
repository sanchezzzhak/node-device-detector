const ParserAbstract = require('./abstract-parser');
const util = require('util');

function BotAbstractParser() {
  this.fixtureFile = 'bots.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(BotAbstractParser, ParserAbstract);

BotAbstractParser.prototype.getParseData = function () {
  return {
    name: this.name,
    category: this.category,
    url: this.url,
    producer: this.producer
  };
};

BotAbstractParser.prototype.parse = function (userAgent) {
  this.reset();
  for (let i = 0, l = this.collection.length; i < l; i++) {
    let item = this.collection[i];
    let regex = this.getBaseRegExp(item.regex);
    let match = regex.exec(userAgent);

    if (match !== null) {
      this.name = item.name ? item.name : '';
      this.category = item.category ? item.category : '';
      this.url = item.url ? item.url: '';
      this.producer = item.producer ? item.producer : {};

      return true;
    }

  }
  return false;
};

BotAbstractParser.prototype.reset = function () {
  this.name = '';
  this.category = '';
  this.url = '';
  this.producer = {};

};


module.exports = BotAbstractParser;
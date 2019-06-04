const ParserAbstract = require('./abstract-parser');
const util = require('util');

function BotAbstractParser() {
  this.fixtureFile = 'bots.yml';
  this.loadCollection();
}

util.inherits(BotAbstractParser, ParserAbstract);

/**
 * parse user agent is bot
 * @param {string} userAgent
 * @returns {{name: string, producer: {}, category: string, url: string}|null}
 */
BotAbstractParser.prototype.parse = function (userAgent) {
  for (let i = 0, l = this.collection.length; i < l; i++) {
	let item = this.collection[i];
	let regex = this.getBaseRegExp(item.regex);
	let match = regex.exec(userAgent);
	
	if (match !== null) {
	  return {
		name: item.name ? item.name : '',
		category: item.category ? item.category : '',
		url: item.url ? item.url : '',
		producer: item.producer ? item.producer : {}
	  };
	}
  }
  return null;
};

module.exports = BotAbstractParser;
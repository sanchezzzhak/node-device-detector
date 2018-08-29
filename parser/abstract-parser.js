const YAML = require('yamljs');
const util = require('util');

const BASE_REGEXES_DIR = __dirname + '/../regexes';

/**
 * @constructor
 */
function ParserAbstract() {
  this.userAgent = null;
  this.parserName = null;
  this.fixtureFile = null;
  this.collection = null;
  this.loadCollection();

}
/**
 * load collection
 */
ParserAbstract.prototype.loadCollection = function(){
  this.collection = this.YAML.load(BASE_REGEXES_DIR + this.fixtureFile);
};

module.exports = ParserAbstract;
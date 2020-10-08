const YAML = require('yamljs');
const helper = require('./helper');

const BASE_REGEXES_DIR = __dirname + '/../regexes/';


/**
 * @param {string} result
 * @return {string}
 */
function fixStringName(result) {
  return result.replace(new RegExp('_', 'g'), ' ').replace(/ TD$/i, '');
}

/**
 * @param {string} result
 * @return {string}
 */
function fixStringVersion(result) {
  result = result.replace(new RegExp('_', 'g'), '.');
  result = result.replace(new RegExp('[\.]$', 'g'), '');
  return result.trim();
}

/**
 * @constructor
 */
function ParserAbstract() {
  this.fixtureFile = null;
  this.collection = null;
  this.versionTruncation = null;
}

/**
 * load collection
 */
ParserAbstract.prototype.loadCollection = function () {
  this.collection = this.loadYMLFile(this.fixtureFile);
};

/**
 *
 * @param file
 * @return {*}
 */
ParserAbstract.prototype.loadYMLFile = function (file) {
  return YAML.load(BASE_REGEXES_DIR + file);
};

/**
 * A special method that overwrites placeholders in a string
 * @param {string} item
 * @param {array} matches
 * @return {string|*}
 */
ParserAbstract.prototype.buildByMatch = function (item, matches) {
  item = item || '';
  item = item.toString();

  if (item.indexOf('$') !== -1) {
	for (let nb = 1; nb <= 3; nb++) {
	  if (item.indexOf('$' + nb) === -1) {
		continue;
	  }
	  let replace = (matches[nb] !== undefined) ? matches[nb] : '';
	  item = item.replace('$' + nb, replace);
	}
  }
  return item;
};

/**
 * helper prepare base regExp + part regExp
 * @param {string} str
 * @return {RegExp}
 */
ParserAbstract.prototype.getBaseRegExp = function (str) {
  str = str.replace(new RegExp('/', 'g'), '\\/');
  str = str.replace(new RegExp('\\+\\+', 'g'), '+');
  str = '(?:^|[^A-Z0-9\-_]|[^A-Z0-9\-]_|sprd-)(?:' + str + ')';
  return new RegExp(str, 'i');
};

/**
 * @param {string} model
 * @param matches
 * @return {*}
 */
ParserAbstract.prototype.buildModel = function (model, matches) {
  model = fixStringName(this.buildByMatch(model, matches));
  return (model === 'Build') ? null : model;
};

/**
 * Set the number of characters in the version where number is the number of characters +1
 * There is a line string version 1.2.3.4.555
 * If you set 0 we get version 1, if 2 we get 1.2.3 and so on.
 * @param {number} num
 */
ParserAbstract.prototype.setVersionTruncation = function (num) {
  this.versionTruncation = num;
}

/**
 * @param version
 * @param matches
 * @return {string}
 */
ParserAbstract.prototype.buildVersion = function (version, matches) {
  version = fixStringVersion(this.buildByMatch(version, matches));
  const skipVersion = [
	'Portable', ''
  ];
  if (skipVersion.indexOf(version) !== -1) {
	return version;
  }
  return helper.versionTruncate(version, this.versionTruncation);
};

module.exports = ParserAbstract;
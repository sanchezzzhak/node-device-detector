const YAML = require('yamljs');
const util = require('util');

const BASE_REGEXES_DIR = __dirname + '/../regexes/';


/**
 * @param result
 * @return {string}
 */
function fixStringName(result) {
  return result.replace(new RegExp('_', 'g'), ' ').replace(/ TD$/i, '');
}

/**
 * @param result
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
}

/**
 * load collection
 */
ParserAbstract.prototype.loadCollection = function(){
  this.collection = this.loadYMLFile(this.fixtureFile);
};

/**
 *
 * @param file
 * @return {*}
 */
ParserAbstract.prototype.loadYMLFile = function(file){
  return YAML.load(BASE_REGEXES_DIR + file);
};

/**
 * @param item
 * @param matches
 * @return {string|*}
 */
ParserAbstract.prototype.buildByMatch = function(item, matches) {
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
 * @param str
 * @return {RegExp}
 */
ParserAbstract.prototype.getBaseRegExp = function(str) {
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
ParserAbstract.prototype.buildModel =function(model, matches) {
  model = fixStringName(this.buildByMatch(model, matches));
  return (model === 'Build') ? null : model;
};

/**
 * @param version
 * @param matches
 * @return {string}
 */
ParserAbstract.prototype.buildVersion = function(version, matches) {
  version = fixStringVersion(this.buildByMatch(version, matches));
  const skipVersion = [
      'Portable', ''
  ];
  if(skipVersion.indexOf(version) !== -1){
    return version;
  }
  let versionParts = String(version).split('.');
  //  const maxMinorParts = 4;
  //  console.log(versionParts, versionParts.length);
  // if (versionParts.length > maxMinorParts) {
  //   versionParts = versionParts.slice(0, 1 + maxMinorParts);
  // }
  version = versionParts.join('.');
  return version;
};

module.exports = ParserAbstract;
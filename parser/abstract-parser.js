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
  this.userAgent = null;
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
 * helper prepare version
 * @param ver1
 * @param ver2
 * @return {Number}
 */
ParserAbstract.prototype.versionCompare = function(ver1, ver2) {
  if (ver1 === ver2) {
    return 0;
  }
  let left = ver1.split(".");
  let right = ver2.split(".");
  let len = Math.min(left.length, right.length);
  for (let i = 0; i < len; i++) {
    if (parseInt(left[i]) > parseInt(right[i])) {
      return 1;
    }
    if (parseInt(left[i]) < parseInt(right[i])) {
      return -1;
    }
  }
  if (left.length > right.length) {
    return 1;
  }
  if (left.length < right.length) {
    return -1;
  }
  return 0;
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
  // const maxMinorParts = 1;
  // let versionParts = String(version).split('.');
  // if (versionParts.length > maxMinorParts) {
  //   versionParts = versionParts.slice(0, 1 + maxMinorParts);
  //   version = versionParts.join('.');
  // }
  return fixStringVersion(this.buildByMatch(version, matches));
};

module.exports = ParserAbstract;
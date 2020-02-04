const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');
const YAML = require('yamljs');

const CLIENT_TYPE = require('./../const/client-type');
const BROWSER_SHORT = require('./browser-short');
const BROWSER_FAMILIES = require('./browser-families');
const helper = require('./../helper');


function Browser() {
  this.engine_collection = [];
  this.fixtureFile = 'client/browsers.yml';
  this.loadCollection();
}

util.inherits(Browser, ClientAbstractParser);

Browser.prototype.loadCollection = function () {
  ClientAbstractParser.prototype.loadCollection.call(this);
  this.engine_collection = this.loadYMLFile('client/browser_engine.yml');
};

Browser.prototype.parse = function (userAgent) {
  for (let i = 0, l = this.collection.length; i < l; i++) {
    let item = this.collection[i];
    let regex = this.getBaseRegExp(item.regex);
    let match = regex.exec(userAgent);

    if (match !== null) {
      let name = this.buildByMatch(item.name, match);
      let version = this.buildVersion(item.version, match);

      let short = this.buildShortName(name);
      let engine = this.buildEngine(item.engine !== undefined ? item.engine : {}, version);
      if (engine === '') {
        engine = this.parseEngine(userAgent);
      }
      
      let engineVersion = this.buildEngineVersion(userAgent, engine);
      let family = this.buildFamily(short);
      
	  return {
		type: CLIENT_TYPE.BROWSER,
		name: name,
		short_name: String(short),
		version: version,
		engine: engine,
		engine_version: engineVersion,
		family: family
	  };
	  
    }
  }
  
  return null;
};


Browser.prototype.buildFamily = function(shortName){
  for(let browserFamily in BROWSER_FAMILIES){
    if(browserFamily &&  BROWSER_FAMILIES[browserFamily] && BROWSER_FAMILIES[browserFamily].indexOf(shortName) !== -1){
      return browserFamily;
	}
  }
  return '';
};

/**
 * @param engine
 * @param browserVersion
 * @return {string}
 */
Browser.prototype.buildEngine = function (engine, browserVersion) {
  let result = '';
  if (engine.hasOwnProperty('default') && engine.default !== '') {
    result = engine.default;
  }
  if (engine.hasOwnProperty('versions')) {
    let versions = Object.keys(engine.versions).sort(helper.versionCompare);
    for (let i = 0, l = versions.length; i < l; i++) {
      if (browserVersion !== '' && helper.versionCompare(browserVersion, versions[i]) >= 0) {
        result = engine.versions[versions[i]];
      }
    }
  }
  return result;
};

Browser.prototype.parseEngine = function (userAgent) {
  let result = '';
  for (let i = 0, l = this.engine_collection.length; i < l; i++) {
    let item = this.engine_collection[i];
    let regex = this.getBaseRegExp(item.regex);
    let match = regex.exec(userAgent);
    if (match !== null) {
      result = item.name;
      break;
    }
  }
  return result;
};

/**
 * @param userAgent
 * @param engine
 * @return {string}
 */
Browser.prototype.buildEngineVersion = function (userAgent, engine) {
  if (engine === '') {
    return '';
  }
  let regexp = new RegExp(engine + '\\s*\\/?\\s*(((?=\\d+\\.\\d)\\d+[.\\d]*|\\d{1,7}(?=(?:\\D|$))))', 'i');
  let match = regexp.exec(userAgent);
  if (match !== null) {
    return match.pop();
  }
  return '';
};

/**
 * @param name
 * @return {*}
 */
Browser.prototype.buildShortName = function (name) {
  const UNKNOWN = 'UNK';
  for (let key in BROWSER_SHORT) {
    if (String(name).toLowerCase() === String(BROWSER_SHORT[key]).toLowerCase()) {
      return key;
    }
  }
  return UNKNOWN;
};


module.exports = Browser;
const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');
const BROWSER_SHORT = require('./browser-short');

function Browser() {
  this.fixtureFile = 'client/browsers.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(Browser, ClientAbstractParser);


Browser.prototype.getParseData = function(){
  return {
    engine : this.engine,
    engine_version : this.engine_version,
    short_name : this.short_name,
    name : this.name,
    version : this.version,
    type: this.type
  };
};

Browser.prototype.reset = function(){
  this.engine = '';
  this.engine_version =  '';
  this.short_name =  '';
  this.name =  '';
  this.version = '';
  this.type = '';
};

Browser.prototype.parse = function (userAgent) {
  this.reset();
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
        engine = this.findEngine(userAgent);
      }
      let engineVersion = this.buildEngineVersion(userAgent, engine);

      this.engine = engine;
      this.engine_version = engineVersion;
      this.short_name = short;
      this.name = name;
      this.version = version;
      this.type = CLIENT_TYPE.BROWSER;

      return true;
    }
  }
  return false;
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
    for (let version in engine.versions) {
      if (this.versionCompare(browserVersion, version) >=0) {
        result = engine.versions[version];
      }
    }
  }
  return result;
};

/**
 * @param userAgent
 * @param engine
 * @return {string}
 */
Browser.prototype.buildEngineVersion = function(userAgent, engine){
  if(engine === ''){
    return '';
  }
  let regexp = new RegExp(engine + '\\s*\\/?\\s*(((?=\\d+\\.\\d)\\d+[.\\d]*|\\d{1,7}(?=(?:\\D|$))))', 'i');
  let match = regexp.exec(userAgent);
  if(match){
    return match.pop();
  }
  return '';
};

/**
 * @param name
 * @return {*}
 */
Browser.prototype.buildShortName = function(name){
  const UNKNOWN = 'UNK';
  for (let key in BROWSER_SHORT) {
    if (String(name).toLowerCase() === String(BROWSER_SHORT[key]).toLowerCase()) {
      return key;
    }
  }
  return UNKNOWN;
};


module.exports = Browser;
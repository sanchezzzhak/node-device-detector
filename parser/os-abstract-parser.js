const ParserAbstract = require('./abstract-parser');
const util = require('util');

function OsAbstractParser() {
  this.fixtureFile = 'oss.yml';
  this.loadCollection();
}

util.inherits(OsAbstractParser, ParserAbstract);

OsAbstractParser.prototype.os_systems = require('./os/os_systems');
OsAbstractParser.prototype.os_families = require('./os/os_families');


/**
 * @param name
 * @return {*}
 */
OsAbstractParser.prototype.parseOsFamily = function(name){
  for(let family in this.os_families){
    if (this.os_families[family].indexOf(name) !== -1) {
      return String(family);
    }
  }
  return '';
};

OsAbstractParser.prototype.parse = function (userAgent) {
  
  for (let i = 0, l = this.collection.length; i < l; i++) {
    let item = this.collection[i];
    let regex = this.getBaseRegExp(item.regex);
    let match = regex.exec(userAgent);
    if (match !== null) {
      let name = this.buildByMatch(item.name, match);
      let short = 'UNK';
      for(let key in this.os_systems){
        if (String(name).toLowerCase() === String(this.os_systems[key]).toLowerCase()) {
          name = this.os_systems[key];
          short = key;
          break;
        }
      }
      return {
        name: name,
		short_name: short,
		version: this.buildVersion(item.version, match),
		platform: this.parsePlatform(userAgent),
		family: this.parseOsFamily(short)
	  };
    }
  }

  return null;
};


/**
 * parse ua platform
 * @param userAgent {string}
 * @return {string}
 */
OsAbstractParser.prototype.parsePlatform = function (userAgent) {
  if (this.getBaseRegExp('arm').test(userAgent)) {
    return 'ARM';
  } else if (this.getBaseRegExp('WOW64|x64|win64|amd64|x86_6').test(userAgent)) {
    return 'x64';
  } else if (this.getBaseRegExp('i[0-9]86|i86pc').test(userAgent)) {
    return 'x86';
  }
  return '';
};

module.exports = OsAbstractParser;
module.exports.OsAbstractParser = OsAbstractParser;

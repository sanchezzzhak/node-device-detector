const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function MobileApp() {
  this.fixtureFile = 'client/mobile_apps.yml';
  this.loadCollection();
}

util.inherits(MobileApp, ClientAbstractParser);


MobileApp.prototype.parse = function(userAgent){
  let result = ClientAbstractParser.prototype.parse.call(this, [userAgent]);
  if (result) {
	result = Object.assign(result, {
	  type: CLIENT_TYPE.MOBILE_APP
	});
	return result;
  }
  return null;
};

module.exports = MobileApp;
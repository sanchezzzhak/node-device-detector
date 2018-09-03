const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function MobileApp() {
  this.fixtureFile = 'client/mobile_apps.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(MobileApp, ClientAbstractParser);


MobileApp.prototype.parse = function(userAgent){

  if (ClientAbstractParser.prototype.parse.call(this, [userAgent])) {
    this.type = CLIENT_TYPE.MOBILE_APP;
    return true;
  }
  return false
};

module.exports = MobileApp;
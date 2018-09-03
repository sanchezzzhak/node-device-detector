const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function Library() {
  this.fixtureFile = 'client/libraries.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(Library, ClientAbstractParser);


Library.prototype.parse = function(userAgent){

  if (ClientAbstractParser.prototype.parse.call(this, [userAgent])) {
    this.type = CLIENT_TYPE.LIBRARY;
    return true;
  }
  return false
};

module.exports = Library;
const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function Library() {
  this.fixtureFile = 'client/libraries.yml';
  this.loadCollection();
}

util.inherits(Library, ClientAbstractParser);


Library.prototype.parse = function(userAgent){
  let result = ClientAbstractParser.prototype.parse.call(this, [userAgent]);
  if (result) {
	result = Object.assign(result, {
	  type: CLIENT_TYPE.LIBRARY
	});
	return result;
  }
  return null;
};

module.exports = Library;
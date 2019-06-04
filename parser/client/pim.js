const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function PIM() {
  this.fixtureFile = 'client/pim.yml';
  this.loadCollection();
}

util.inherits(PIM, ClientAbstractParser);

PIM.prototype.parse = function(userAgent){
  let result = ClientAbstractParser.prototype.parse.call(this, [userAgent]);
  if (result) {
	result = Object.assign(result, {
	  type: CLIENT_TYPE.PIM
	});
	return result;
  }
};

module.exports = PIM;
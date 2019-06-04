const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function FeedReader() {
  this.fixtureFile = 'client/feed_readers.yml';
  this.loadCollection();
}

util.inherits(FeedReader, ClientAbstractParser);

FeedReader.prototype.parse = function(userAgent){
  let result = ClientAbstractParser.prototype.parse.call(this, [userAgent]);
  if (result) {
    result = Object.assign(result, {
      type: CLIENT_TYPE.FEED_READER
	});
    return result;
  }
  return null;
};

module.exports = FeedReader;
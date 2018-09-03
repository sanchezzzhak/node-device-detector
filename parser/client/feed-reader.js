const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function FeedReader() {
  this.fixtureFile = 'client/feed_readers.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(FeedReader, ClientAbstractParser);

FeedReader.prototype.parse = function(userAgent){

  if (ClientAbstractParser.prototype.parse.call(this, [userAgent])) {
    this.type = CLIENT_TYPE.FEED_READER;
    return true;
  }
  return false
};

module.exports = FeedReader;
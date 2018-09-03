const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function MediaPlayer() {
  this.fixtureFile = 'client/mediaplayers.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(MediaPlayer, ClientAbstractParser);


MediaPlayer.prototype.parse = function(userAgent){

  if (ClientAbstractParser.prototype.parse.call(this, [userAgent])) {
    this.type = CLIENT_TYPE.MEDIA_PLAYER;
    return true;
  }
  return false
};

module.exports = MediaPlayer;
const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function MediaPlayer() {
  this.fixtureFile = 'client/mediaplayers.yml';
  this.loadCollection();
}

util.inherits(MediaPlayer, ClientAbstractParser);

MediaPlayer.prototype.parse = function(userAgent){
  let result = ClientAbstractParser.prototype.parse.call(this, [userAgent]);
  if (result) {
	result = Object.assign(result, {
	  type: CLIENT_TYPE.MEDIA_PLAYER
	});
	return result;
  }
  return null;
};

module.exports = MediaPlayer;
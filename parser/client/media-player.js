const ClientAbstractParser = require('./../client-abstract-parser');

const CLIENT_TYPE = require('./../const/client-type');

class MediaPlayer extends ClientAbstractParser {
  constructor() {
    super();
    this.fixtureFile = 'client/mediaplayers.yml';
    this.loadCollection();
  }

  /**
   * @param {string} userAgent
   * @returns {({name: (string|*), type: string, version: string} & {type: string})|null}
   */
  parse(userAgent) {
    let result = super.parse(userAgent);
    if (result) {
      result = Object.assign(result, {
        type: CLIENT_TYPE.MEDIA_PLAYER,
      });
      return result;
    }
    return null;
  }
}

module.exports = MediaPlayer;

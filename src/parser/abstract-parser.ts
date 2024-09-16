import * as helper from './helper';

const BASE_REGEXES_DIR = __dirname + '/../regexes/';

/**
 * @param {string} result
 * @return {string}
 */
function fixStringName(result) {
  return result.replace(new RegExp('_', 'g'), ' ')
      .replace(/ TD$/i, '');
}

/**
 * @param {string} result
 * @return {string}
 */
function fixStringVersion(result) {
  result = result.replace(new RegExp('_', 'g'), '.');
  result = result.replace(new RegExp('[.]$', 'g'), '');
  return result.trim();
}

const collectionMap = {};

export class AbstractParser {

  public fixtureFile: string|null;
  public versionTruncation: number|null;
  public type: string;
  public maxUserAgentSize: number| null;
  public collectionLength: number| null;

  get collection() {
    if (!this.hasLoadCollection()) {
      return null;
    }
    return collectionMap[this.fixtureFile];
  }

  hasLoadCollection() {
    return collectionMap[this.fixtureFile] !== void 0
  }

  /**
   * load collection
   */
  loadCollection() {
    if (!this.hasLoadCollection()) {
      collectionMap[this.fixtureFile] = this.loadYMLFile(this.fixtureFile);
    }
  }

  /**
   * load yaml file
   * @param {string} file
   * @returns {*}
   */
  loadYMLFile(file) {
    return helper.loadYMLFile(BASE_REGEXES_DIR + file);
  }

  /**
   * A special method that overwrites placeholders in a string
   * @param {string} item
   * @param {array} matches
   * @return {string|*}
   */
  buildByMatch(item, matches) {
    item = item || '';
    item = item.toString();
    return helper.matchReplace(item, matches)
  }

  /**
   * helper prepare base regExp + part regExp
   * @param {string} str
   * @return {RegExp}
   */
  getBaseRegExp(str) {
    str = str.replace(new RegExp('/', 'g'), '\\/');
    str = str.replace(new RegExp('\\+\\+', 'g'), '+');
    str = '(?:^|[^A-Z0-9_-]|[^A-Z0-9-]_|sprd-|MZ-)(?:' + str + ')';
    return new RegExp(str, 'i');
  }

  /**
   * @param {string} model
   * @param matches
   * @return {*}
   */
  buildModel(model, matches) {
    model = fixStringName(this.buildByMatch(model, matches));
    return model === 'Build' ? null : model;
  }

  /**
   * Set the number of characters in the version where number is the number of characters +1
   * There is a line string version 1.2.3.4.555
   * If you set 0 we get version 1, if 2 we get 1.2.3 and so on.
   * @param {number|null} num
   */
  setVersionTruncation(num: number|null) {
    this.versionTruncation = num;
  }

  /**
   * Set string size limit for the useragent
   * @param {number} size
   */
  setMaxUserAgentSize(size: number) {
    this.maxUserAgentSize = size;
  }

  /**
   * Prepare user agent for restrict rules
   * @param {string|*} userAgent
   * @returns {string|*}
   */
  prepareUserAgent(userAgent: string): string {
    const size = this.maxUserAgentSize;
    if (userAgent && size  && size < userAgent.length) {
      return String(userAgent.substr(0, size));
    }
    return userAgent;
  }

  /**
   * @param {string|number} version
   * @param {array} matches
   * @return {string}
   */
  buildVersion(version: string|number, matches: Array<string|number>): string {
    version = fixStringVersion(this.buildByMatch(version, matches));
    const skipVersion = ['Portable', ''];
    if (skipVersion.indexOf(<string>version) !== -1) {
      return '' + version;
    }
    return helper.versionTruncate(version, this.versionTruncation);
  }
}


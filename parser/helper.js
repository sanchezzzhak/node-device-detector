const YAML = require('js-yaml');
const fs = require('fs');

exports.matchUserAgent = function (str, userAgent) {
  str = str.replace(new RegExp('/', 'g'), '\\/');
  let regex = '(?:^|[^A-Z_-])(?:' + str + ')';
  let match = new RegExp(regex, 'i');
  return match.exec(userAgent);
};

exports.versionCompare = function (ver1, ver2) {
  if (ver1 === ver2) {
    return 0;
  }
  let left = ver1.split('.');
  let right = ver2.split('.');
  let len = Math.min(left.length, right.length);
  for (let i = 0; i < len; i++) {
    if (parseInt(left[i]) > parseInt(right[i])) {
      return 1;
    }
    if (parseInt(left[i]) < parseInt(right[i])) {
      return -1;
    }
  }
  if (left.length > right.length) {
    return 1;
  }
  if (left.length < right.length) {
    return -1;
  }
  return 0;
};

/**
 * @param {string} version
 * @param {number} maxMinorParts - how many version chars trim
 * @returns {string}
 */
exports.versionTruncate = function (version, maxMinorParts) {
  let versionParts = String(version).split('.');
  if (
    maxMinorParts !== null &&
    maxMinorParts !== '' &&
    versionParts.length > maxMinorParts
  ) {
    versionParts = versionParts.slice(0, 1 + maxMinorParts);
  }
  return versionParts.join('.');
};

/**
 * @param {string} userAgent
 * @returns {boolean}
 */
exports.hasAndroidTableFragment = function (userAgent) {
  return (
    this.matchUserAgent('Android( [\\.0-9]+)?; Tablet', userAgent) !== null
  );
};

/**
 * @param {string} userAgent
 * @returns {boolean}
 */
exports.hasOperaTableFragment = function (userAgent) {
  return this.matchUserAgent('Opera Tablet', userAgent) !== null;
};

/**
 * @param {string} userAgent
 * @returns {boolean}
 */
exports.hasTouchFragment = function (userAgent) {
  return this.matchUserAgent('Touch', userAgent) !== null;
};

/**
 * @param {string} userAgent
 * @returns {boolean}
 */
exports.hasAndroidMobileFragment = function (userAgent) {
  return this.matchUserAgent('Android( [.0-9]+)?; Mobile;', userAgent) !== null;
};

/**
 * All devices running Opera TV Store are assumed to be a tv
 * @param {string} userAgent
 * @returns {boolean}
 */
exports.hasOperaTVStoreFragment = function (userAgent) {
  return this.matchUserAgent('Opera TV Store', userAgent) !== null;
};

/**
 * All devices running Tizen TV or SmartTV are assumed to be a tv
 * @param {string} userAgent
 * @returns {boolean}
 */
exports.hasTVFragment = function (userAgent) {
  return this.matchUserAgent('SmartTV|Tizen.+ TV .+$', userAgent) !== null;
};

/**
 * Check combinations in string that relate only to desktop UA
 * @param {string} userAgent
 * @returns {boolean}
 */
exports.hasDesktopFragment = function (userAgent) {
  return this.matchUserAgent('Desktop (x(?:32|64)|WOW64);', userAgent) !== null;
};

/**
 * @param {object} options
 * @param {string }propName
 * @param {*} defaultValue
 * @return {*|null}
 */
exports.getPropertyValue = function (options, propName, defaultValue) {
  return options !== void 0 && options[propName] !== void 0
    ? options[propName]
    : defaultValue !== void 0
    ? defaultValue
    : null;
};

/**
 *
 * @param {*} obj -
 * @returns {*}
 */
exports.revertObject = function (obj) {
  return Object.assign(
    {},
    ...Object.entries(obj).map(([a, b]) => ({
      [b]: a,
    })),
    {}
  );
};

/**
 * Load yaml file (sync read)
 * @param {string} file - absolute file path
 * @returns {*}
 */
exports.loadYMLFile = function (file) {
  return YAML.load(fs.readFileSync(file));
};

exports.hasFile = function (file) {
  return fs.existsSync(file);
};

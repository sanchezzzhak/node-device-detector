exports.matchUserAgent = function (str, userAgent) {
  str = str.replace(new RegExp('/', 'g'), '\\/');
  let regex = '(?:^|[^A-Z_-])(?:' + str + ')';
  let match = new RegExp(str, 'i');
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

exports.hasAndroidTableFragment = function (userAgent) {
  return (
    this.matchUserAgent('Android( [\\.0-9]+)?; Tablet', userAgent) !== null
  );
};

exports.hasOperaTableFragment = function (userAgent) {
  return this.matchUserAgent('Opera Tablet', userAgent) !== null;
};

exports.hasTouchFragment = function (userAgent) {
  return this.matchUserAgent('Touch', userAgent) !== null;
};

exports.hasAndroidMobileFragment = function (userAgent) {
  return this.matchUserAgent('Android( [.0-9]+)?; Mobile;', userAgent) !== null;
};

/**
 * All devices running Opera TV Store are assumed to be a tv
 * @param userAgent
 * @returns {boolean}
 */
exports.hasOperaTVStoreFragment = function (userAgent) {
  return this.matchUserAgent('Opera TV Store', userAgent) !== null;
};

/**
 * All devices running Tizen TV or SmartTV are assumed to be a tv
 * @param userAgent
 * @returns {boolean}
 */
exports.hasTVFragment = function (userAgent) {
  return this.matchUserAgent('SmartTV|Tizen.+ TV .+$', userAgent) !== null;
};

/**
 * @param userAgent
 * @returns {boolean}
 */
exports.hasDesktopFragment = function (userAgent) {
  return this.matchUserAgent('Desktop (x(?:32|64)|WOW64);', userAgent) !== null;
};

/**
 * @param options
 * @param propName
 * @param defaultValue
 * @return {*|null}
 */
exports.getPropertyValue = function (options, propName, defaultValue) {
  return options !== undefined && options[propName] !== undefined
    ? options[propName]
    : defaultValue !== undefined
    ? defaultValue
    : null;
};

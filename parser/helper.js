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
  let left = ver1.split(".");
  let right = ver2.split(".");
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


exports.hasAndroidTableFragment = function (userAgent) {
  return this.matchUserAgent('Android( [\\.0-9]+)?; Tablet', userAgent) !== null;
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

exports.hasOperaTVStoreFragment = function (userAgent) {
  return this.matchUserAgent('Opera TV Store', userAgent) !== null;
};

/**
* @param options
* @param propName
* @param defaultValue
* @return {*|null}
*/
exports.getPropertyValue = function(options, propName, defaultValue){
  return options !== undefined && options[propName] !==undefined
      ?  options[propName]
      : defaultValue !== undefined ? defaultValue : null;
};

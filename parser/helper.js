const YAML = require('js-yaml');
const fs = require('fs');

/**
 * restore original userAgent from clientHints object
 * @param {string} userAgent
 * @param {ResultClientHints} clientHints
 */
function restoreUserAgentFromClientHints(userAgent, clientHints) {
  if (!hasDeviceModelByClientHints(clientHints)) {
    return userAgent;
  }

  const deviceModel = clientHints.device.model;
  if (deviceModel === '') {
    return userAgent;
  }

  let newUserAgent = '' + userAgent;
  if (hasUserAgentClientHintsFragment(newUserAgent)) {
    const osHints = attr(clientHints, 'os', {});
    const osVersion = attr(osHints, 'version', '');
    newUserAgent = newUserAgent.replace(/(Android (?:10[.\d]*; K|1[1-5]))/,
      `Android ${osVersion !== '' ? osVersion : '10'}; ${deviceModel}`
    );
  }

  if (!hasDesktopFragment(newUserAgent)) {
    return newUserAgent;
  }

  newUserAgent = newUserAgent.replace(/(X11; Linux x86_64)/,
    `X11; Linux x86_64; ${deviceModel}`
  );

  return newUserAgent;
}


/**
 * match for base regex rule
 * @param str
 * @param userAgent
 * @returns {RegExpExecArray}
 */
function matchUserAgent(str, userAgent) {
  str = str.replace(new RegExp('/', 'g'), '\\/');
  let regex = '(?:^|[^A-Z_-])(?:' + str + ')';
  let match = new RegExp(regex, 'i');
  return match.exec(userAgent);
}

function matchReplace(template, matches) {
  let max = matches.length-1 || 1;
  if (template.indexOf('$') !== -1) {
    for (let nb = 1; nb <= max; nb++) {
      if (template.indexOf('$' + nb) === -1) {
        continue;
      }
      let replace = matches[nb] !== void 0 ? matches[nb] : '';
      template = template.replace(new RegExp('\\$' + nb, 'g'), replace);
    }
  }
  return template;
}

/**
 * @param {string|null} val1
 * @param {string|null} val2
 * @return {boolean}
 */
function fuzzyCompare(val1, val2) {
  return val1 !== null && val2 !== null &&
    val1.replace(/ /gi, '').toLowerCase() ===
    val2.replace(/ /gi, '').toLowerCase();
}

/**
 * @param {number|string} value1
 * @param {number|string} value2
 * @param {number} num
 * @return {boolean}
 */
function fuzzyCompareNumber(value1, value2, num = 3) {
  return parseFloat(value1).toFixed(num) === parseFloat(value2).toFixed(num);
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {boolean}
 */
function fuzzyBetweenNumber(value, min, max) {
  return value >= min && value <= max;
}

/**
 * @param {string} str
 * @return {string}
 */
function createHash(str) {
  let hash = 0, i = 0, len = str.length;
  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
  }
  return hash.toString(16);
}

/**
 * Compare versions
 * @param {string} ver1
 * @param {string} ver2
 * @return {number}
 */
function versionCompare(ver1, ver2) {
  if (ver1 === ver2) {
    return 0;
  }
  let left = ver1.split('.');
  let right = ver2.split('.');
  let len = Math.min(left.length, right.length);
  for (let i = 0; i < len; i++) {
    if (left[i] === right[i]) {
      continue;
    }
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
}

/**
 * @param {string} version
 * @param {*} maxMinorParts - how many version chars trim
 * @returns {string}
 */
function versionTruncate(version, maxMinorParts) {
  let versionParts = String(version).split('.');
  if (
    maxMinorParts !== null &&
    maxMinorParts !== '' &&
    versionParts.length > maxMinorParts
  ) {
    versionParts = versionParts.slice(0, 1 + maxMinorParts);
  }
  return versionParts.join('.');
}

/**
 * @param {string} userAgent
 * @return {boolean}
 */
function hasAndroidTableFragment(userAgent) {
  return (
    matchUserAgent('Android( [.0-9]+)?; Tablet;|Tablet(?! PC)|.*-tablet$', userAgent) !== null
  );
}

/**
 * @param {string} userAgent
 * @return {boolean}
 */
function hasOperaTableFragment(userAgent) {
  return matchUserAgent('Opera Tablet', userAgent) !== null;
}

/**
 * Checks for the presence of a string in the UATouch
 * @param {string} userAgent
 * @returns {boolean}
 */
function hasTouchFragment(userAgent) {
  return matchUserAgent('Touch', userAgent) !== null;
}

function hasVRFragment(userAgent) {
  return matchUserAgent('Android( [.0-9]+)?; Mobile VR;| VR ', userAgent) !== null
}

/**
 * @param {string} userAgent
 * @returns {boolean}
 */
function hasAndroidMobileFragment(userAgent) {
  return matchUserAgent('Android( [.0-9]+)?; Mobile;|.*-mobile$', userAgent) !== null;
}

/**
 * All devices running Opera TV Store are assumed to be a tv
 * @param {string} userAgent
 * @return {boolean}
 */
function hasOperaTVStoreFragment(userAgent) {
  return matchUserAgent('Opera TV Store| OMI/', userAgent) !== null;
}

/**
 * All devices running Puffin Secure Browser that contain letter 'D' are assumed to be desktops
 * @param {string} userAgent
 * @return {boolean}
 */
function hasPuffinDesktopFragment(userAgent) {
  return matchUserAgent('Puffin/(?:\\d+[.\\d]+)[LMW]D', userAgent) !== null
}

/**
 * All devices running Puffin Web Browser that contain letter 'P' are assumed to be smartphones
 * @param {string} userAgent
 * @return {boolean}
 */
function hasPuffinSmartphoneFragment(userAgent) {
  return matchUserAgent('Puffin/(?:\\d+[.\\d]+)[AIFLW]P', userAgent) !== null
}

/**
 * All devices running Puffin Web Browser that contain letter 'T' are assumed to be tablets
 * @param {string} userAgent
 * @return {boolean}
 */
function hasPuffinTabletFragment(userAgent) {
  return matchUserAgent('Puffin/(?:\\d+[.\\d]+)[AILW]T', userAgent) !== null
}
/**
 * All devices containing TV fragment are assumed to be a tv
 * @param {string} userAgent
 * @return {boolean}
 */
function hasAndroidTVFragment(userAgent) {
  return matchUserAgent(
      'Andr0id|(?:Android(?: UHD)?|Google) TV|[(]lite[)] TV|BRAVIA|[(]TV;| TV$',
      userAgent
  ) !== null;
}

/**
 * All devices running Tizen TV or SmartTV are assumed to be a tv
 * @param {string} userAgent
 * @returns {boolean}
 */
function hasTVFragment(userAgent) {
  return matchUserAgent('SmartTV|Tizen.+ TV .+$', userAgent) !== null;
}

/**
 * Check combinations in string that relate only to desktop UA
 * @param {string} userAgent
 * @returns {boolean}
 */
function hasDesktopFragment(userAgent) {
  const DESKTOP_PATTERN = '(?:Windows (?:NT|IoT)|X11; Linux x86_64)';
  const DESKTOP_EXCLUDE_PATTERN = [
    'CE-HTML',
    ' Mozilla/|Andr[o0]id|Tablet|Mobile|iPhone|Windows Phone|ricoh|OculusBrowser',
    'PicoBrowser|Lenovo|compatible; MSIE|Trident/|Tesla/|XBOX|FBMD/|ARM; ?([^)]+)',
  ].join('|');

  return matchUserAgent(DESKTOP_PATTERN, userAgent) !== null &&
    !matchUserAgent(DESKTOP_EXCLUDE_PATTERN, userAgent) !== null;
}


/**
 * Check combinations is string that UserAgent ClientHints
 * @param {string} userAgent
 * @return {boolean}
 */
function hasUserAgentClientHintsFragment(userAgent) {
  return /Android (?:10[.\d]*; K(?: Build\/|[;)])|1[1-5]\)) AppleWebKit/i.test(userAgent);
}

/**
 *
 * @param {ResultClientHints|*} clientHints
 * @return {boolean}
 */
function hasDeviceModelByClientHints(clientHints) {
  return clientHints && clientHints.device && clientHints.device.model;
}

/**
 * @param {string} name
 * @return {boolean}
 */
function hasDeviceModelWrong (name) {
  return !!(name === '' || ['LeafOS on ARM64'].includes(name));
}

/**
 * Get value by attribute for object or default value
 * @param {object} options
 * @param {string }propName
 * @param {*} defaultValue
 * @return {*|null}
 */
function attr(options, propName, defaultValue) {
  return options !== void 0 && options[propName] !== void 0
    ? options[propName]
    : defaultValue !== void 0
      ? defaultValue
      : null;
}

/**
 * Values become keys, and keys become values
 * @param {*} obj -
 * @returns {*}
 */
function revertObject(obj) {
  return Object.assign(
    {},
    ...Object.entries(obj).map(([a, b]) => ({
      [b]: a,
    })),
    {},
  );
}

/**
 * Load yaml file (sync read)
 * @param {string} file - absolute file path
 * @returns {*}
 */
function loadYMLFile(file) {
  return YAML.load(fs.readFileSync(file));
}

function hasFile(file) {
  return fs.existsSync(file);
}

/**
 * Remove chars for string
 * @param {string} str
 * @param {string} chars
 * @returns {any}
 */
function trimChars(str, chars) {
  let start = 0,
    end = str.length;
  
  while (start < end && str[start] === chars)
    ++start;
  
  while (end > start && str[end - 1] === chars)
    --end;
  
  return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

function getGroupForUserAgentTokens(tokens) {
  let groupIndex = 0;
  return tokens.reduce((group = {}, token) => {
    if (token === '') {
      return;
    }
    let data = token.match(/^\((.*)\)$/);
    if (data !== null) {
      groupIndex++;
      group['#' + groupIndex] = data[1].split(/[;,] /);
      return group;
    }
    let rowSlash = token.split('/');
    if (rowSlash.length === 2) {
      group[rowSlash[0]] = rowSlash[1];
      return group;
    }
    groupIndex++;
    group['#' + groupIndex] = token;
    return group;
  }, {});
}

function getTokensForUserAgent(userAgent) {
  let tokenRegex = / (?![^(]*\))/i;
  return userAgent.split(tokenRegex);
}

/**
 * Split UserAgent to tokens and groups
 *
 * @param userAgent
 * @returns {{groups: *, userAgent: *, tokens: *}}
 */
function splitUserAgent(userAgent) {
  let tokens = getTokensForUserAgent(userAgent);
  let groups = getGroupForUserAgentTokens(tokens);

  let parts = [];
  for (let key in groups) {
    if (typeof groups[key] !== 'string' || !groups[key]) {
      continue;
    }

    if (key && String(key).charAt(0) === '#') {
      if (
        !groups[key].match(/[/;]/i) &&
        !groups[key].match(/^\s*[\d.]+/i)
      ) {
        parts.push(String(groups[key]).toLowerCase());
        continue;
      }
      continue;
    }
    
    parts.push(String(key).toLowerCase());
  }
  let hash = createHash(parts.join('.')).replace('-', '');
  let path = parts.join('.');
  return {tokens, groups, hash, path};
}


module.exports = {
  matchUserAgent,
  fuzzyCompare,
  fuzzyCompareNumber,
  fuzzyBetweenNumber,
  versionCompare,
  versionTruncate,
  hasVRFragment,
  hasAndroidTableFragment,
  hasOperaTableFragment,
  hasOperaTVStoreFragment,
  hasAndroidMobileFragment,
  hasAndroidTVFragment,
  hasDesktopFragment,
  hasUserAgentClientHintsFragment,
  hasDeviceModelByClientHints,
  hasTVFragment,
  hasTouchFragment,
  attr,
  revertObject,
  loadYMLFile,
  hasFile,
  trimChars,
  splitUserAgent,
  matchReplace,
  hasPuffinDesktopFragment,
  hasPuffinSmartphoneFragment,
  hasPuffinTabletFragment,
  hasDeviceModelWrong,
  restoreUserAgentFromClientHints
};
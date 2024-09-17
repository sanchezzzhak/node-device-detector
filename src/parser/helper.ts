import * as YAML from 'js-yaml';
import fs from 'fs';

export function getBaseRegexDir(): string {
  const baseDir = __dirname;
  if (/dist/.test(baseDir)) {
    return baseDir + '/../../../regexes/';
  }

  return baseDir + '/../../regexes/';
}


/**
 * match for base regex rule
 * @param str
 * @param userAgent
 * @returns {RegExpExecArray}
 */
export function matchUserAgent(str, userAgent) {
  str = str.replace(new RegExp('/', 'g'), '\\/');
  const regex = '(?:^|[^A-Z_-])(?:' + str + ')';
  const match = new RegExp(regex, 'i');
  return match.exec(userAgent);
}

export function matchReplace(template, matches) {
  const max = matches.length-1 || 1;
  if (template.indexOf('$') !== -1) {
    for (let nb = 1; nb <= max; nb++) {
      if (template.indexOf('$' + nb) === -1) {
        continue;
      }
      const replace = matches[nb] !== void 0 ? matches[nb] : '';
      template = template.replace(new RegExp('\\$' + nb, 'g'), replace);
    }
  }
  return template;
}

/**
 *
 * @param val1
 * @param val2
 * @returns {boolean}
 */
export function fuzzyCompare(val1, val2) {
  return val1 !== null && val2 !== null &&
    val1.replace(/ /gi, '').toLowerCase() ===
    val2.replace(/ /gi, '').toLowerCase();
}
export function fuzzyCompareNumber(value1, value2, num = 3) {
  return parseFloat(value1).toFixed(num) === parseFloat(value2).toFixed(num);
}

export function fuzzyBetweenNumber(value, min, max) {
  return value >= min && value <= max;
}

export function createHash(str) {
  let hash = 0, i = 0, len = str.length;
  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
  }
  return hash.toString(16);
}

/**
 * Compare versions
 * @param ver1
 * @param ver2
 * @returns {number}
 */
export function versionCompare(ver1, ver2) {
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
export function versionTruncate(version, maxMinorParts) {
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
 * @returns {boolean}
 */
export function hasAndroidTableFragment(userAgent) {
  return (
    matchUserAgent('Android( [.0-9]+)?; Tablet;|Tablet(?! PC)|.*-tablet$', userAgent) !== null
  );
}

/**
 * @param {string} userAgent
 * @returns {boolean}
 */
export function hasOperaTableFragment(userAgent) {
  return matchUserAgent('Opera Tablet', userAgent) !== null;
}

/**
 * Checks for the presence of a string in the UATouch
 * @param {string} userAgent
 * @returns {boolean}
 */
export function hasTouchFragment(userAgent) {
  return matchUserAgent('Touch', userAgent) !== null;
}

export function hasVRFragment(userAgent) {
  return matchUserAgent('Android( [.0-9]+)?; Mobile VR;| VR ', userAgent) !== null
}

/**
 * @param {string} userAgent
 * @returns {boolean}
 */
export function hasAndroidMobileFragment(userAgent) {
  return matchUserAgent('Android( [.0-9]+)?; Mobile;|.*-mobile$', userAgent) !== null;
}

/**
 * All devices running Opera TV Store are assumed to be a tv
 * @param {string} userAgent
 * @returns {boolean}
 */
export function hasOperaTVStoreFragment(userAgent) {
  return matchUserAgent('Opera TV Store| OMI/', userAgent) !== null;
}

/**
 * All devices containing TV fragment are assumed to be a tv
 * @param {string} userAgent
 * @returns {boolean}
 */
export function hasAndroidTVFragment(userAgent) {
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
export function hasTVFragment(userAgent) {
  return matchUserAgent('SmartTV|Tizen.+ TV .+$', userAgent) !== null;
}

/**
 * Check combinations in string that relate only to desktop UA
 * @param {string} userAgent
 * @returns {boolean}
 */
export function hasDesktopFragment(userAgent) {
  return matchUserAgent('Desktop(?: (x(?:32|64)|WOW64))?;', userAgent) !== null;
}

/**
 * Check combinations is string that UserAgent ClientHints
 * @param {string} userAgent
 * @return {boolean}
 */
export function hasUserAgentClientHintsFragment(userAgent) {
  return /Android 10[.\d]*; K(?: Build\/|[;)])/i.test(userAgent);
}

/**
 *
 * @param {ResultClientHints|*} clientHints
 * @return {boolean}
 */
export function hasDeviceModelByClientHints(clientHints) {
  return clientHints && clientHints.device && clientHints.device.model;
}

/**
 * Get value by attribute for object or default value
 * @param {object} options
 * @param {string }propName
 * @param {*} defaultValue
 * @return {*|null}
 */
export function attr(options, propName, defaultValue) {
  return options !== void 0 && options[propName] !== void 0
    ? options[propName]
    : defaultValue !== void 0
      ? defaultValue
      : null;
}

/**
 * Flip
 * Values become keys, and keys become values
 * @param {*} data
 * @returns {*}
 */
export function revertObject(data) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Object.fromEntries(
    Object
      .entries(data)
      .map(([key, value]) => [value, key])
  );
}

/**
 * Load yaml file (sync read)
 * @param {string} file - absolute file path
 * @returns {*}
 */
export function loadYMLFile(file) {
  return YAML.load(fs.readFileSync(file));
}

export function hasFile(file) {
  return fs.existsSync(file);
}

/**
 * Remove chars for string
 * @param {string} str
 * @param {string} chars
 * @returns {any}
 */
export function trimChars(str, chars) {
  let start = 0,
    end = str.length;
  
  while (start < end && str[start] === chars)
    ++start;
  
  while (end > start && str[end - 1] === chars)
    --end;
  
  return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

export function getGroupForUserAgentTokens(tokens) {
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

export function getTokensForUserAgent(userAgent) {
  let tokenRegex = / (?![^(]*\))/i;
  return userAgent.split(tokenRegex);
}

/**
 * Split UserAgent to tokens and groups
 *
 * @param userAgent
 * @returns {{groups: *, userAgent: *, tokens: *}}
 */
export function splitUserAgent(userAgent) {
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

  // console.log({tokens, groups, hash, path});


  return {tokens, groups, hash, path};
}
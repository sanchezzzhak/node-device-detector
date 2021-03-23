class DataPacker {
  static pack(obj, shortKeys) {
    let data = [];
    for (let key in shortKeys) {
      let value = DataPacker.get(obj, shortKeys[key]);
      data.push(`${key}=${value};`);
    }
    return data.join('');
  }

  static unpack(str, shortKeys) {
    let regex = /([a-z]{2})=([^;]+)?;/gi;
    let obj = {};
    let match = null;
    while ((match = regex.exec(str))) {
      let short = match[1];
      let value = match[2] !== void 0 ? match[2] : '';
      let path = shortKeys[short];
      DataPacker.set(obj, path, value, true);
    }
    return obj;
  }

  static getKey(key) {
    let intKey = parseInt(key);
    if (intKey.toString() === key) {
      return intKey;
    }
    return key;
  }

  static get(obj, path, defaultValue) {
    if (typeof path === 'number') {
      path = [path];
    }
    if (!path || path.length === 0) {
      return obj;
    }
    if (obj == null) {
      return defaultValue;
    }
    if (typeof path === 'string') {
      return DataPacker.get(obj, path.split('.'), defaultValue);
    }
    let currentPath = DataPacker.getKey(path[0]);
    let nextObj = obj[currentPath];
    if (nextObj === void 0) {
      return defaultValue;
    }
    if (path.length === 1) {
      return nextObj;
    }
    return DataPacker.get(obj[currentPath], path.slice(1), defaultValue);
  }

  static set(obj, path, value, doNotReplace) {
    if (typeof path === 'number') {
      path = [path];
    }
    if (!path || path.length === 0) {
      return obj;
    }
    if (typeof path === 'string') {
      return DataPacker.set(
        obj,
        path.split('.').map(DataPacker.getKey),
        value,
        doNotReplace
      );
    }
    let currentPath = path[0];
    let currentValue = obj[currentPath] !== void 0 ? obj[currentPath] : void 0;
    if (path.length === 1) {
      if (currentValue === void 0 || !doNotReplace) {
        obj[currentPath] = value;
      }
      return currentValue;
    }
    if (currentValue === void 0) {
      if (typeof path[1] === 'number') {
        obj[currentPath] = [];
      } else {
        obj[currentPath] = {};
      }
    }
    return DataPacker.set(obj[currentPath], path.slice(1), value, doNotReplace);
  }
}

module.exports = DataPacker;

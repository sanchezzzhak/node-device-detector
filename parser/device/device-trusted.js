const helper = require('../helper');
const attr = helper.getPropertyValue;

/**
 * check screen size
 * @param {string} deviceWidth
 * @param {string} deviceHeight
 * @param {string} metaWidth
 * @param {string} metaHeight
 * @return {boolean}
 */
const isDeviceSizeValid = (deviceWidth, deviceHeight, metaWidth, metaHeight) => {
  if (deviceWidth && deviceHeight && metaWidth && metaHeight) {
    const isWidthValid = helper.fuzzyCompareNumber(deviceWidth, metaWidth)
      && helper.fuzzyCompareNumber(deviceHeight, metaHeight);
    const isHeightValid = helper.fuzzyCompareNumber(deviceWidth, metaHeight)
      && helper.fuzzyCompareNumber(deviceHeight, metaWidth);

    if (!(isWidthValid || isHeightValid)) {
      return false;
    }
  }

  return true;
};

/**
 * normalization gpu name
 * @param {string} metaGPU
 * @return {string}
 */
const extractGpuName = (metaGPU) => {
  if (!metaGPU) {
    return metaGPU
  }

  const gpuMap = [
    { regex: /Adreno \(TM\) ([^$,]+)/i, name: 'Qualcomm Adreno $1' },
    { regex: /Mali-([^$,]+)/i, name: 'ARM Mali-$1' },
    { regex: /PowerVR Rogue ([^$,]+)/i, name: 'PowerVR $1' }
  ];

  for (let i = 0, l = gpuMap.length; i < l; i++) {
    let matches = gpuMap[i].regex.exec(metaGPU);
    if (matches !== null) {
      return helper.matchReplace(matches, gpuMap[i].name);
    }
  }

  return metaGPU;
};

class DeviceTrusted {

  /**
   * @param {ResultDeviceInfo} deviceInfo
   * @param {ResultOs} osData
   * @param {ResultClient} clientData
   * @param {ResultDevice}  deviceData
   * @param clientHints
   * @return {boolean|null}
   */
  static check(deviceInfo, osData, clientData, deviceData, clientHints) {
    // is Apple and lack of client-hints
    if (deviceData.brand === 'Apple' && clientHints.client.brands.length > 0) {
      return false;
    }
    // is Apple and check correct gpu name
    if (deviceData.brand === 'Apple' && clientHints.meta && clientHints.meta.gpu && /GPU Apple/i.test(clientHints.meta.gpu)) {
      return false;
    }
    // is deviceInfo result
    if (deviceInfo) {
      let deviceWidth = attr(deviceInfo, 'display.width', null);
      let deviceHeight = attr(deviceInfo, 'display.height', null);
      let metaWidth = attr(clientHints.meta, 'width', null);
      let metaHeight = attr(clientHints.meta, 'height', null);

      let deviceGPU = attr(deviceInfo, 'hardware.gpu.name', null);
      let metaGPU = attr(clientHints.meta, 'gpu', null);
      let gpuName = extractGpuName(metaGPU);

      if (!isDeviceSizeValid(deviceWidth, deviceHeight, metaWidth, metaHeight)) {
        return false;
      }
      if (deviceGPU && gpuName && deviceGPU !== gpuName) {
        return false;
      }

      return true;
    }

    return null;
  }
}

module.exports = DeviceTrusted;
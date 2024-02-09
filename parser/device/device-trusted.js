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

    return (isWidthValid || isHeightValid);
  }

  return true;
};

const isDeviceGpuValid = (gpuName, metaGpu) => {
  let gpuMetaName = extractGpuName(metaGpu);
  if (gpuMetaName && gpuName) {
    return gpuName.includes(gpuMetaName);
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
    return metaGPU;
  }

  const gpuMap = [
    { regex: /Adreno \(TM\) ([^$,]+)/i, name: 'Qualcomm Adreno $1' },
    { regex: /Mali-([^$,]+)/i, name: 'ARM Mali-$1' },
    { regex: /PowerVR Rogue ([^$,]+)/i, name: 'PowerVR $1' }
  ];

  for (let i = 0, l = gpuMap.length; i < l; i++) {
    let matches = gpuMap[i].regex.exec(metaGPU);
    if (matches !== null) {
      return helper.matchReplace(gpuMap[i].name, matches);
    }
  }

  return metaGPU;
};

class DeviceTrusted {

  /**
   * @param {ResultOs} osData
   * @param {ResultClient} clientData
   * @param {ResultDevice}  deviceData
   * @param clientHints
   * @return {boolean|null}
   */
  static check(osData, clientData, deviceData, clientHints) {

    const AppleGpuRegex = /GPU Apple/i;
    const hasGpuExist = clientHints.meta && clientHints.meta.gpu && clientHints.meta.gpu.length > 0;

    // is Apple and lack of client-hints
    if (deviceData.brand === 'Apple' && clientHints.client.brands.length > 0) {
      return false;
    }
    // is Apple and check correct gpu name
    if (deviceData.brand === 'Apple' && hasGpuExist && !AppleGpuRegex.test(clientHints.meta.gpu)) {
      return false;
    } else if (deviceData.brand === 'Apple' && hasGpuExist && AppleGpuRegex.test(clientHints.meta.gpu)) {
      return true;
    }

    // is deviceInfo result
    let deviceInfo = deviceData.info;
    if (deviceInfo) {
      let deviceWidth;
      let deviceHeight;

      if (deviceInfo.display && typeof deviceInfo.display.resolution === 'string') {
        let resolution = deviceInfo.display.resolution.split('x');
        deviceWidth = resolution[0];
        deviceHeight = resolution[1];
      } else {
        deviceWidth = deviceInfo.display && deviceInfo.display.resolution.width
          ? deviceInfo.display.resolution.width
          : null;
        deviceHeight = deviceInfo.display && deviceInfo.display.resolution.height
          ? deviceInfo.display.resolution.height
          : null;
      }




      let metaWidth = attr(clientHints.meta, 'width', null);
      let metaHeight = attr(clientHints.meta, 'height', null);

      let deviceGPU = deviceInfo.hardware && deviceInfo.hardware.gpu
        ? deviceInfo.hardware.gpu.name
        : null;

      let metaGPU = attr(clientHints.meta, 'gpu', null);
      if (!isDeviceSizeValid(deviceWidth, deviceHeight, metaWidth, metaHeight)) {
        return false;
      }

      if (!isDeviceGpuValid(deviceGPU, metaGPU)) {
        return false;
      }

      return true;
    }

    return null;
  }
}

module.exports = DeviceTrusted;
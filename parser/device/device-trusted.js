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
    const minMetaWidth = parseInt(metaWidth) - 1;
    const maxMetaWidth = parseInt(metaWidth) + 1;
    const minMetaHeight = parseInt(metaHeight) - 1;
    const maxMetaHeight = parseInt(metaHeight) + 1;

    const isWidthValid = helper.fuzzyBetweenNumber(parseInt(deviceWidth), minMetaWidth, maxMetaWidth)
      && helper.fuzzyBetweenNumber(parseInt(deviceHeight), minMetaHeight, maxMetaHeight);

    const isHeightValid = helper.fuzzyBetweenNumber(parseInt(deviceWidth), minMetaHeight, maxMetaHeight)
      && helper.fuzzyBetweenNumber(parseInt(deviceHeight), minMetaWidth, maxMetaWidth);

    return (isWidthValid || isHeightValid);
  }

  return true;
};

const isDeviceGpuValid = (gpuName, metaGpu) => {
  let gpuMetaName = extractGpuName(metaGpu);
  if (gpuMetaName && gpuName) {
    return gpuName.includes(gpuMetaName) || gpuMetaName.includes(gpuName);
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


/**
 * @param {ResultDevice} deviceData
 * @param {Object} clientHints
 * @return {boolean}
 */
const checkDisplaySize = (deviceData, clientHints) => {
  let deviceWidth;
  let deviceHeight;
  let deviceInfo = deviceData.info;

  if (deviceInfo) {
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

    if (!isDeviceSizeValid(deviceWidth, deviceHeight, metaWidth, metaHeight)) {
      return false;
    }
  }
  return true;
};

const isGpuExistForClientHints = (clientHints) => {
  return clientHints.meta && clientHints.meta.gpu && clientHints.meta.gpu.length > 0;
}

const isAppleBrandForDeviceData = (deviceData) => {
  return deviceData.brand === 'Apple'
    || (deviceData.brand === '' && /ip(?:hone|[ao]d)/i.test(deviceData.code))
};

/**
 * @param {ResultDevice} deviceData
 * @param {Object} clientHints
 * @return {boolean}
 */
const checkGpu = (deviceData, clientHints) => {
  let deviceInfo = deviceData.info;
  let deviceGPU = deviceInfo && deviceInfo.hardware && deviceInfo.hardware.gpu
    ? deviceInfo.hardware.gpu.name
    : null;

  let metaGPU = attr(clientHints.meta, 'gpu', null);

  if (metaGPU === 'PowerVR SGX Doma') {
    metaGPU = 'PowerVR GE8320';
  }

  if (metaGPU !== null && deviceGPU !== null) {
    return isDeviceGpuValid(deviceGPU, metaGPU)
  }

  return true;
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

    const regexAppleGpu = /GPU Apple/i;
    const isGpuExist = isGpuExistForClientHints(clientHints);
    const isAppleBrand = isAppleBrandForDeviceData(deviceData);

    // is Apple and lack of client-hints
    if (isAppleBrand && clientHints.client.brands.length > 0) {
      return false;
    }
    // is Apple and check correct gpu name
    if (isAppleBrand && isGpuExist && !regexAppleGpu.test(clientHints.meta.gpu)) {
      return false;
    } else if (isAppleBrand && isGpuExist && regexAppleGpu.test(clientHints.meta.gpu)) {
      return true;
    }

    if (deviceData.info) {
      // check for display size
      if (!checkDisplaySize(deviceData, clientHints)) {
        return false;
      }
      // check for gpu name
      if (!checkGpu(deviceData, clientHints)) {
        return false;
      }

      return true;
    }

    return null;
  }
}

module.exports = DeviceTrusted;
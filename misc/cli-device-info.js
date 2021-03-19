
const DeviceInfo = require('../parser/device/info-device');
const deviceInfo = new DeviceInfo;
deviceInfo.setResolutionConvertObject(true);
deviceInfo.setSizeConvertObject(true);

let brand = process.argv[2];
let model = process.argv[3];


console.log({
  "brand": brand,
  "model": model,
  "result": deviceInfo.info(brand, model)
});


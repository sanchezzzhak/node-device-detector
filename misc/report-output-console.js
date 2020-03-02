const readline = require('readline');
const DeviceDetector = require('../index');
const detector = new DeviceDetector;

const Brands = Object.keys(detector.deviceParserList['Mobile']['collection']);

Brands.sort((a, b) => {
  return String(a).localeCompare(String(b), 'en', {sensitivity: 'base'});
});


console.log('Support detect device list (%s): ', Brands.length);
console.log(
  Brands.join(', ')
);

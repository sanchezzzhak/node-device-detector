const Benchmark = require('benchmark');
const DeviceDetector = require('../index');

const suite = new Benchmark.Suite();
const detector = new DeviceDetector();

const useragent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36'
// warming up indexes, first boot takes timeя
detector.getBrandsByDeviceCode('tests');


const experiment = (name, fn) => {
  suite.add(name, {minSamples: 100, fn });
};
experiment('EnableDeviceIndexes ', function () {
  detector.deviceIndexes = true;
  let result = detector.detect(useragent);
});

experiment('DiscardDeviceIndexes', function () {
  detector.deviceIndexes = false;
  let result = detector.detect(useragent);
});

console.log('Test by', useragent);

// add listeners
suite
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ async: false });

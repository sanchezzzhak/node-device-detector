const Benchmark = require('benchmark');
const DeviceDetector = require('../index');

const suite = new Benchmark.Suite();
const detector = new DeviceDetector();

const random = (array) => {
  return array[~~(array.length * Math.random())];
};

const userAgents = [
  'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 7.1.2; E6810) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.76 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 4.4.4; Qin 1s+ Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36',
];

const useragent = random(userAgents);

suite.add('EnableDeviceIndexes ', function () {
  detector.discardDeviceIndexes = false;
  let result = detector.detect(useragent);
});

suite.add('DiscardDeviceIndexes', function () {
  detector.discardDeviceIndexes = true;
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

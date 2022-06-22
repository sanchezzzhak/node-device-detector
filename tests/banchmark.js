const Benchmark = require('benchmark');
const DeviceDetector = require('../index');

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
});

const useragent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';

console.log('Test by', useragent);



const suite = new Benchmark.Suite;
// add listeners
suite.on('cycle', function(event) {
  console.log(String(event.target));
})

suite.add('device EnableIndexes', function() {
  return detector.parseDevice(useragent, {});
}, {
  'onStart': () => {
    detector.deviceIndexes = true;
    detector.clientIndexes = true;
  },
})

suite.add('device DisableIndexes', function() {
  return detector.parseDevice(useragent, {});
}, {
  'onStart': () => {
    detector.deviceIndexes = false;
    detector.clientIndexes = false;
  },
});


suite.add('client EnableIndexes', function() {
  return detector.parseClient(useragent, {});
}, {
  'onStart': () => {
    detector.clientIndexes = true;
  },
})

suite.add('client DisableIndexes', function() {
  return detector.parseClient(useragent, {});
}, {
  'onStart': () => {
    detector.clientIndexes = false;
  },
})

suite.add('parse os', function() {
  return detector.parseOS(useragent, {});
}, {
  'onStart': () => {
    detector.clientIndexes = false;
    detector.deviceIndexes = false;
  },
})

// run async
suite.run({async: true, queued: true});

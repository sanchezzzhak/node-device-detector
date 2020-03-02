const Benchmark = require('benchmark');
const DeviceDetector = require('../index');

const suite = new Benchmark.Suite;
const detector = new DeviceDetector();

const userAgents = [
  'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 7.1.2; E6810) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.76 Mobile Safari/537.36',
];

userAgents.forEach((useragent, index) => {
  suite.add(index + '#test_useragent', function() {
	let result = detector.detect(useragent)
  })
});

// add listeners
suite.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });

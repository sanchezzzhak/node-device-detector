const Benchmark = require('benchmark');
const DeviceDetector = require('../index');

Benchmark.support.timeout = false;

const detector = new DeviceDetector({
  deviceIndexes: true,
  clientIndexes: true,
});

const createBenchmark = (useragent) => {
  console.log('UA', useragent);
  console.log('-----');
  const suite = new Benchmark.Suite;
// add listeners
  suite.on('cycle', function(event) {
    console.log(String(event.target));
  });

  suite.add('detector.parseDevice (deviceIndexes on)', function() {
    return detector.parseDevice(useragent, {});
  });

  suite.add('detector.parseClient (clientIndexes on)', function() {
    return detector.parseClient(useragent, {});
  });
  
  suite.add('detector.parseOS', function() {
    return detector.parseOs(useragent, {});
  });

  suite.add('detector.detect (indexes on)', function() {
    return detector.detect(useragent, {});
  });

  suite.run({async: false, queued: true});
  console.log('-----');
};

const datasetBenchmark = [
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; M2101K9AG Build/SKQ1.210908.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/102.0.5005.125 Mobile Safari/537.36 UCURSOS/v1.6_273-android',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 239.2.0.17.109 (iPhone9,3; iOS 15_5; it_IT; it-IT; scale=2.00; 750x1334; 376668393) NW/3',
  'Mozilla/5.0 (Linux; Android 8.0.0; RNE-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44',
];

datasetBenchmark.forEach((useragent) => {
  createBenchmark(useragent);
});

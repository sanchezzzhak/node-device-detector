const fs = require("fs");
const Benchmark = require('benchmark');
const DeviceDetector = require('../../index.js');
const {getFixtureFolder, YAMLLoad} = require("../functions");

Benchmark.support.timeout = false;

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
});


let excludeFilesNames = ['bots.yml', 'alias_devices.yml'];
let fixtureFolder = getFixtureFolder();
ymlDeviceFiles = fs.readdirSync(fixtureFolder + 'devices/');


const createBenchmark = (useragent) => {
  console.log('ua:', useragent);
  console.log('-----');
  const suite = new Benchmark.Suite;
// add listeners
  suite.on('cycle', function(event) {
    console.log(String(event.target));
  });
  suite.add('detector.parseDevice (deviceIndexes on)', function() {
    return detector.parseDevice(useragent, {});
  });
  suite.add('detector.detect (indexes on)', function() {
    return detector.detect(useragent, {});
  });
  suite.run({async: false, queued: true});
  console.log('-----');
};

ymlDeviceFiles.forEach((file) => {
  if (excludeFilesNames.indexOf(file) !== -1) {
    return;
  }
  console.log('------------------------');
  console.log('file:', file);
  console.log('------------------------');

  let fixtureData = YAMLLoad(fixtureFolder + 'devices/' + file);
  fixtureData.forEach((fixture) => {
    createBenchmark(fixture.user_agent)
  });
});
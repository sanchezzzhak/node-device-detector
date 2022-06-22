
const DeviceDetector = require('../index');

const detector = new DeviceDetector({deviceIndexes: true});

let lastCpuUsage;
const cpuUsage = () => {
  return lastCpuUsage = process.cpuUsage(lastCpuUsage);
}

const createTest = (testname, ua) => {
  console.time(testname);
  cpuUsage()
  const result = detector.detect(ua);
  console.timeEnd(testname);
  console.log(testname, ua);
  console.log(testname, cpuUsage())
  console.log('------')
}

const userAgent1 = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';

const userAgent2 = 'Mozilla/5.0 (Linux; Android 8.0.0; ATU-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 Mobile Safari/537.36';

const userAgent3 = 'Mozilla/5.0 (Linux; Android 4.2.2; Trooper_X40 Build/Trooper_X40) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36';

const userAgent4 = 'Mozilla/5.0 (Linux; U; Android 4.2.2; zh-CN; R831K Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/10.3.1.549 U3/0.8.0 Mobile Safari/534.30';

const userAgent5 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36';

cpuUsage();
/*
createTest('test1', userAgent1);
createTest('test2', userAgent1);
createTest('test3', userAgent2);
createTest('test4', userAgent3);
createTest('test5', userAgent4);
createTest('test6', userAgent1);
createTest('test7', userAgent5);
createTest('test8', userAgent1);
createTest('test9', userAgent5);*/
createTest('test10', userAgent5);

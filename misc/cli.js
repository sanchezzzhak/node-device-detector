const readline = require('readline');
const DeviceDetector =  require('../index');
const detector = new DeviceDetector;

function parse(userAgent){
  console.log({
    "userAgent" : userAgent,
    "parse": detector.detect(userAgent),
  });
}


if(process.argv.length > 2){
  parse(process.argv[2]);
}else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('user agent:', (userAgent) => {
    parse(userAgent);
    rl.close();
  });
}


const readline = require('readline');
const DeviceDetector =  require('../index');
const detector = new DeviceDetector({skipBotDetection: false});

function parse(useragent){
  console.log({
    "useragent" : useragent,
    "parse": detector.detect(useragent),
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


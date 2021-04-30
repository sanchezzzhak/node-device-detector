const readline = require('readline');
const DeviceDetector = require('../index');
const detector = new DeviceDetector({ skipBotDetection: false });
const YAML = require('js-yaml');

const formats = ['json', 'yml'];
const format =
  process.argv[3] !== void 0 && formats.indexOf(process.argv[3]) !== -1
    ? process.argv[3]
    : 'json';

function parse(useragent) {
  let result = { user_agent: useragent };
  result = Object.assign(result, detector.detect(useragent));

  if (format === 'yml') {
    console.log(YAML.dump([result], { indent: 2, lineWidth: Infinity }));
  }
  if (format === 'json') {
    console.log(result);
  }
}

if (process.argv.length > 2) {
  parse(process.argv[2]);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('user agent:', (userAgent) => {
    parse(userAgent);
    rl.close();
  });
}

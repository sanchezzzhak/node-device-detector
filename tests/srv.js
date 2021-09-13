const http = require('http');
const DeviceDetector = require('../index');

const deviceDetector = new DeviceDetector;
const port = 3001;
const timeout = 3e5;

// create middleware
const middlewareDetect = (req) => {
  const useragent = req.headers['user-agent'];

  req.useragent = useragent;
  req.device = deviceDetector.detect(useragent);
  req.bot = deviceDetector.parseBot(useragent);
};

const prettyPrintJson = (obj) => JSON.stringify(obj, null, 2);
// create server


const parseHeaders = (headers = {}) => {

  const cleanValue = (str) => {
	return str.replace(/^"/, '').replace(/"$/, '');
  }
  const getAttr = (headers, prop, defaultValue = '') => {
	return headers[prop] ? cleanValue(headers[prop]) : defaultValue;
  }
  let isSupport = headers['sec-ch-ua'] !== void 0;
  if (!isSupport) {
	return {};
  }

  let browserHeaders = getAttr(headers, 'sec-ch-ua').split(', ');
  let browserName = /"([^"]+)"/i.exec(browserHeaders[browserHeaders.length - 1])[1];
  let browserVersion = getAttr(headers, 'sec-ch-ua-full-version');
  let upgradeHeader = browserVersion === '';
  if (upgradeHeader) {
	return {
	  upgradeHeader,
	  client: {
		name: browserName,
	  }
	}
  }

  let osName = getAttr(headers, 'sec-ch-ua-platform');
  let osVersion = getAttr(headers, 'sec-ch-ua-platform-version');
  let platform = getAttr(headers, 'sec-ch-ua-arch');
  let isMobile = getAttr(headers, 'sec-ch-ua-mobile', '') === '?1';
  let deviceCode = getAttr(headers, 'sec-ch-ua-model', '');

  return {
	upgradeHeader,
	os: {
	  name: osName,
	  version: osVersion,
	  platform
	},
	client: {
	  name: browserName,
	  version: browserVersion
	},
	device: {
	  isMobile,
	  code: deviceCode
	}
  }
}

const server = http.createServer(function onRequest(req, res) {
  // attach middleware
  middlewareDetect(req);
  let headers = {
	'Accept-CH': 'Sec-CH-UA-Full-Version, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Model, Sec-CH-UA-Arch',
  };
  console.log(req.headers, req.rawHeaders)
  res.writeHead(200, headers)
  res.end("success" + prettyPrintJson(parseHeaders(req.headers)));


});
server.listen({port, timeout}, (err, result) => {
  console.log('server listen port %s', port);
})


Use in the native server
-
```js
const http = require('http');
const finalhandler = require('finalhandler'); // https://www.npmjs.com/package/finalhandler
const Router = require('router');  // https://www.npmjs.com/package/router
const DeviceDetector = require('node-device-detector');
const ClientHints = require('node-device-detector/client-hints');

const routerOpts = {}
const router = Router(routerOpts);
const deviceDetector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});
const clientHint = new ClientHints();
const port = 3001;
const timeout = 3e5;

// create middleware
const middlewareDetect = (req, res) => {
  const useragent = req.headers['user-agent']; 
  req.useragent = useragent;
  req.device = deviceDetector.detect(useragent);
  req.bot = deviceDetector.parseBot(useragent);
  req.hints = clientHint.parse(req.headers);
  
  res.writeHead(200, ClientHints.getHeaderClientHints())
};

const prettyPrintJson = (obj) => JSON.stringify(obj, null, 2);
// create server
const server = http.createServer(function onRequest(req, res) {
  // attach middleware
  middlewareDetect(req, res); 
  router(req, res, finalhandler(req, res));
});
server.listen({port, timeout}, (err, result) => {
  console.log('server listen port %s', port);
})
 
router.get('/', (req, res) => {
  let detectResult = req.device,
      botResult = req.bot;
    const body = prettyPrintJson({useragent, detectResult, botResult});
  res.end(
    '<html><body>Your Device: <br> <pre>' +
        body +
        '</pre></html></body>'
  );
});

```

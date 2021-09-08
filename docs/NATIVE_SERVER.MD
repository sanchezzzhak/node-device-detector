Use in the native server
-
```js
const http = require('http');
const finalhandler = require('finalhandler'); // https://www.npmjs.com/package/finalhandler
const Router = require('router');  // https://www.npmjs.com/package/router
const DeviceDetector = require('node-device-detector');

const routerOpts = {}
const router = Router(routerOpts);
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
const server = http.createServer(function onRequest(req, res) {
  // attach middleware
  middlewareDetect(req); 
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

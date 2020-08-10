Use in the native server
-
```js
import http from "http";
import finalhandler from "finalhandler"; // https://www.npmjs.com/package/finalhandler
import Router from "router";  // https://www.npmjs.com/package/router
import DeviceDetector from "node-device-detector";

const routerOpts = {}
const router = Router(routerOpts);
const detector = new DeviceDetector;
const port = 3001;
const timeout = 3e5;

const server = http.createServer(function onRequest(req, res) {
  router(req, res, finalhandler(req, res));
});
server.listen({port, timeout}, (err, result) => {
  console.log('server listen port %s', port);
})
  
router.get('/detect', (req, res) => {
  let useragent = req.headers['user-agent'];
  let deviceResult = detector.detect(useragent);
  let botResult = detector.parseBot(useragent);
  res.end(JSON.stringify({useragent, deviceResult, botResult}));
});

```

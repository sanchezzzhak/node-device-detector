Use in the [uWebSockets.js](https://github.com/uNetworking/uWebSockets.js) server
-
install packages

* `yarn add uWebSockets.js@uNetworking/uWebSockets.js#v19.3.0`
* `yarn add node-device-detector`

```js
const DeviceDetector = require('node-device-detector');
const UWS = require('uWebSockets.js');

const port = 3001;
// init detector
const deviceDetector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

const prettyPrintJson = (obj) => JSON.stringify(obj, null, 2);

const appTemplate = UWS.App({});
// router
appTemplate.get('/*', (res, req) => {
  const useragent = req.getHeader('user-agent');
  const detectResult = deviceDetector.detect(useragent);
  const botResult = deviceDetector.parseBot(useragent);
  const body = prettyPrintJson({useragent, detectResult, botResult});
  res.end(
    '<html><body>Your Device: <br> <pre>' +
    body +
    '</pre></html></body>'
  );
});

appTemplate.listen(port, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port %s', port);
  }
});
```
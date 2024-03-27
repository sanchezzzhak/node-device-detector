
This code is designed to receive client-hints on your page without additional page refresh

### small js lib for get clienthints and meta data devices

```js

export default function DeviceMeta() {
  let gl;
  if (!gl) {
    try {
      let canvas = document.createElement('canvas');
      gl = canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
    } catch (e) {}
  }
  let hints = {};
  if (navigator.userAgentData) {
    const fetchHints = [
      'brands',
      'mobile',
      'platform',
      'platformVersion',
      'architecture',
      'bitness',
      'wow64',
      'model',
      'uaFullVersion',
      'fullVersionList'];

    navigator.userAgentData.getHighEntropyValues(fetchHints).then((result) => {
      hints = JSON.parse(JSON.stringify(result));
    })
  }

  /** #################################
   *  private helper methods
   * ################################# */
  
  /**
   * get gpu name
   * @returns {string|null}
   */
  function getGPUName() {
    return gl
      ? gl.getParameter(gl.getExtension(
        'WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL)
      : null;
  }

  /**
   * get device pixel ratio
   */
  function getRatio() {
    return window.devicePixelRatio;
  }

  /**
   * get device width of the screen in pixels
   */
  function getWidth() {
    return window.screen.width * getRatio();
  }

  /**
   * get device height of the screen in pixels
   */
  function getHeight() {
    return window.screen.height * getRatio();
  }
  /**
   * get check is ua apply
   * @return {boolean}
   */
  function isAppleFamily() {
    return /iPhone|iPad|Macintosh|Ipod/.exec(navigator.userAgent) !== null;
  }

  /**
   * get timer stamp
   * @return {DOMHighResTimeStamp|number}
   */
  function performance() {
    return (new Date).getTime();
  }

  /**
   * get device memory
   * @return {number|null}
   */
  function getDeviceMemory() {
    return navigator.deviceMemory ? navigator.deviceMemory : null;
  }

  /**
   * Determines if the query is supported by the device.
   * @param {string} query
   * @returns {boolean}
   */
  function hasMediaSupport(query) {
    return window.matchMedia(query).matches;
  }

  function getMediaValue(name, values) {
    for (let i = 0; i < values.length; i++) {
      if (hasMediaSupport('(' + name + ': ' + values[i] + ')')) {
        return values[i];
      }
    }
    return '';
  }

  function getMediaColorGamut() {
    return getMediaValue('color-gamut', ['p3', 'srgb']);
  }

  /** #################################
   *  public methods
   * ################################# */

  this.info = function() {
    return  {
      useragent: navigator.userAgent,
      meta: {
        width: getWidth(),
        height: getHeight(),
        ratio: getRatio(),
        ram: getDeviceMemory(),
        gpu: getGPUName(),
        colorDepth: screen.colorDepth,
        gamut: getMediaColorGamut(),
        cores: navigator.hardwareConcurrency || null,
      },
      hints: hints,
    };
  };

}

```

### uses client js

```js

    let deviceMeta = new DeviceMeta();
    let metaData = deviceMeta.info();
    
    async function postData(url = "", data = {}) {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data), 
      });
      return response;
    }
   // send track device information and client-hints for background processing
   postData('/api/t', { 
      eventId,  // custom params (for example, this could be the visit ID)
      metaData  // client-hints + meta data for device
   })
  .catch(e => console.error(e))
  .then(resoinse = response.json())
  .then(result => console.log(result));
```

### backend server 
```js

const http = require('http');
const finalhandler = require('finalhandler'); // https://www.npmjs.com/package/finalhandler
const Router = require('router');  // https://www.npmjs.com/package/router
var bodyParser = require('body-parser')  // https://www.npmjs.com/package/body-parser
const DeviceDetector = require('node-device-detector');
const ClientHints = require('node-device-detector/client-hints');

const routerOpts = {}
const router = Router(routerOpts);
const deviceDetector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: true,
  deviceTrusted: true,
});
const clientHint = new ClientHints();
const port = 3001;
const timeout = 3e5;

const prettyPrintJson = (obj) => JSON.stringify(obj, null, 2);

router.use(bodyParser.json());

router.post('/api/t', (req, res) => {
  const useragent = res.body.useragent ?? req.headers['user-agent'];
  const hints = clientHint.parse(res.body.hints ?? req.headers, res.body.meta);
  const result = deviceDetector.detect(useragent, hints);
  const bot = deviceDetector.parseBot(useragent);

  const body = prettyPrintJson({useragent, result, bot});
  res.end(body);
});

// create server
const server = http.createServer(function onRequest(req, res) {
  router(req, res, finalhandler(req, res));
});
server.listen({port, timeout}, (err, result) => {
  console.log('server listen port %s', port);
})



```
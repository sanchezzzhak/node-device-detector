# [node-device-detector](https://www.npmjs.com/package/node-device-detector)

Port php lib [matomo-org/device-detector](https://github.com/matomo-org/device-detector) to NodeJs

### !!! library works only under nodejs v10+


Install
-

local install production

```
npm install node-device-detector --save
```
local machine install is developer
```
npm install node-device-detector --only=dev
```

# Before upgrading to up version, pls read;
### (ChangeLog)
<details>
<summary>Show details</summary>
* v1.2.0
    * Update fixtures from the motamo-org/devicedetect package#3.12.3 (update to 2020/02/04)
* v1.1.9
    * Update fixtures(update to 2020/01/07)    
* v1.1.8
    * Update fixtures from the motamo-org/devicedetect package#3.12.0 (update to 2019/10/03)
* v1.1.7
    * Update fixtures from the motamo-org/devicedetect package#3.12.0
* v1.1.6
    * Update fixtures from the motamo-org/devicedetect package#3.11.8
* v1.1.5
    * Update fixtures from the motamo-org/devicedetect package#3.11.7
    * Remove methods: isBot(), isMobile(), isPhablet() is* etc...
    * All parsing results are no longer stored in the class object, the result is given immediately, this will allow you to use asynchrony
    
</details>
Usage
-

```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector;

const result = detector.detect(userAgent);

/*
const DEVICE_TYPE = require('node-device-detector/parser/const/device-type');
const isTabled  = result.device && [DEVICE_TYPE.TABLET].indexOf(result.device.type) !== -1;
const isMobile = result.device && [DEVICE_TYPE.SMARTPHONE, DEVICE_TYPE.FEATURE_PHONE].indexOf(result.device.type) !== -1;
const isPhablet = result.device && [DEVICE_TYPE.PHABLET].indexOf(result.device.type) !== -1;
const isIOS = result.os && result.os.family === 'iOS';
const isAndroid = result.os && result.os.family === 'Android';
const isDesktop = !isTabled && !isMobile && !isPhablet;
*/

console.log('result parse', result);
```

### Result parse

```text
{ 
    os: { 
        name: 'Android',
        short_name: 'AND',
        version: '5.0',
        platform: '',
        family: 'Android'
    },
    client:  { 
        type: 'browser',
        name: 'Chrome Mobile',
        short_name: 'CM',
        version: '43.0.2357.78',
        engine: 'Blink',
        engine_version: '' 
    },
    device: { 
        id: 'ZT',
        type: 'smartphone',
        brand: 'ZTE',
        model: 'Nubia Z7 max'
    }
}

```

Result is not detect
```text
{ 
  os: {},
  client: {},
  device: {
    id: '',
    type : 'device type',
    brand: '',
    model: ''
  }
}
```

Using parsers singly
-

#### Detect Bot
```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)';
const detector = new DeviceDetector;
const result = detector.parseBot(userAgent);
```

#### Detect Os
```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector;
const result = detector.parseOs(userAgent);
console.log('Result parse os', result);  
```

#### Detect Client 
```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector;
const result = detector.parseClient(userAgent);
console.log('Result parse client', result);
```

#### Lite parse not detect brand
```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector;
const resultOs = detector.parseOs(userAgent);
const resultClient = detector.parseClient(userAgent);
const resultDeviceType = detector.parseDeviceType(userAgent, resultOs, resultClient, {});
const result = Object.assign({os:resultOs}, {client:resultClient}, {device: resultDeviceType});
console.log('Result parse lite', result);
```

Others
-
* [Micro service](MICROSERVICE.MD)  from framework [moleculer js](http://moleculer.services)
# node-device-detector

port phplib piwik/device-detector from nodejs

### library works only under nodejs v10+

### Install

local install production

```
npm install node-device-detector --production
```
local machine install is developer
```
npm install node-device-detector --only=dev
```

### Usage

```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector;

console.log(detector.detect(userAgent));
console.log('helper methods check type device');
console.log('isDesktop', detector.isDesktop()); // false
console.log(detector.isTabled()); // false
console.log(detector.isPhablet()); // false
console.log(detector.isIOs()); // false
console.log(detector.isAndoid()); // true
console.log('isMobile', detector.isMobile()); // true

```

### Result parse

```json
{ 
    "device": {
        "id" : "",
        "brand": "ZTE",
        "model": "Nubia Z7 max",
        "type": "smartphone" 
    },
    "os": {
        "name": "Android",
        "version": "5.0" 
    },
    "browser": {
        "name": "Chrome Mobile",
        "version": "43.0.2357.78" 
    } 
}
```

Result is not detect
```json
{ 
  os: null,
  device: null,
  browser: null
}
```

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
```

### Result parse

```json
{ 
    "device": {
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
  device: null;

}
```
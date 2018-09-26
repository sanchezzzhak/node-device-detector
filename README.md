# [node-device-detector](https://www.npmjs.com/package/node-device-detector)

Port php lib [matomo-org/device-detector](https://github.com/matomo-org/device-detector) to NodeJs

### !!! library works only under nodejs v10+


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
console.log('isTabled', detector.isTabled()); // false
console.log('isPhablet', detector.isPhablet()); // false
console.log('isIOS', detector.isIOS()); // false
console.log('isAndroid', detector.isAndroid()); // true
console.log('isMobile', detector.isMobile()); // true

```

### Result parse

```json
{
	"os" : {
		"short_name" : "AND",
		"name" : "Android",
		"version" : "5.0",
		"platform" : "",
		"family" : "Android"
	},
	"device" : {
		"id" : "",
		"type" : "smartphone",
		"brand" : "ZTE",
		"model" : "Nubia Z7 max"
	},
	"client" : {
		"engine" : "Blink",
		"engine_version" : "",
		"short_name" : "CM",
		"name" : "Chrome Mobile",
		"version" : "43.0.2357.78",
		"type" : "browser"
	}
}
```

Result is not detect
```json
{ 
  "os": null,
  "device": {
    "id": "",
    "type" : "is type detect not empty attr",
    "brand": "",
    "model": ""
  },
  "client": null
}
```
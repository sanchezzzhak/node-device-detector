
# [node-device-detector](https://www.npmjs.com/package/node-device-detector)

_Last update: 07/07/2025_

## Description

Port php lib [matomo-org/device-detector](https://github.com/matomo-org/device-detector) to NodeJs

* [Online demo](https://mwfx8e.sse.codesandbox.io/)

## Code Status <a name="top"></a>

![Chai](https://github.com/sanchezzzhak/node-device-detector/workflows/Tests/badge.svg)
![YAML Lint](https://github.com/sanchezzzhak/node-device-detector/workflows/YAML%20Lint/badge.svg)
![Prettier](https://github.com/sanchezzzhak/node-device-detector/workflows/Prettier/badge.svg)
![CodeQL](https://github.com/sanchezzzhak/node-device-detector/workflows/CodeQL/badge.svg)
## Contents

+ [Helpers](#helpers)
+ [Single parsers](#single-parsers)
+ [Settings](#options)
+ [Specific methods](#specific-methods)
+ [Examples](#others)
+ [Support brands](#brands-list)
+ [Support device types](#device-types)
+ [Support browsers](#browsers-list)

Install
-
```
npm install node-device-detector --save
```
or 
```
yarn add node-device-detector
```
Usage
-
```js
// commonJS
const DeviceDetector = require('node-device-detector');
// or ESModule
import DeviceDetector from "node-device-detector";

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  osIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const result = detector.detect(userAgent);
console.log('result parse', result);
```

### Result parse

```text
{ 
  os: { 
    name: 'Android',           // os name       
    short_name: 'AND',         // os short code name (format A-Z0-9{3})
    version: '5.0',            // os version
    platform: '',              // os platform (x64, x32, amd etc.)
    family: 'Android'          // os family
  },
  client:  { 
    type: 'browser',            // client type 
    name: 'Chrome Mobile',      // client name name
    short_name: 'CM',           // client short code name (only browser, format A-Z0-9{2,3})
    version: '43.0.2357.78',    // client version
    engine: 'Blink',            // client engine name (only browser)
    engine_version: ''          // client engine version (only browser)
    family: 'Chrome'            // client family (only browser)
  },
  device: { 
    id: 'ZT',                   // short code device brand name (format A-Z0-9{2,3})
    type: 'smartphone',         // device type
    brand: 'ZTE',               // device brand name
    model: 'Nubia Z7 max'       // device model name
    code: 'NX505J'              // device model code  (only result for enable detector.deviceAliasCode) 
    trusted: true               // device trusted (result only for enable detector.deviceTrusted and have fixture data + ClientHints are required)
    info: {}                    // device specs (result only fir enable detector.deviceInfo)
  }
}
```

Result parse empty
```text
{ 
  os: {},                      // empty objects its os not found
  client: {},                  // empty objects its client not found
  device: {      
    id: '',                    // empty string its device brand not found
    type : 'device type',      // device type or empty string
    brand: '',                 // empty string its device brand not found
    model: ''                  // empty string its device model not found
  }
}
```

### Helpers<a name="helpers"></a> ###
[[top]](#top)

```js
// commonJS
const DeviceDetector = require('node-device-detector');
const DeviceHelper = require('node-device-detector/helper');
// or ESModule
import DeviceDetector from "node-device-detector";
import DeviceHelper from "node-device-detector/helper";

const detector = new DeviceDetector();
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const result = detector.detect(userAgent);

/* check device type (feature phone, smartphone or phablet) */
DeviceHelper.isMobile(result);
/* check device type is desktop */
DeviceHelper.isDesktop(result);
/* check device type is tablet  */
DeviceHelper.isTablet(result);
/* check device type car (side panel in car)  */
DeviceHelper.isCar(result);
/* check device type feature phone (push-button telephones)  */
DeviceHelper.isFeaturePhone(result);
/* check device type smartphone  */
DeviceHelper.isSmartphone(result);
/* check device type phablet  */
DeviceHelper.isPhablet(result);
/* check device type game console (xBox, PlayStation, Nintendo etc)  */
DeviceHelper.isConsole(result);
/* check device type smart speaker (Alisa, Alexa, HomePod etc) */
DeviceHelper.isSmartSpeaker(result);
/* check device type SmartTV/TV box */
DeviceHelper.isTv(result);
/* check device type portable camera */
DeviceHelper.isCamera(result);
/* portable terminal, portable projector */
DeviceHelper.isPeripheral(result);
/* LCD panel or interactive panel  */
DeviceHelper.isSmartDisplay(result);
/* check device type boxes, blu-ray players */
DeviceHelper.isPortableMediaPlayer(result);
/* check device type watches, headsets */
DeviceHelper.isWearable(result);
/* result device type number id */
DeviceHelper.getDeviceTypeId(result);
/* result device type string */
DeviceHelper.getDeviceType(result);
/* result client type string */
DeviceHelper.getClientType(result);
```

Using DeviceDetector + ClientHints
-
[[top]](#top)

```js
// commonJS
const DeviceDetector = require('node-device-detector');
const DeviceHelper   = require('node-device-detector/helper');
const ClientHints    = require('node-device-detector/client-hints');
// or ESModule
import DeviceDetector from "node-device-detector";
import DeviceHelper from "node-device-detector/helper";
import ClientHints from "node-device-detector/client-hints";

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  osIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  // ... all options scroll to Setter/Getter/Options
});

/** server side use celint hinsts */
const clientHints = new ClientHints();
const userAgent = res.headers['user-agent'];
let headers = res.headers;
let meta = {}
/**
 option meta interface (needed to detect whether the device is trusted,
 this information can be obtained from browser)
 {
   width: '720',             //  Math.ceil(window.screen.width)
   height: '1440',           //  Math.ceil(window.screen.height)
   gpu: 'PowerVR SGX Doma',  //  (()=>{let e=document.createElement("canvas"),t=e.getContext("webgl")||e.getContext("experimental-webgl");return t?t.getParameter(t.getExtension("WEBGL_debug_renderer_info").UNMASKED_RENDERER_WEBGL):null})();
 }
 More details in file docs/CLIENT_HINTS_BROWSER.MD
 */
let hints = clientHints.parse(headers /* or body.hints */, meta /* or body.meta */);
const result = detector.detect(userAgent, hints);

// result promise
// added for 2.0.4 version or later
const result = detector.detectAsync(userAgent, hints);
```

Using parsers singly <a name="single-parsers"></a>
-
[[top]](#top)

#### Detect Bot
```js
// commonJS
const DeviceDetector = require('node-device-detector');
// or ESModule
import DeviceDetector from "node-device-detector";

const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)';
const detector = new DeviceDetector();
const result = detector.parseBot(userAgent);
```

#### Detect Os
```js
// commonJS
const DeviceDetector = require('node-device-detector');
// or ESModule
import DeviceDetector from "node-device-detector";

const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector({
  clientIndexes: true,
  osIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});
const result = detector.parseOs(userAgent/*, clientHintData*/);
console.log('Result parse os', result);  
```

#### Detect Client 
```js
// commonJS
const DeviceDetector = require('node-device-detector');
// or ESModule
import DeviceDetector from "node-device-detector";

const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    osIndexes: true,
    deviceAliasCode: false,
});
const result = detector.parseClient(userAgent/*, clientHintData*/);
console.log('Result parse client', result);
```

#### Lite parse not detect brand
```js
// commonJS
const DeviceDetector = require('node-device-detector');
// or ESModule
import DeviceDetector from "node-device-detector";

const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  osIndexes: true,
  deviceAliasCode: false,
});
const resultOs = detector.parseOs(userAgent);
const resultClient = detector.parseClient(userAgent);
const resultDeviceType = detector.parseDeviceType(
 userAgent,
 resultOs,
 resultClient,
 {},
 /*, clientHintData */
);
const result = Object.assign({os:resultOs}, {client:resultClient}, {device: resultDeviceType});
console.log('Result parse lite', result);
```

### Getter/Setter/Options <a name="options"></a> ###
[[top]](#top)
```js
const detector = new DeviceDetector({
  osVersionTruncate: 0,      // Truncate OS version from 5.0 to 5 (default '' or null)
  clientVersionTruncate: 2,  // Truncate Client version Chrome from 43.0.2357.78 to 43.0.2357 (default '' or null)
  deviceIndexes: true,       // Using indexes for faster device search (default false)
  clientIndexes: true,       // Using indexes for faster client search (default false)
  osIndexes: true,           // Using indexes for faster os search (default false)
  deviceAliasCode: true,     // adds device code to result [device.code] as is (default false)
  maxUserAgentSize: 500,     // uses only 500 chars from useragent string (default null - unlimited)
  deviceTrusted: true,       // check device by specification (default false)
  deviceInfo: true,          // adds device specification to result [device.info] (default false)
});

// You can override these settings at any time using special setters, example
detector.osVersionTruncate = 0;
detector.clientVersionTruncate = 2;
detector.deviceIndexes = true;
detector.clientIndexes = true;
detector.osIndexes = true;
detector.deviceAliasCode = true;
detector.maxUserAgentSize = 500;
detector.deviceTrusted = true;
detector.deviceInfo = true;

// Array available device types
detector.getAvailableDeviceTypes();
// Array available devices brands
detector.getAvailableBrands();
// Array available browsers
detector.getAvailableBrowsers();
```

### Specific methods <a name="specific-methods"></a> ###

```js
const DEVICE_PARSER_NAMES = detector.getDeviceParserNames(); // result colection names for device parsers 
const CLIENT_PARSER_NAMES = detector.getClientParserNames(); // result colection names for client parsers 
const OS_PARSER_NAMES = detector.getOsParserNames();         // result collection names for os parsers
const BOT_PARSER_NAMES = detector.getBotParserNames();       // result collection names for bot parsers   

const aliasDevice = detector.getParseAliasDevice();          // result AliasDevice parser
const deviceInfo = detector.getParseInfoDevice();            // result InfoDevice parser

// added custom parser
detector.addParseDevice('MyDeviceParser', new MyDeviceParser());
detector.addParseClient('MyClientParser', new MyClientParser());
detector.addParseOs('MyOsParser', new MyOsParser());
detector.addParseBot('MyBotParser', new MyBotParser());
// get single parser by name
detector.getParseDevice('MyDeviceParser' /* or DEVICE_PARSER_NAMES.MOBILE */);
detector.getParseClient('MyClientParser'  /* or CLIENT_PARSER_NAMES.BROWSER */);
detector.getParseOs('MyOsParser'/* or OS_PARSER_NAMES.DEFAULT */);
detector.getParseBot('MyBotParser');
```

### Getting device code as it (experimental) <a name="device-code"></a>
[[top]](#top)
```js
const DeviceDetector = require('node-device-detector');
const detector = new DeviceDetector()
const aliasDevice = detector.getParseAliasDevice();
const result = aliasDevice.parse(userAgent);
console.log('Result parse code model', result);
// or
const AliasDevice = require('node-device-detector/parser/device/alias-device');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const aliasDevice = new AliasDevice();
const result = aliasDevice.parse(userAgent);
console.log('Result parse code model', result);

/*
result 
{
  name: "NX505J"
}
is not parse result  {name: ""}
*/
``` 

### What about performance?
```
node tests/banchmark.js test result:

UA Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36
-----
┌──────────────────────┬─────────┬──────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │ ops/sec  │ margin of error │ runs sampled │
├──────────────────────┼─────────┼──────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'on'   │ '20,235' │    '±0.26%'     │      98      │
│ detector.parseClient │  'on'   │ '46,058' │    '±0.34%'     │      98      │
│   detector.parseOS   │  'on'   │ '20,317' │    '±0.32%'     │      97      │
│   detector.detect    │  'on'   │ '7,526'  │    '±0.76%'     │      92      │
└──────────────────────┴─────────┴──────────┴─────────────────┴──────────────┘
```
<details>
<summary>Other tests</summary>

```
UA Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36
-----
detector.parseDevice x 295,672 ops/sec ±0.79% (96 runs sampled)
detector.parseClient x 60,996 ops/sec ±0.60% (99 runs sampled)
detector.parseOS x 35,174 ops/sec ±0.28% (97 runs sampled)
detector.detect x 16,631 ops/sec ±0.21% (96 runs sampled)
┌──────────────────────┬─────────┬───────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │  ops/sec  │ margin of error │ runs sampled │
├──────────────────────┼─────────┼───────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'on'   │ '295,672' │    '±0.79%'     │      96      │
│ detector.parseClient │  'on'   │ '60,996'  │    '±0.60%'     │      99      │
│   detector.parseOS   │  'on'   │ '35,174'  │    '±0.28%'     │      97      │
│   detector.detect    │  'on'   │ '16,631'  │    '±0.21%'     │      96      │
└──────────────────────┴─────────┴───────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (Linux; Android 12; M2101K9AG Build/SKQ1.210908.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/102.0.5005.125 Mobile Safari/537.36 UCURSOS/v1.6_273-android
┌──────────────────────┬─────────┬──────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │ ops/sec  │ margin of error │ runs sampled │
├──────────────────────┼─────────┼──────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'on'   │ '13,671' │    '±0.42%'     │      96      │
│ detector.parseClient │  'on'   │ '9,154'  │    '±0.26%'     │      98      │
│   detector.parseOS   │  'on'   │ '15,087' │    '±0.36%'     │      99      │
│   detector.detect    │  'on'   │ '3,192'  │    '±0.29%'     │      97      │
└──────────────────────┴─────────┴──────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 239.2.0.17.109 (iPhone9,3; iOS 15_5; it_IT; it-IT; scale=2.00; 750x1334; 376668393) NW/3
┌──────────────────────┬─────────┬───────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │  ops/sec  │ margin of error │ runs sampled │
├──────────────────────┼─────────┼───────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'on'   │  '6,570'  │    '±0.30%'     │      98      │
│ detector.parseClient │  'on'   │ '113,007' │    '±0.41%'     │      99      │
│   detector.parseOS   │  'on'   │ '18,882'  │    '±0.24%'     │      99      │
│   detector.detect    │  'on'   │  '3,849'  │    '±0.46%'     │      97      │
└──────────────────────┴─────────┴───────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (Linux; Android 8.0.0; RNE-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Mobile Safari/537.36
┌──────────────────────┬─────────┬──────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │ ops/sec  │ margin of error │ runs sampled │
├──────────────────────┼─────────┼──────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'on'   │ '3,951'  │    '±0.37%'     │      97      │
│ detector.parseClient │  'on'   │ '47,425' │    '±0.28%'     │      93      │
│   detector.parseOS   │  'on'   │ '21,305' │    '±0.39%'     │      96      │
│   detector.detect    │  'on'   │ '2,587'  │    '±0.39%'     │      98      │
└──────────────────────┴─────────┴──────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44
┌──────────────────────┬─────────┬───────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │  ops/sec  │ margin of error │ runs sampled │
├──────────────────────┼─────────┼───────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'on'   │ '280,116' │    '±1.63%'     │      97      │
│ detector.parseClient │  'on'   │ '58,553'  │    '±0.31%'     │      98      │
│   detector.parseOS   │  'on'   │ '38,153'  │    '±0.31%'     │      94      │
│   detector.detect    │  'on'   │ '15,530'  │    '±0.73%'     │      96      │
└──────────────────────┴─────────┴───────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36
┌──────────────────────┬─────────┬───────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │  ops/sec  │ margin of error │ runs sampled │
├──────────────────────┼─────────┼───────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'off'  │ '584,609' │    '±0.30%'     │      96      │
│ detector.parseClient │  'off'  │   '668'   │    '±70.73%'    │      97      │
│   detector.parseOS   │  'off'  │  '4,355'  │    '±0.31%'     │      98      │
│   detector.detect    │  'off'  │   '774'   │    '±0.23%'     │      96      │
└──────────────────────┴─────────┴───────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36
┌──────────────────────┬─────────┬─────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │ ops/sec │ margin of error │ runs sampled │
├──────────────────────┼─────────┼─────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'off'  │  '343'  │    '±49.33%'    │      94      │
│ detector.parseClient │  'off'  │  '526'  │    '±0.26%'     │      97      │
│   detector.parseOS   │  'off'  │ '3,694' │    '±0.23%'     │      97      │
│   detector.detect    │  'off'  │  '220'  │    '±27.12%'    │      87      │
└──────────────────────┴─────────┴─────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (Linux; Android 12; M2101K9AG Build/SKQ1.210908.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/102.0.5005.125 Mobile Safari/537.36 UCURSOS/v1.6_273-android
┌──────────────────────┬─────────┬─────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │ ops/sec │ margin of error │ runs sampled │
├──────────────────────┼─────────┼─────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'off'  │  '424'  │    '±0.25%'     │      95      │
│ detector.parseClient │  'off'  │ '6,414' │    '±0.43%'     │      96      │
│   detector.parseOS   │  'off'  │ '7,193' │    '±0.33%'     │      96      │
│   detector.detect    │  'off'  │  '268'  │    '±30.56%'    │      93      │
└──────────────────────┴─────────┴─────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 239.2.0.17.109 (iPhone9,3; iOS 15_5; it_IT; it-IT; scale=2.00; 750x1334; 376668393) NW/3
┌──────────────────────┬─────────┬──────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │ ops/sec  │ margin of error │ runs sampled │
├──────────────────────┼─────────┼──────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'off'  │ '2,990'  │    '±0.33%'     │      97      │
│ detector.parseClient │  'off'  │ '34,868' │    '±0.21%'     │      99      │
│   detector.parseOS   │  'off'  │ '3,379'  │    '±0.42%'     │      95      │
│   detector.detect    │  'off'  │ '1,274'  │    '±0.24%'     │      99      │
└──────────────────────┴─────────┴──────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (Linux; Android 8.0.0; RNE-L21) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Mobile Safari/537.36
┌──────────────────────┬─────────┬─────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │ ops/sec │ margin of error │ runs sampled │
├──────────────────────┼─────────┼─────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'off'  │  '603'  │    '±84.34%'    │      97      │
│ detector.parseClient │  'off'  │  '583'  │    '±0.38%'     │      97      │
│   detector.parseOS   │  'off'  │ '9,073' │    '±0.33%'     │      96      │
│   detector.detect    │  'off'  │  '272'  │    '±28.33%'    │      90      │
└──────────────────────┴─────────┴─────────┴─────────────────┴──────────────┘
-----
UA Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44
┌──────────────────────┬─────────┬───────────┬─────────────────┬──────────────┐
│    parse method      │ indexes │  ops/sec  │ margin of error │ runs sampled │
├──────────────────────┼─────────┼───────────┼─────────────────┼──────────────┤
│ detector.parseDevice │  'off'  │ '223,548' │    '±0.36%'     │      96      │
│ detector.parseClient │  'off'  │  '1,268'  │    '±0.47%'     │      99      │
│   detector.parseOS   │  'off'  │  '4,509'  │    '±0.59%'     │      94      │
│   detector.detect    │  'off'  │   '880'   │    '±0.25%'     │      96      │
└──────────────────────┴─────────┴───────────┴─────────────────┴──────────────┘
```
</details>

### What about tests?
Yes we use tests, total tests: ~83.9k

### Get more information about a device (experimental)
> This parser is experimental and contains few devices. (2098 devices, alias devices 3987)
>
##### Support detail brands/models list:

<details>
<summary>Show details</summary>

| Brand | Device count | Alias count | - | Brand | Device count | Alias count |
|----|----|----|----|----|----|----|
| 360 | 12 | 13 | - | 8848 | 4 | 0 |
| 2e | 2 | 2 | - | 3q | 2 | 37 |
| 4good | 10 | 1 | - | ace | 8 | 0 |
| acer | 5 | 4 | - | agm | 4 | 1 |
| ainol | 2 | 2 | - | airo wireless | 1 | 0 |
| airtel | 1 | 0 | - | akai | 2 | 1 |
| alcatel | 25 | 154 | - | alcor | 1 | 0 |
| alldocube | 2 | 1 | - | allview | 41 | 0 |
| altek | 1 | 0 | - | amazon | 19 | 10 |
| amgoo | 2 | 2 | - | amoi | 62 | 0 |
| apple | 46 | 101 | - | archos | 89 | 7 |
| arian space | 4 | 4 | - | ark | 1 | 1 |
| asanzo | 1 | 0 | - | assistant | 2 | 2 |
| asus | 80 | 242 | - | at&t | 1 | 1 |
| atol | 1 | 1 | - | avenzo | 1 | 2 |
| avh | 1 | 0 | - | avvio | 3 | 4 |
| barnes & noble | 1 | 0 | - | bb mobile | 2 | 2 |
| beeline | 11 | 1 | - | bellphone | 1 | 1 |
| bezkam | 1 | 0 | - | bigben | 1 | 0 |
| bihee | 2 | 0 | - | billion | 1 | 1 |
| biorugged | 1 | 0 | - | bird | 1 | 0 |
| bitel | 4 | 0 | - | bitmore | 2 | 1 |
| bittium | 1 | 0 | - | bkav | 1 | 0 |
| black bear | 2 | 0 | - | black fox | 18 | 18 |
| blackview | 97 | 19 | - | blu | 23 | 16 |
| bravis | 24 | 16 | - | byju\\'s | 1 | 1 |
| cgv | 1 | 0 | - | clarmin | 3 | 0 |
| cobalt | 1 | 0 | - | colors | 7 | 2 |
| cyrus | 1 | 1 | - | dewalt | 1 | 0 |
| deyi | 1 | 1 | - | dialog | 1 | 0 |
| digi | 6 | 0 | - | digidragon | 3 | 0 |
| digifors | 1 | 1 | - | doogee | 3 | 1 |
| engel | 1 | 1 | - | estar | 2 | 0 |
| evoo | 1 | 0 | - | firefly mobile | 4 | 0 |
| formuler | 2 | 0 | - | geotel | 3 | 0 |
| gionee | 4 | 0 | - | glocalme | 1 | 0 |
| google | 3 | 4 | - | hafury | 1 | 0 |
| hisense | 2 | 0 | - | hoffmann | 1 | 1 |
| hotwav | 18 | 2 | - | huawei | 217 | 668 |
| i-mobile | 1 | 0 | - | imo mobile | 5 | 5 |
| infinix | 26 | 42 | - | inoi | 4 | 0 |
| intex | 18 | 4 | - | ipro | 6 | 6 |
| irbis | 15 | 0 | - | just5 | 1 | 0 |
| kalley | 3 | 1 | - | kapsys | 1 | 0 |
| kiowa | 1 | 0 | - | krip | 3 | 0 |
| kurio | 3 | 3 | - | kzen | 1 | 0 |
| lava | 1 | 1 | - | lg | 117 | 393 |
| malata | 1 | 0 | - | maze | 4 | 0 |
| minix | 1 | 1 | - | mipo | 2 | 0 |
| miray | 1 | 0 | - | mitsui | 1 | 0 |
| mivo | 3 | 1 | - | mobicel | 3 | 2 |
| motorola | 28 | 39 | - | newland | 1 | 0 |
| noa | 1 | 0 | - | nomi | 1 | 1 |
| nuu mobile | 9 | 8 | - | nuvo | 3 | 2 |
| oneplus | 18 | 55 | - | oppo | 108 | 240 |
| oukitel | 8 | 0 | - | öwn | 1 | 2 |
| palm | 1 | 2 | - | panasonic | 5 | 4 |
| parrot mobile | 1 | 0 | - | pipo | 5 | 1 |
| pixpro | 1 | 0 | - | poco | 9 | 26 |
| premier | 1 | 0 | - | realme | 66 | 116 |
| samsung | 165 | 968 | - | sankey | 1 | 0 |
| sansui | 1 | 0 | - | senseit | 2 | 0 |
| sharp | 2 | 5 | - | sony | 37 | 169 |
| sprint | 2 | 0 | - | supra | 1 | 0 |
| tecno mobile | 91 | 162 | - | teracube | 2 | 0 |
| tiphone | 1 | 0 | - | tps | 1 | 0 |
| ulefone | 8 | 0 | - | utok | 1 | 0 |
| uz mobile | 1 | 0 | - | vernee | 9 | 2 |
| viewsonic | 1 | 0 | - | visual land | 2 | 2 |
| vivo | 203 | 325 | - | walton | 112 | 2 |
| we | 8 | 0 | - | weimei | 1 | 0 |
| wiko | 7 | 16 | - | wileyfox | 9 | 1 |
| wink | 4 | 0 | - | winmax | 1 | 0 |
| x-age | 1 | 1 | - | xiaomi | 9 | 26 |
| yumkem | 1 | 0 | - | zen | 1 | 0 |
| zik | 1 | 0 | - | zync | 2 | 1 |
| zyq | 1 | 1 | - |  |  |  |

</details>

```js
const DeviceDetector = require('node-device-detector');
const detector = new DeviceDetector();
const infoDevice = detector.getParseInfoDevice();
const result = infoDevice.info('Asus', 'Zenfone 4');
console.log('Result information', result);
// or 
const InfoDevice = require('node-device-detector/parser/device/info-device');
const infoDevice = new InfoDevice();
const result = infoDevice.info('Asus', 'Zenfone 4');
console.log('Result information', result);

/*
result
{
  display: {
    size: '5.5',
    resolution: '1080x1920',  // width+height
    ratio: '16:9',
    ppi: "401"
  },
  size: '155.4x75.2x7.7',    // width+height+thickness
  weight: '165',
  hardware: {
    // ...
  }
  os: "Android 7.1",
  release: "2017.08",
  sim": "2",
}
is not found result null
*/
```
Cast methods
```js
const InfoDevice = require('node-device-detector/parser/device/info-device');
const infoDevice = new InfoDevice;
infoDevice.setSizeConvertObject(true);
infoDevice.setResolutionConvertObject(true);
const result = infoDevice.info('Asus', 'Zenfone 4');
console.log('Result information', result);
/*
result
{  
  display: {
    size: "5.5",  // value in inchs
    resolution: {
      width: "1080", // value in px
      height: "1920" // value in px
    },
    ratio: "16:9",   // calculated field
    ppi: "401"       // calculated field
  },
  hardware: {
    ram: "4096",   // RAM value in megabytes
    cpu_id: 19,  // id cpu model in collection
    cpu: {
      name: "Qualcomm Snapdragon 630",  // brand + name
      type: "ARM",                      // architecture type 
      cores: "8",                       // number of cores / threads 
      clock_rate: 2200,                 // value in MHz
      gpu_id: 16                        // id gpu model in collection
	},
    gpu: {
      name: "Qualcomm Adreno 508",
      clock_rate: 650
    }
  },
  os: "Android 7.1",   // initial OS version
  release: "2017.08",  // date release or anonce
  sim": "2",           // count SIM 
  size: {           
    width: "75.2",     // physical width in millimeters
    height: "155.4",   // physical height in millimeters
    thickness: "7.7"   // physical thickness in millimeters
  },
  weight: "165"        // in grams
};
*/
```

Others <a name="others"></a>
-
[[top]](#top)

##### Examples
* [detect device in native server](docs/NATIVE_SERVER.MD)
* [detect device + client hints in native server](docs/CLIENT_HINT_NATIVE_SERVER.MD)
* [detect device in express.js](docs/EXPRESS_SERVER.MD)
* [detect device in moleculer.js](docs/MICROSERVICE.MD)
* [detect device in uws.js](docs/UWS_SERVER.MD)
* [detect device in typescript](docs/TYPE_SCRIPT.MD)
* [get client hints in browser](docs/CLIENT_HINTS_BROWSER.MD)

<a name="brands-list"></a>

##### Support detect brands list (2086):

<details>
<summary>Show details</summary>

  Brand  |  Brand  |  Brand  |  Brand  |  Brand  |  Brand  |  Brand 
--- | --- | --- | --- | --- | --- | ---
10moons | 2E | 360 | 3GNET | 3GO | 3Q | 4Good
4ife | 5IVE | 7 Mobile | 8848 | A&K | A1 | A95X
AAUW | Accent | Accesstyle | Ace | Aceline | Acepad | Acer
Acteck | actiMirror | Adreamer | Adronix | Advan | Advance | Advantage Air
AEEZO | AFFIX | AfriOne | AG Mobile | AGM | AIDATA | AileTV
Ainol | Airis | Airness | AIRON | Airpha | Airtel | Airties
AirTouch | AIS | Aiuto | Aiwa | Ajib | Akai | AKIRA
Alba | Alcatel | Alcor | ALDI NORD | ALDI SÜD | Alfawise | Alienware
Aligator | All Star | AllCall | AllDocube | allente | ALLINmobile | Allview
Allwinner | Alps | alpsmart | Altech UEC | Altibox | Altice | Altimo
altron | Altus | AMA | Amazon | Amazon Basics | AMCV | AMGOO
Amigoo | Amino | Amoi | ANBERNIC | ANCEL | andersson | Andowl
Angelcare | AngelTech | Anker | Anry | ANS | ANXONIT | AOC
Aocos | Aocwei | AOpen | Aoro | Aoson | AOYODKG | ApoloSign
Apple | Aquarius | Arçelik | Archos | Arian Space | Arival | Ark
ArmPhone | Arnova | ARRIS | Artel | Artizlee | ArtLine | Asano
Asanzo | Ask | Aspera | ASSE | Assistant | astro (MY) | Astro (UA)
Asus | AT&T | Athesi | Atlantic Electrics | Atmaca Elektronik | ATMAN | ATMPC
ATOL | Atom | Atouch | Atozee | Attila | Atvio | Audiovox
AUPO | AURIS | Autan | AUX | Avaya | Avenzo | AVH
Avvio | Awow | AWOX | AXEN | Axioo | AXXA | Axxion
AYA | AYYA | Azeyou | AZOM | Azumi Mobile | Azupik | b2m
Backcell | BAFF | BangOlufsen | Barnes & Noble | BARTEC | BASE | BAUHN
BB Mobile | BBK | BDF | BDQ | BDsharing | Beafon | Becker
Beeline | Beelink | Beetel | Beista | Beko | Bell | Bellphone
Benco | Benesse | BenQ | BenQ-Siemens | BenWee | Benzo | Beyond
Bezkam | BGH | Biegedy | Bigben | BIHEE | BilimLand | Billion
Billow | BioRugged | Bird | Bitel | Bitmore | Bittium | Bkav
Black Bear | Black Box | Black Fox | Blackpcs | Blackphone | Blackton | Blackview
Blaupunkt | Bleck | BLISS | Blloc | Blow | Blu | Bluboo
Bluebird | Bluedot | Bluegood | BlueSky | Bluewave | BluSlate | BMAX
Bmobile | BMW | BMXC | Bobarry | bogo | Bolva | Bookeen
Boost | Botech | Boway | bq | Bqeel | BrandCode | Brandt
BRAVE | Bravis | BrightSign | Brigmton | Brondi | BROR | BS Mobile
Bubblegum | Bundy | Bush | BuzzTV | BYD | BYJU'S | BYYBUO
C Idea | C5 Mobile | CADENA | CAGI | Caixun | Camfone | Canaima
Canal Digital | Canal+ | Canguro | Capitel | Captiva | Carbon Mobile | Carrefour
Casio | Casper | Cat | Cavion | CCIT | Cecotec | Ceibal
Celcus | Celkon | Cell-C | Cellacom | CellAllure | Cellution | CENTEK
Centric | CEPTER | CG Mobile | CGV | Chainway | Changhong | CHCNAV
Cherry Mobile | Chico Mobile | ChiliGreen | China Mobile | China Telecom | Chuwi | CipherLab
Citycall | CKK Mobile | Claresta | Clarmin | CLAYTON | ClearPHONE | Clementoni
Cloud | Cloudfone | Cloudpad | Clout | Clovertek | CMF | CnM
Cobalt | Coby Kyros | Cogeco | COLORROOM | Colors | Comio | CommScope
Compal | Compaq | COMPUMAX | ComTrade Tesla | Conceptum | Concord | ConCorde
Condor | Connectce | Connex | Conquest | CONSUNG | Continental Edison | Contixo
coocaa | COOD-E | Coolpad | Coopers | CORN | Cosmote | Covia
Cowon | COYOTE | CPDEVICE | CreNova | Crescent | Crestron | Cricket
Crius Mea | Crony | Crosscall | Crown | Ctroniq | Cube | CUBOT
CUD | Cuiud | Cultraview | CVTE | Cwowdefu | CX | Cyrus
D-Link | D-Tech | Daewoo | Danew | DangcapHD | Dany | Daria
DASS | Datalogic | Datamini | Datang | Datawind | Datsun | Dawlance
Dazen | DbPhone | Dbtel | Dcode | DEALDIG | Dell | Denali
Denka | Denver | Desay | DeWalt | DEXP | DEYI | DF
DGTEC | DIALN | Dialog | Dicam | Digi | Digicel | DIGICOM
Digidragon | DIGIFORS | Digihome | Digiland | Digit4G | Digma | DIJITSU
DIKOM | DIMO | Dinalink | Dinax | DING DING | Diofox | DIORA
DISH | Disney | Ditecma | Diva | DiverMax | Divisat | DIXON
DL | DMM | DMOAO | DNS | DoCoMo | Doffler | Dolamee
Dom.ru | Doogee | Doopro | Doov | Dopod | Doppio | Dora
DORLAND | Doro | DPA | DRAGON | Dragon Touch | Dreamgate | DreamStar
DreamTab | Droidlogic | Droxio | DSDevices | DSIC | Dtac | DUDU AUTO
Dune HD | DUNNS Mobile | DuoTV | Durabook | Duubee | Dykemann | Dyon
E-Boda | E-Ceros | E-TACHI | E-tel | Eagle | EagleSoar | EAS Electric
Easypix | EBEN | EBEST | Echo Mobiles | ecom | ECON | ECOO
EcoStar | ECS | Edenwood | EE | EFT | EGL | EGOTEK
Ehlel | Einstein | EKINOX | EKO | Eks Mobility | EKT | ELARI
ELE-GATE | Elecson | Electroneum | ELECTRONIA | Elekta | Elektroland | Element
Elenberg | Elephone | Elevate | Elista | elit | Elong Mobile | Eltex
Ematic | Emporia | ENACOM | ENDURO | Energizer | Energy Sistem | Engel
ENIE | Enot | eNOVA | Entity | Envizen | Ephone | Epic
Epik One | Epson | Equator | Ergo | Ericsson | Ericy | Erisson
Essential | Essentielb | eSTAR | ETOE | Eton | eTouch | Etuline
Eudora | Eurocase | EUROLUX | Eurostar | Evercoss | Everest | Everex
Everfine | Everis | Evertek | Evolio | Evolveo | Evoo | EVPAD
EvroMedia | evvoli | EWIS | EXCEED | Exmart | ExMobile | EXO
Explay | Express LUCK | ExtraLink | Extrem | Eyemoo | EYU | Ezio
Ezze | F&U | F+ | F150 | F2 Mobile | Facebook | Facetel
Facime | Fairphone | Famoco | Famous | Fantec | FaRao Pro | Farassoo
FarEasTone | Fengxiang | Fenoti | FEONAL | Fero | FFF SmartLife | Figgers
FiGi | FiGO | FiiO | Filimo | FILIX | FinePower | FINIX
Finlux | FireFly Mobile | FISE | Fision | FITCO | Fluo | Fly
FLYCAT | FLYCOAY | FMT | FNB | FNF | Fobem | Fondi
Fonos | FONTEL | FOODO | FORME | Formovie | Formuler | Forstar
Fortis | FortuneShip | FOSSiBOT | Four Mobile | Fourel | Foxconn | FoxxD
FPT | free | Freetel | FreeYond | FRESH | Frunsi | Fuego
FUJICOM | Fujitsu | Funai | Fusion5 | Future Mobile Technology | Fxtec | G-Guard
G-PLUS | G-TiDE | G-Touch | G-Vill | Galactic | Galatec | Galaxy Innovations
Gamma | Garmin-Asus | Gateway | Gazal | Gazer | GDL | Geanee
Geant | Gear Mobile | Gemini | General Mobile | Genesis | Geo Phone | GEOFOX
Geotel | Geotex | GEOZON | Getnord | GFive | Gfone | Ghia
Ghong | Ghost | Gigabyte | Gigaset | Gini | Ginzzu | Gionee
GIRASOLE | Globex | Globmall | GlocalMe | Glofiish | GLONYX | Glory Star
GLX | GN Electronics | GOCLEVER | Gocomma | GoGEN | Gol Mobile | GOLDBERG
GoldMaster | GoldStar | Goly | Gome | GoMobile | GOODTEL | Google
Goophone | Gooweel | GOtv | Gplus | Gradiente | Graetz | Grape
Great Asia | Gree | Green Lion | Green Orange | Greentel | Gresso | Gretel
GroBerwert | Grünberg | Grundig | Gtel | GTMEDIA | GTX | Guophone
GVC Pro | H133 | H96 | Hafury | Haier | Haipai | Haixu
Hamlet | Hammer | Handheld | HannSpree | Hanseatic | Hanson | HAOQIN
HAOVM | Hardkernel | Harper | Hartens | Hasee | Hathway | HAVIT
HDC | HeadWolf | HEC | Heimat | Helio | Hemilton | HERO
HexaByte | Hezire | Hi | Hi Nova | Hi-Level | Hiberg | HiBy
High Q | HIGH1ONE | Highscreen | HiGrace | HiHi | HiKing | HiMax
HIPER | Hipstreet | Hiremco | Hisense | Hitachi | Hitech | HKC
HKPro | HLLO | HMD | hoco | HOFER | Hoffmann | HOLLEBERG
Homatics | Hometech | HOMII | Homtom | Honeywell | HongTop | HONKUAHG
Hoozo | Hopeland | Horion | Horizon | Horizont | Hosin | Hot Pepper
HOTACK | Hotel | HOTREALS | Hotwav | How | HP | HTC
Huadoo | Huagan | Huavi | Huawei | Hugerock | Humanware | Humax
HUMElab | Hurricane | Huskee | Hyatta | Hykker | Hyrican | Hytera
Hyundai | Hyve | I KALL | i-Cherry | I-INN | i-Joy | i-mate
i-mobile | I-Plus | iBall | iBerry | ibowin | iBrit | IconBIT
Icone Gold | iData | IDC | iDino | iDroid | iFIT | iGet
iHome Life | iHunt | Ikea | IKI Mobile | iKoMo | iKon | iKonia
IKU Mobile | iLA | iLepo | iLife | iMan | Imaq | iMars
iMI | IMO Mobile | Imose | Impression | iMuz | iNavi | INCAR
Inch | Inco | Indurama | iNew | Infiniton | InfinityPro | Infinix
InFocus | InfoKit | Infomir | InFone | Inhon | Inka | Inkti
InnJoo | Innos | Innostream | iNo Mobile | Inoi | iNOVA | inovo
INQ | Insignia | INSYS | Intek | Intel | Intex | Invens
Inverto | Invin | iOcean | IOTWE | iOutdoor | iPEGTOP | iPro
iQ&T | IQM | IRA | Irbis | iReplace | Iris | iRobot
iRola | iRulu | iSafe Mobile | iStar | iSWAG | IT | iTel
iTruck | IUNI | iVA | iView | iVooMi | ivvi | iWaylink
iXTech | iYou | iZotron | Jambo | JAY-Tech | Jedi | Jeep
Jeka | Jesy | JFone | Jiake | Jiayu | Jin Tu | Jinga
Jio | Jivi | JKL | Jolla | Joy | JoySurf | JPay
JREN | Jumper | Juniper Systems | Just5 | JUSYEA | JVC | JXD
K-Lite | K-Touch | Kaan | Kaiomy | Kalley | Kanji | Kapsys
Karbonn | Kata | KATV1 | Kazam | Kazuna | KDDI | Kempler & Strauss
Kenbo | Kendo | Keneksi | KENSHI | KENWOOD | Kenxinda | KGTEL
Khadas | Kiano | kidiby | Kingbox | Kingstar | Kingsun | KINGZONE
Kinstone | Kiowa | Kivi | Klipad | KMC | KN Mobile | Kocaso
Kodak | Kogan | Komu | Konka | Konrow | Koobee | Koolnee
Kooper | KOPO | Korax | Koridy | Koslam | Kraft | KREZ
KRIP | KRONO | Krüger&Matz | KT-Tech | KTC | KUBO | KuGou
Kuliao | Kult | Kumai | Kurio | KVADRA | Kvant | Kydos
Kyocera | Kyowon | Kzen | KZG | L-Max | LAIQ | Land Rover
Landvo | Lanin | Lanix | Lark | Laser | Laurus | Lava
LCT | Le Pan | Leader Phone | Leagoo | Leben | LeBest | Lectrus
Ledstar | LeEco | Leelbox | Leff | Legend | Leke | Lemco
LEMFO | Lemhoov | Lenco | Lenovo | Leotec | Lephone | Lesia
Lexand | Lexibook | LG | Liberton | Lifemaxx | Lime | Lingbo
Lingwin | Linnex | Linsar | Linsay | Listo | LNMBBS | Loewe
LOGAN | Logic | Logic Instrument | Logicom | Logik | Logitech | LOKMAT
LongTV | Loview | Lovme | LPX-G | LT Mobile | Lumigon | Lumitel
Lumus | Luna | LUNNEN | LUO | Luxor | Lville | LW
LYF | LYOTECH LABS | M-Horse | M-KOPA | M-Tech | M.T.T. | M3 Mobile
M4tel | MAC AUDIO | Macoox | Mafe | MAG | MAGCH | Magenta
Magicsee | Magnus | Majestic | Malata | Mango | Manhattan | Mann
Manta Multimedia | Mantra | Mara | Marshal | Mascom | Massgo | Masstel
Master-G | Mastertech | Matco Tools | Matrix | Maunfeld | Maxcom | Maxfone
Maximus | Maxtron | MAXVI | Maxwell | Maxwest | MAXX | Maze
Maze Speed | MBI | MBK | MBOX | McLaut | MDC Store | MDTV
meanIT | Mecer | MECHEN | Mecool | Mediacom | Medion | MEEG
MEGA VISION | Megacable | MegaFon | MEGAMAX | Meitu | Meizu | Melrose
MeMobile | Memup | MEO | MESWAO | Meta | Metz | MEU
MicroMax | Microsoft | Microtech | Mightier | Minix | Mint | Mintt
Mio | Mione | mipo | Miray | Mitchell & Brown | Mito | Mitsubishi
Mitsui | MIVO | MIWANG | MIXC | MiXzo | MLAB | MLLED
MLS | MMI | Mobell | Mobicel | MobiIoT | Mobiistar | Mobile Kingdom
Mobiola | Mobistel | MobiWire | Mobo | Mobvoi | Mode Mobile | Modecom
Mofut | Moondrop | MORTAL | Mosimosi | Motiv | Motorola | Motorola Solutions
Movic | MOVISUN | Movitel | Moxee | mPhone | Mpman | MSI
MStar | MTC | MTN | multibox | Multilaser | MultiPOS | MULTYNET
MwalimuPlus | MYFON | MyGica | MygPad | Mymaga | MyMobile | MyPhone (PH)
myPhone (PL) | Myria | Myros | Mystery | MyTab | MyWigo | N-one
Nabi | NABO | Nanho | Naomi Phone | NASCO | National | Navcity
Navitech | Navitel | Navon | NavRoad | NEC | Necnot | Nedaphone
Neffos | NEKO | Neo | neoCore | Neolix | Neomi | Neon IQ
Neoregent | Nesons | NetBox | Netgear | Netmak | NETWIT | NeuImage
NeuTab | NEVIR | New Balance | New Bridge | Newal | Newgen | Newland
Newman | Newsday | NewsMy | Nexa | Nexar | NEXBOX | Nexian
NEXON | NEXT | Next & NextStar | Nextbit | NextBook | NextTab | NG Optics
NGM | NGpon | Nikon | NILAIT | NINETEC | NINETOLOGY | Nintendo
nJoy | NOA | Noain | Nobby | Noblex | NOBUX | noDROPOUT
NOGA | Nokia | Nomi | Nomu | Noontec | Nordfrost | Nordmende
NORMANDE | NorthTech | Nos | Nothing | Nous | Novacom | Novex
Novey | NOVIS | NoviSea | NOVO | NTT West | NuAns | Nubia
NUU Mobile | NuVision | Nuvo | Nvidia | NYX Mobile | O+ | O2
Oale | Oangcc | OASYS | Obabox | Ober | Obi | OCEANIC
Odotpad | Odys | Oilsky | OINOM | ok. | Okapi | Okapia
Oking | OKSI | OKWU | Olax | Olkya | Ollee | OLTO
Olympia | OMIX | Onda | OneClick | OneLern | OnePlus | Onida
Onix | Onkyo | ONN | ONVO | ONYX BOOX | Ookee | Ooredoo
OpelMobile | Openbox | Ophone | OPPO | Opsson | Optoma | Orange
Orange Pi | Orava | Orbic | Orbita | Orbsmart | Ordissimo | Orion
OSCAL | OTTO | OUJIA | Ouki | Oukitel | OUYA | Overmax
Ovvi | öwn | Owwo | OX TAB | OYSIN | Oysters | Oyyu
OzoneHD | P-UP | Pacific Research Alliance | Packard Bell | Padpro | PAGRAER | Paladin
Palm | Panacom | Panasonic | Panavox | Pano | Panodic | Panoramic
Pantech | PAPYRE | Parrot Mobile | Partner Mobile | PC Smart | PCBOX | PCD
PCD Argentina | PEAQ | Pelitt | Pendoo | Penta | Pentagram | Perfeo
Phicomm | Philco | Philips | Phonemax | phoneOne | Pico | PINE
Pioneer | Pioneer Computers | PiPO | PIRANHA | Pixela | Pixelphone | PIXPRO
Pixus | Planet Computers | Platoon | Play Now | PLDT | Ployer | Plum
PlusStyle | Pluzz | PocketBook | POCO | Point Mobile | Point of View | Polar
PolarLine | Polaroid | Polestar | PolyPad | Polytron | Pomp | Poppox
POPTEL | Porsche | Portfolio | Positivo | Positivo BGH | PPDS | PPTV
Premier | Premio | Prestigio | PRIME | Primepad | Primux | PRISM+
Pritom | Prixton | PROFiLO | Proline | Prology | ProScan | PROSONIC
Protruly | ProVision | PULID | Punos | Purism | PVBox | Q-Box
Q-Touch | Q.Bell | QFX | Qilive | QIN | Qiuwoky | QLink
QMobile | Qnet Mobile | QTECH | Qtek | Quantum | Quatro | Qubo
Quechua | Quest | Quipus | Qumo | Qupi | Qware | QWATT
R-TV | R3Di | Rakuten | Ramos | Raspberry | Ravoz | Raylandz
Razer | RAZZ | RCA Tablets | RCT | Reach | Readboy | Realix
Realme | RED | RED-X | Redbean | Redfox | RedLine | Redway
Reeder | REGAL | RelNAT | Relndoo | Remdun | Renova | RENSO
rephone | Retroid Pocket | Revo | Revomovil | Rhino | Ricoh | Rikomagic
RIM | Ringing Bells | Rinno | Ritmix | Ritzviva | Riviera | Rivo
Rizzen | ROADMAX | Roadrover | Roam Cat | ROCH | Rocket | ROiK
Rokit | Roku | Rombica | Romsat | Ross&Moor | Rover | RoverPad
Royole | RoyQueen | RT Project | RTK | RugGear | RuggeTech | Ruggex
Ruio | Runbo | Rupa | Ryte | S-Color | S-TELL | S2Tel
Saba | Safaricom | Sagem | Sagemcom | Saiet | SAILF | Salora
Sambox | Samsung | Samtech | Samtron | Sanei | Sankey | Sansui
Santin | SANY | Sanyo | Savio | Sber | SCHAUB LORENZ | Schneider
Schok | SCHONTECH | Scoole | Scosmos | Seatel | SEBBE | Seeken
SEEWO | SEG | Sega | SEHMAX | Selecline | Selenga | Selevision
Selfix | SEMP TCL | Sencor | Sencrom | Sendo | Senkatel | SENNA
Senseit | Senwa | SERVO | Seuic | Sewoo | SFR | SGIN
Shanling | Sharp | Shift Phones | Shivaki | Shtrikh-M | Shuttle | Sico
Siemens | Sigma | Silelis | Silent Circle | Silva Schneider | Simbans | simfer
Simply | SINGER | Singtech | Siragon | Sirin Labs | Siswoo | SK Broadband
SKG | SKK Mobile | Sky | Skyline | SkyStream | Skytech | Skyworth
Smadl | Smailo | Smart | Smart Electronic | Smart Kassel | Smart Tech | Smartab
SmartBook | SMARTEC | Smartex | Smartfren | Smartisan | Smarty | Smooth Mobile
Smotreshka | SMT Telecom | SMUX | SNAMI | SobieTech | Soda | Softbank
Soho Style | Solas | SOLE | SOLO | Solone | Sonim | SONOS
Sony | Sony Ericsson | SOSH | SoulLink | Soundmax | SOWLY | Soyes
Spark | Sparx | SPC | Spectralink | Spectrum | Spice | Spider
Sprint | SPURT | SQOOL | SSKY | Star | Star-Light | Starlight
Starmobile | Starway | Starwind | STF Mobile | STG Telecom | Stilevs | STK
Stonex | Storex | StrawBerry | Stream | STRONG | Stylo | Subor
Sugar | SULPICE TV | Sumvision | Sunmax | Sunmi | Sunny | Sunstech
SunVan | Sunvell | SUNWIND | Super General | SuperBOX | Supermax | SuperSonic
SuperTab | SuperTV | Supra | Supraim | Surfans | Surge | Suzuki
Sveon | Swipe | SWISSMOBILITY | Swisstone | Switel | SWOFY | Syco
SYH | Sylvania | Symphony | Syrox | System76 | T-Mobile | T96
TADAAM | TAG Tech | Taiga System | Takara | TALBERG | Talius | Tambo
Tanix | TAUBE | TB Touch | TCL | TCL SCBC | TD Systems | TD Tech
TeachTouch | Technicolor | Technika | TechniSat | Technopc | TECHNOSAT | TechnoTrend
TechPad | TechSmart | Techstorm | Techwood | Teclast | Tecno Mobile | TecToy
TEENO | Teknosa | Tele2 | Telefunken | Telego | Telenor | Telia
Telit | Telkom | Telly | Telma | TeloSystems | Telpo | Temigereev
TENPLUS | Teracube | Tesco | Tesla | TETC | Tetratab | teXet
ThL | Thomson | Thuraya | TIANYU | Tibuta | Tigers | Time2
Timovi | TIMvision | Tinai | Tinmo | TiPhone | Tivax | TiVo
TJC | TJD | TOKYO | Tolino | Tone | TOOGO | Tooky
Top House | Top-Tech | TopDevice | TOPDON | Topelotek | Toplux | TOPSHOWS
Topsion | Topway | Torex | TORNADO | Torque | TOSCIDO | Toshiba
Touch Plus | Touchmate | TOX | TPS | Transpeed | Trecfone | TrekStor
Trevi | TriaPlay | Tricolor | Trident | Trifone | Trimble | Trio
Tronsmart | True | True Slim | Tsinghua Tongfang | TTEC | TTfone | TTK-TV
TuCEL | TUCSON | Tunisie Telecom | Turbo | Turbo-X | TurboKids | TurboPad
Türk Telekom | Turkcell | Tuvio | TV+ | TVC | TwinMOS | TWM
Twoe | TWZ | TYD | Tymes | U-Magic | U.S. Cellular | UD
UE | UGINE | Ugoos | Uhans | Uhappy | Ulefone | Umax
UMIDIGI | Umiio | Unblock Tech | Uniden | Unihertz | Unimax | Uniqcell
Uniscope | Unistrong | Unitech | UNITED | United Group | UNIWA | Unknown
Unnecto | Unnion Technologies | UNNO | Unonu | UnoPhone | Unowhy | UOOGOU
Urovo | UTime | UTOK | UTStarcom | UZ Mobile | V-Gen | V-HOME
V-HOPE | v-mobile | V7 | VAIO | VALE | VALEM | VALTECH
VANGUARD | Vankyo | VANWIN | Vargo | Vastking | VAVA | VC
VDVD | Vega | Veidoo | Vekta | Venso | Venstar | Venturer
VEON | Verico | Verizon | Vernee | Verssed | Versus | Vertex
Vertu | Verykool | Vesta | Vestel | VETAS | Vexia | VGO TEL
ViBox | Victurio | VIDA | Videocon | Videoweb | Viendo | ViewSonic
VIIPOO | VIKUSHA | VILLAON | VIMOQ | Vinabox | Vinga | Vinsoc
Vios | Viper | Vipro | Virzo | Vision Technology | Vision Touch | Visitech
Visual Land | Vitelcom | Vitumi | Vityaz | Viumee | Vivax | VIVIBright
VIVIMAGE | Vivo | VIWA | Vizio | Vizmo | VK Mobile | VKworld
VNPT Technology | VOCAL | Vodacom | Vodafone | VOGA | Völfen | VOLIA
VOLKANO | Volla | Volt | Vonino | Vontar | Vorago | Vorcom
Vorke | Vormor | Vortex | VORTEX (RO) | Voto | VOX | Voxtel
Voyo | Vsmart | Vsun | VUCATIMES | Vue Micro | Vulcan | VVETIME
W&O | WAF | Wainyok | Walker | Waltham | Walton | Waltter
Wanmukang | WANSA | WE | We. by Loewe. | Web TV | Webfleet | WeChip
Wecool | Weelikeit | Weiimi | Weimei | WellcoM | WELLINGTON | Western Digital
Weston | Westpoint | Wexler | White Mobile | Whoop | Wieppo | Wigor
Wiko | WildRed | Wileyfox | Winds | Wink | Winmax | Winnovo
Winstar | Wintouch | Wiseasy | WIWA | WizarPos | Wizz | Wolder
Wolfgang | Wolki | WONDER | Wonu | Woo | Wortmann | Woxter
WOZIFAN | WS | X-AGE | X-BO | X-Mobile | X-TIGI | X-View
X.Vision | X88 | X96 | X96Q | XB | Xcell | XCOM
Xcruiser | XElectron | XGEM | XGIMI | Xgody | Xiaodu | Xiaolajiao
Xiaomi | Xion | Xolo | Xoro | XPPen | XREAL | Xshitou
Xsmart | Xtouch | Xtratech | Xwave | XY Auto | Yandex | Yarvik
YASIN | YELLYOUTH | YEPEN | Yes | Yestel | Yezz | Yoka TV
Yooz | Yota | YOTOPT | Youin | Youwei | Ytone | Yu
YU Fly | Yuandao | YUHO | YUMKEM | YUNDOO | Yuno | YunSong
Yusun | Yxtel | Z-Kai | Zaith | Zamolxe | Zatec | Zealot
Zeblaze | Zebra | Zeeker | Zeemi | Zen | Zenek | Zentality
Zfiner | ZH&K | Zidoo | ZIFFLER | ZIFRO | Zigo | ZIK
Zinox | ZIOVO | Ziox | Zonda | Zonko | Zoom | ZoomSmart
Zopo | ZTE | Zuum | Zync | ZYQ | Zyrex | ZZB


</details>

[[top]](#top)

<a name="device-types"></a>
<details>
<summary>Support device types:</summary>

| type | id |
| ----  | ---- |
| desktop | 0 |
| smartphone | 1 |
| tablet | 2 |
| feature phone | 3 |
| console | 4 |
| tv | 5 |
| car browser | 6 |
| smart display | 7 | 
| camera | 8 |
| portable media player | 9 |
| phablet | 10 |
| smart speaker | 11 |
| wearable | 12 |
| peripheral | 13 |

</details>


##### Support detect browsers list (679):

<details>
<summary>Show details</summary>

  Browser  |  Browser  |  Browser  |  Browser  |  Browser  |  Browser  |  Browser 
--- | --- | --- | --- | --- | --- | ---
115 Browser | 18+ Privacy Browser | 1DM Browser | 1DM+ Browser | 2345 Browser | 360 Phone Browser | 360 Secure Browser
7654 Browser | 7Star | ABrowse | Acoo Browser | AdBlock Browser | Adult Browser | Ai Browser
Airfind Secure Browser | Aloha Browser | Aloha Browser Lite | AltiBrowser | ALVA | Amaya | Amaze Browser
Amerigo | Amiga Aweb | Amiga Voyager | Amigo | Android Browser | Anka Browser | ANT Fresco
ANTGalio | AOL Desktop | AOL Explorer | AOL Shield | AOL Shield Pro | Aplix | APN Browser
AppBrowzer | AppTec Secure Browser | APUS Browser | Arachne | Arc Search | Arctic Fox | Armorfly Browser
Arora | Arvin | Ask.com | Asus Browser | Atlas | Atom | Atomic Web Browser
Avant Browser | Avast Secure Browser | AVG Secure Browser | Avira Secure Browser | Awesomium | AwoX | Azka Browser
B-Line | Baidu Browser | Baidu Spark | Bang | Bangla Browser | Basic Web Browser | Basilisk
Beaker Browser | Beamrise | Belva Browser | Beonex | Berry Browser | Beyond Private Browser | BF Browser
Bitchute Browser | Biyubi | BizBrowser | Black Lion Browser | BlackBerry Browser | BlackHawk | Bloket
Blue Browser | Bluefy | Bonsai | Borealis Navigator | Brave | BriskBard | BroKeep Browser
Browlser | BrowsBit | BrowseHere | Browser Hup Pro | Browser Mini | BrowseX | Browspeed Browser
Browzar | Bunjalloo | BXE Browser | Byffox | Cake Browser | Camino | Catalyst
Catsxp | Cave Browser | CCleaner | Centaury | CG Browser | ChanjetCloud | Charon
Chedot | Cheetah Browser | Cherry Browser | Cheshire | Chim Lac | Chowbo | Chrome
Chrome Frame | Chrome Mobile | Chrome Mobile iOS | Chrome Webview | ChromePlus | Chromium | Chromium GOST
Classilla | Cliqz | CM Browser | CM Mini | Coast | Coc Coc | Colibri
Colom Browser | Columbus Browser | CometBird | Comfort Browser | Comodo Dragon | Conkeror | CoolBrowser
CoolNovo | Cornowser | COS Browser | Craving Explorer | Crazy Browser | Cromite | Crow Browser
Crusta | Cunaguaro | Cyberfox | CyBrowser | Dark Browser | Dark Web | Dark Web Browser
Dark Web Private | dbrowser | Debuggable Browser | Decentr | Deepnet Explorer | deg-degan | Deledao
Delta Browser | Desi Browser | DeskBrowse | Dezor | Diigo Browser | Dillo | DoCoMo
Dolphin | Dolphin Zero | Dooble | Dorado | Dot Browser | Dragon Browser | DUC Browser
DuckDuckGo Privacy Browser | East Browser | Easy Browser | Ecosia | Edge WebView | EinkBro | Element Browser
Elements Browser | Elinks | Eolie | Epic | Espial TV Browser | EudoraWeb | EUI Browser
Every Browser | Explore Browser | eZ Browser | Falkon | Fast Browser UC Lite | Fast Explorer | Faux Browser
Fennec | fGet | Fiery Browser | Fire Browser | Firebird | Firefox | Firefox Focus
Firefox Klar | Firefox Mobile | Firefox Mobile iOS | Firefox Reality | Firefox Rocket | Fireweb | Fireweb Navigator
Flash Browser | Flast | Float Browser | Flock | Floorp | Flow | Flow Browser
Fluid | Flyperlink | FOSS Browser | Freedom Browser | FreeU | Frost | Frost+
Fulldive | G Browser | Galeon | Gener8 | Ghostery Privacy Browser | GinxDroid Browser | Glass Browser
GNOME Web | GO Browser | GoBrowser | Godzilla Browser | GOG Galaxy | GoKu | Good Browser
Google Earth | Google Earth Pro | GreenBrowser | Habit Browser | Halo Browser | Harman Browser | HasBrowser
Hawk Quick Browser | Hawk Turbo Browser | Headless Chrome | Helio | Herond Browser | Hexa Web Browser | Hi Browser
hola! Browser | Holla Web Browser | HONOR Browser | HotBrowser | HotJava | HTC Browser | Huawei Browser
Huawei Browser Mobile | HUB Browser | IBrowse | iBrowser | iBrowser Mini | iCab | iCab Mobile
IceCat | IceDragon | Iceweasel | iDesktop PC Browser | IE Browser Fast | IE Mobile | Impervious Browser
InBrowser | Incognito Browser | Indian UC Mini Browser | iNet Browser | Inspect Browser | Insta Browser | Internet Browser Secure
Internet Explorer | Internet Webbrowser | Intune Managed Browser | Involta Go | Iridium | Iron | Iron Mobile
Isivioo | IVVI Browser | Japan Browser | Jasmine | JavaFX | Jelly | Jig Browser
Jig Browser Plus | JioSphere | JUZI Browser | K-meleon | K-Ninja | K.Browser | Kapiko
Kazehakase | Keepsafe Browser | KeepSolid Browser | Keyboard Browser | Kids Safe Browser | Kindle Browser | Kinza
Kitt | Kiwi | Kode Browser | Konqueror | KUN | KUTO Mini Browser | Kylo
Ladybird | Lagatos Browser | Lark Browser | Legan Browser | Lenovo Browser | Lexi Browser | LG Browser
LieBaoFast | Light | Lightning Browser | Lightning Browser Plus | Lilo | Links | Liri Browser
LogicUI TV Browser | Lolifox | Lotus | Lovense Browser | LT Browser | LuaKit | LUJO TV Browser
Lulumi | Lunascape | Lunascape Lite | Lynket Browser | Lynx | Maelstrom | Mandarin
Maple | MarsLab Web Browser | MAUI WAP Browser | MaxBrowser | Maxthon | MaxTube Browser | mCent
Me Browser | Meizu Browser | Mercury | Mi Browser | MicroB | Microsoft Edge | Midori
Midori Lite | Minimo | Mint Browser | Mises | MixerBox AI | MMBOX XBrowser | Mmx Browser
Mobicip | Mobile Safari | Mobile Silk | Mogok Browser | Monument Browser | Motorola Internet Browser | MxNitro
Mypal | Naenara Browser | Naked Browser | Naked Browser Pro | Navigateur Web | NCSA Mosaic | NetFront
NetFront Life | NetPositive | Netscape | NetSurf | NextWord Browser | NFS Browser | Ninesky
Ninetails | Nokia Browser | Nokia OSS Browser | Nokia Ovi Browser | NOMone VR Browser | NOOK Browser | Norton Private Browser
Nova Video Downloader Pro | Nox Browser | NTENT Browser | Nuanti Meta | Nuviu | Obigo | Ocean Browser
OceanHero | Oculus Browser | Odd Browser | Odin | Odin Browser | Odyssey Web Browser | Off By One
Office Browser | OH Browser | OH Private Browser | OhHai Browser | OJR Browser | OmniWeb | OnBrowser Lite
ONE Browser | Onion Browser | ONIONBrowser | Open Browser | Open Browser 4U | Open Browser fast 5G | Open Browser Lite
Open TV Browser | OpenFin | Openwave Mobile Browser | Opera | Opera Crypto | Opera Devices | Opera GX
Opera Mini | Opera Mini iOS | Opera Mobile | Opera Neon | Opera Next | Opera Touch | Oppo Browser
Opus Browser | Orbitum | Orca | Ordissimo | Oregano | Origin In-Game Overlay | Origyn Web Browser
OrNET Browser | Otter Browser | Owl Browser | Pale Moon | Palm Blazer | Palm Pre | Palm WebPro
Palmscape | Pawxy | Peach Browser | Peeps dBrowser | Perfect Browser | Perk | Phantom Browser
Phantom.me | Phoenix | Phoenix Browser | Photon | Pi Browser | PICO Browser | Pintar Browser
PirateBrowser | PlayFree Browser | Pluma | Pocket Internet Explorer | PocketBook Browser | Polaris | Polarity
PolyBrowser | Polypane | Presearch | Prism | Privacy Browser | Privacy Explorer Fast Safe | Privacy Pioneer Browser
PrivacyWall | Private Internet Browser | PronHub Browser | Proxy Browser | ProxyFox | Proxyium | ProxyMax
Proxynet | PSI Secure Browser | Puffin Cloud Browser | Puffin Incognito Browser | Puffin Secure Browser | Puffin Web Browser | Pure Lite Browser
Pure Mini Browser | Qazweb | Qiyu | QJY TV Browser | Qmamu | QQ Browser | QQ Browser Lite
QQ Browser Mini | QtWeb | QtWebEngine | Quark | Quick Browser | Quick Search TV | QupZilla
Qutebrowser | Qwant Mobile | Rabbit Private Browser | Raise Fast Browser | Rakuten Browser | Rakuten Web Search | Raspbian Chromium
RCA Tor Explorer | Realme Browser | Rekonq | Reqwireless WebViewer | Roccat | RockMelt | Roku Browser
Safari | Safari Technology Preview | Safe Exam Browser | Sailfish Browser | SalamWeb | Samsung Browser | Samsung Browser Lite
Savannah Browser | SavySoda | SberBrowser | Secure Browser | Secure Private Browser | SecureX | Seewo Browser
SEMC-Browser | Seraphic Sraf | Seznam Browser | SFive | Sharkee Browser | Shiira | Sidekick
SilverMob US | SimpleBrowser | Singlebox | SiteKiosk | Sizzy | Skye | Skyfire
SkyLeap | Sleipnir | SlimBoat | Slimjet | Smart Browser | Smart Lenovo Browser | Smart Search & Web Browser
Smooz | Snowshoe | Sogou Explorer | Sogou Mobile Browser | Sony Small Browser | SOTI Surf | Soul Browser
Soundy Browser | SP Browser | Spark | Spectre Browser | Splash | Sputnik Browser | Stampy Browser
Stargon | START Internet Browser | Stealth Browser | Steam In-Game Overlay | Streamy | Sunflower Browser | Sunrise
Super Fast Browser | SuperBird | SuperFast Browser | surf | Surf Browser | Surfy Browser | Sushi Browser
Sweet Browser | Swiftfox | Swiftweasel | SX Browser | T-Browser | t-online.de Browser | T+Browser
TalkTo | Tao Browser | tararia | TenFourFox | Tenta Browser | Tesla Browser | Thor
Tint Browser | Tizen Browser | ToGate | Tor Browser | Total Browser | TQ Browser | TrueLocation Browser
TUC Mini Browser | Tungsten | TUSK | TV Bro | TV-Browser Internet | TweakStyle | U Browser
UBrowser | UC Browser | UC Browser HD | UC Browser Mini | UC Browser Turbo | Ui Browser Mini | Ume Browser
UPhone Browser | UR Browser | Uzbl | Vast Browser | vBrowser | VD Browser | Veera
Vegas Browser | Venus Browser | Vertex Surf | Vewd Browser | Via | Viasat Browser | VibeMate
Vision Mobile Browser | Vivaldi | Vivid Browser Mini | vivo Browser | VMS Mosaic | VMware AirWatch | Vonkeror
Vuhuv | w3m | Waterfox | Wave Browser | Wavebox | Wear Internet Browser | Web Browser & Explorer
Web Explorer | WebDiscover | Webian Shell | WebPositive | Weltweitimnetz Browser | WeTab Browser | Wexond
Whale Browser | Whale TV Browser | Wolvic | World Browser | wOSBrowser | Wukong Browser | Wyzo
X Browser Lite | X-VPN | xBrowser | XBrowser Mini | xBrowser Pro Super Fast | Xiino | XnBrowse
XNX Browser | Xooloo Internet | xStand | XtremeCast | Xvast | Yaani Browser | YAGI
Yahoo! Japan Browser | Yandex Browser | Yandex Browser Corp | Yandex Browser Lite | Yo Browser | Yolo Browser | YouBrowser
YouCare | Yuzu Browser | Zetakey | Zirco Browser | Zordo Browser | ZTE Browser | Zvu

</details>

[[top]](#top)

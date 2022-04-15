* added `@ts-ignore` annotation since TSC ignores the presence of constructor

```ts

import DeviceDetector = require('node-device-detector');
import DeviceHelper = require('node-device-detector/helper');
import ClientHints = require('node-device-detector/client-hints');

/* or */

/*
import * as DeviceDetector from 'node-device-detector';
import * as DeviceHelper from 'node-device-detector/helper';
import * as ClientHints from 'node-device-detector/client-hints';

*/

//@ts-ignore
const detector = new DeviceDetector({
  deviceIndex: true
});
//@ts-ignore
const clientHints = new ClientHints;

const userAgent = 'Mozilla/5.0 (Linux; arm_64; Android 8.1.0; ZC554KL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.174 YaApp_Android/22.14.1 YaSearchBrowser/22.14.1 BroPP/1.0 SA/3 Mobile Safari/537.36';
/* or req.headers['user-agent'] */
const headers = {
  'Sec-CH-UA': '" Not A;Brand";v="99", "Chromium";v="96", "Yandex";v="22"',
  'Sec-CH-UA-Platform': "Android",
  'Sec-CH-UA-Mobile': "?1",
  'Sec-CH-UA-Full-Version': "22.1.4.706",
  'Sec-CH-UA-Platform-Version': "8.1.0",
  'Sec-CH-UA-Model': "ZC554KL",
  'Sec-CH-Prefers-Color-Scheme': "light",
} 
/* or req.headers */
const result = detector.detect(userAgent, clientHints.parse(headers));

console.log(
  'result:',
  result,
  'isSmartphone:',
  DeviceHelper.isSmartphone(result)
);

```
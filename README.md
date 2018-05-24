# node-device-detector


port phplib piwik/device-detector from nodejs

### library works only under nodejs v10+

### Usage

```js
const detector = new require('node-device-detector');
console.dir(detector.findBrowser('user-agent'));
```
local install production
```
npm install node-device-detector --production
```
local machine install is developer
```
npm install --only=dev
```
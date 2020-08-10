Micro service  from framework [moleculer js](http://moleculer.services)
-

## uses

```
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';

const deviceData = await this.broker.call("device-detector.device", {
  userAgent: userAgent
});

// or

this.broker.call("device-detector.device", {
  userAgent: userAgent
}).then( deviceData => {

})


```


## source: service & mixin

* create service, file `services/device-detectror.service.js`
```js
const Service = require("moleculer").Service;
const DetectDetector = require('node-device-detector');
const MemCache = require("../mixins/memcache");
const crypto = require('crypto');


const DEVICE_TYPE = require('node-device-detector/parser/const/device-type');

/**
 * @typedef {Object} DetectCtxParams
 * @property {String} userAgent
 */

class DeviceDetectorService extends Service {
  
  #cache = true;
  #detectFull = false;
  #detector;
  
  constructor(broker) {
	super(broker);
	
	this.parseServiceSchema({
	  name: 'device-detector',
	  mixins: [
		MemCache({})
	  ],
	  actions: {
		"device": this.detectDeviceHandler,
		"bot": this.detectBotHandler
	  },
	  created: this.serviceCreated,
	  started: this.serviceStarted,
	  stopped: this.serviceStopped,
	});
  }
  
  // public
  
  /**
   * @param {DetectCtxParams} ctx.params
   * @returns {Promise<Object>}
   */
  async detectDeviceHandler(ctx) {
	const {userAgent} = ctx.params;
	let detectData = null;
	let cacheData = null;
	let keyCache = null;
	
	if (this.#cache) {
	  keyCache = crypto.createHash('md5').update(userAgent).digest('hex');
	  cacheData = await this.memcache.get(keyCache);
	  if (cacheData) {
		detectData = cacheData;
	  }
	}
	
	if (!detectData) {
	  if(this.#detectFull){
		detectData= this.detectFull(userAgent);
	  } else {
		detectData= this.detectLite(userAgent);
	  }
	}
	
	if (this.#cache && cacheData) {
	  await this.memcache.set(keyCache, detectData, 3600);
	}
	
	let mixData = this.detectTypes(detectData);
	return Object.assign({}, detectData, mixData);
  }
  
  
  /**
   * @param {DetectCtxParams} ctx.params
   * @returns {Promise<Object>}
   */
  detectBotHandler(ctx) {
	const {userAgent} = ctx.params;
	return this.#detector.parseBot(userAgent);
  }
  
  // private
  
  detectFull(userAgent){
	return this.#detector.detect(userAgent);
  }
  
  detectLite(userAgent){
	let resultOs = this.#detector.parseOs(userAgent);
	let resultClient = this.#detector.parseClient(userAgent);
	let resultDeviceType = this.#detector.parseDeviceType(userAgent, resultOs, resultClient, {});
	return Object.assign({os: resultOs}, {client: resultClient}, {device: resultDeviceType});
  }
  
  detectTypes(detectData) {
	let isTabled = detectData.device && [DEVICE_TYPE.TABLET].indexOf(detectData.device.type) !== -1;
	let isMobile = detectData.device && [DEVICE_TYPE.SMARTPHONE, DEVICE_TYPE.FEATURE_PHONE].indexOf(detectData.device.type) !== -1;
	let isPhablet = detectData.device && [DEVICE_TYPE.PHABLET].indexOf(detectData.device.type) !== -1;
	let isIOS = detectData.os && detectData.os.family === 'iOS';
	let isIPhone = '';
	let isAndroid = detectData.os && detectData.os.family === 'Android';
	let isDesktop = !isTabled && !isMobile && !isPhablet;
	
	return {
	  isDesktop: isDesktop,
	  isTabled: isTabled,
	  isMobile: isMobile,
	  isPhablet: isPhablet,
	  isIOS: isIOS,
	  isIPhone: isIPhone,
	  isAndroid: isAndroid
	};
  }
  
  
  serviceCreated() {
	this.#detector = new DetectDetector();
  }
  
  serviceStarted() {
  }
  
  serviceStopped() {
  }
  
}

module.exports = DeviceDetectorService;
```

* create mixin, file `mixins/memcache.js`

```js
const Memcached = require('memcached');

/**
 * usages in service
 *
 *   let resultGet = await this.memcache.get(<key>)
 *   let resultSet = await this.memcache.set(<key>, <data>)
 *   let resultRemove = await this.memcache.remove(<key>)
 * */

class MemCacheAdapter {
  
  #cache = null;
  
  constructor(config = {}) {
	this.#cache = new Memcached();
  }
  
  /**
   * @param {String} key
   * @param {*} val
   * @param {Number} expTime
   * @returns {Promise<any>}
   */
  set(key, val, expTime = 3600) {
	return new Promise((resolve, reject) => {
	  this.#cache.set(key, val, expTime, (err) => {
		if (err) {
		  reject(err);
		} else {
		  resolve(null);
		}
	  });
	});
  }
  
  /**
   * @param {String} key
   * @returns {Promise<any>}
   */
  remove(key) {
	return new Promise((resolve, reject) => {
	  this.#cache.del(key, (err, result) => {
		if (err) {
		  reject(err);
		} else {
		  resolve(result);
		}
	  });
	});
  }
  
  /**
   * @param {String} key
   * @returns {Promise<any>}
   */
  get(key) {
	return new Promise((resolve, reject) => {
	  this.#cache.get(key, (err, result) => {
		if (err) {
		  reject(err);
		} else {
		  resolve(result);
		}
	  });
	});
  }
  
  on(event, callback) {
	this.#cache.on(event, callback);
  }
}


/*
 *
 * @param componentName
 * @param config
 * @returns {{settings: {[p: string]: *}, stopped(), created(): void, started()}}
 */
module.exports = ({keyComponent: componentName = 'memcache', config: config} = {}) => ({
  settings: {
	[componentName]: config,
  },
  created() {
	
	this[componentName] = new MemCacheAdapter(this.settings[componentName]);
	this[componentName].on('failure', (details) => {
	  this.logger.error(
		`Server ${details.server} went down due to: ${details.messages.join('')}`
	  );
	});
	this[componentName].on('reconnecting', (details) => {
	  this.logger.info(
		`Total downtime caused by server ${details.server} : ${details.totalDownTime} ms`
	  );
	});
  },
  
  started() {
  },
  
  stopped() {
  },
  
});
```
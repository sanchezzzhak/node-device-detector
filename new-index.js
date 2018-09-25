module.exports = DeviceDetector;

const helper = require('./parser/helper');
// device parsers
const MobileParser = require('./parser/device/mobile');
const HbbTvParser = require('./parser/device/hbb-tv');
const Console = require('./parser/device/console');
const CarBrowser = require('./parser/device/car-browser');
const Camera = require('./parser/device/camera');
const PortableMediaPlayer = require('./parser/device/portable-media-player');
// client parsers
const MobileApp = require('./parser/client/mobile-app');
const MediaPlayer = require('./parser/client/media-player');
const Browser = require('./parser/client/browser');
const Library = require('./parser/client/library');
const FeedReader = require('./parser/client/feed-reader');
const PIM = require('./parser/client/pim');
// os parsers
const OsParser = require('./parser/os-abstract-parser');

const DEVICE_TYPE = require('./parser/const/device-type');
const DEVICE_PARSER = {
  MOBILE: 'Mobile',
  HBBTV: 'hbbtv',
  CONSOLE: 'console',
  CAR_BROWSER: 'CarBrowser',
  CAMERA: 'Camera',
  PORTABLE_MEDIA_PLAYER: 'PortableMediaPlayer'
};
const CLIENT_PARSER = {
  FEED_READER: 'FeedReader',
  MEDIA_PLAYER: 'MediaPlayer',
  PIM: 'PIM',
  MOBILE_APP: 'MobileApp',
  LIBRARY: 'Library',
  BROWSER: 'Browser',
};

function DeviceDetector(options){
  this.osData = null;
  this.deviceData = null;
  this.clientData = null;

  this.osParserList = {};
  this.deviceParserList = {};
  this.clientParserList = {};

  this.init();
}

DeviceDetector.prototype.init = function(){

  this.addParseOs("Os", new OsParser);

  this.addParseClient(CLIENT_PARSER.FEED_READER, new FeedReader);
  this.addParseClient(CLIENT_PARSER.MOBILE_APP, new MobileApp);
  this.addParseClient(CLIENT_PARSER.MEDIA_PLAYER, new MediaPlayer);
  this.addParseClient(CLIENT_PARSER.PIM, new PIM);
  this.addParseClient(CLIENT_PARSER.BROWSER, new Browser);
  this.addParseClient(CLIENT_PARSER.LIBRARY, new Library);

  this.addParseDevice(DEVICE_PARSER.HBBTV, new HbbTvParser);
  this.addParseDevice(DEVICE_PARSER.CONSOLE, new Console);
  this.addParseDevice(DEVICE_PARSER.CAR_BROWSER, new CarBrowser());
  this.addParseDevice(DEVICE_PARSER.CAMERA, new Camera());
  this.addParseDevice(DEVICE_PARSER.PORTABLE_MEDIA_PLAYER, new PortableMediaPlayer());
  this.addParseDevice(DEVICE_PARSER.MOBILE, new MobileParser);

};

DeviceDetector.prototype.getParseDevice = function (name) {
  return this.deviceParserList[name] ? this.deviceParserList[name] : null;
};

DeviceDetector.prototype.getParseClient = function (name) {
  return this.clientParserList[name] ? this.clientParserList[name] : null;
};

DeviceDetector.prototype.getParseOs = function (name) {
  return this.osParserList[name] ? this.osParserList[name] : null;
};

DeviceDetector.prototype.addParseDevice = function(name, parser){
  this.deviceParserList[name] = parser;
};

DeviceDetector.prototype.addParseOs = function(name, parser){
  this.osParserList[name] = parser;
};

DeviceDetector.prototype.addParseClient = function(name, parser){
  this.clientParserList[name] = parser;
};

/**
 * parse os
 */
DeviceDetector.prototype.parseOs = function(){
  for(let name in this.osParserList){
    let parser = this.osParserList[name];
    let result = parser.parse(this.userAgent);
    if(result){
      this.osData = parser.getParseData();
      break;
    }
  }
};

DeviceDetector.prototype.getDeviceAttr = function(attr, defaultValue){
    return this.deviceData && this.deviceData[attr] ? this.deviceData[attr]: defaultValue;
};

DeviceDetector.prototype.getOsAttr = function(attr, defaultValue){
  return this.osData && this.osData[attr] ? this.osData[attr]: defaultValue;
};

DeviceDetector.prototype.getClientAttr = function(attr, defaultValue){
  return this.clientData && this.clientData[attr] ? this.clientData[attr]: defaultValue;
};

/**
 * parse device
 */
DeviceDetector.prototype.parseDevice = function(){

  for(let name in this.deviceParserList){
    let parser = this.deviceParserList[name];
    let result = parser.parse(this.userAgent);
    if(result){
      this.deviceData = parser.getParseData();
      break;
    }
  }

  let osFamily = this.getOsAttr('name', '');
  let osShortName = this.getOsAttr('short_name', '');
  let osVersion = this.getOsAttr('version', '');
  let clientName = this.getClientAttr('name', '');
  let chromeClients = ['Chrome', 'Chrome Mobile'];


  if (this.deviceData.type === '' &&  osFamily === 'Android' &&  chromeClients.indexOf(clientName) !== -1) {
    if (helper.matchUserAgent('Chrome/[\\.0-9]* Mobile', this.userAgent) !== null) {
      this.deviceData.type = DEVICE_TYPE.SMARTPHONE
    } else if (helper.matchUserAgent('Chrome/[\.0-9]* (?!Mobile)', this.userAgent) !== null) {
      this.deviceData.type = DEVICE_TYPE.TABLET
    }
  }

  if (this.deviceData.type === '' && (helper.hasAndroidTableFragment(this.userAgent) || helper.hasOperaTableFragment(this.userAgent)  )){
    this.deviceData.type = DEVICE_TYPE.TABLET;
  }

  if (this.deviceData.type === '' && (helper.hasAndroidMobileFragment.userAgent)){
    this.deviceData.type = DEVICE_TYPE.SMARTPHONE;
  }

  if (this.deviceData.type === '' && osShortName === 'AND' && osVersion !== '') {
    if (helper.versionCompare(osVersion, '2.0') === -1) {
      this.deviceData.type = DEVICE_TYPE.SMARTPHONE;
    } else if (helper.versionCompare(osVersion, '3.0') >= 0 && helper.versionCompare(osVersion, '4.0') === -1) {
      this.deviceData.type = DEVICE_TYPE.TABLET;
    }
  }

   if (this.deviceData.type === DEVICE_TYPE.FEATURE_PHONE && osFamily === 'Android') {
     this.deviceData.type = DEVICE_TYPE.SMARTPHONE;
  }

  if (this.deviceData.type === '' && (osShortName === 'WRT' || (osShortName === 'WIN' && helper.versionCompare(osVersion, '8.0'))) && helper.hasTouchFragment(this.userAgent)) {
    this.deviceData.type = DEVICE_TYPE.TABLET;
  }

  if (helper.hasOperaTVStoreFragment(this.userAgent)) {
    this.deviceData.type = DEVICE_TYPE.TABLET;
  }

  const tvClients = ['Kylo', 'Espial TV Browser'];
  if (this.deviceData.type === '' && tvClients.indexOf(clientName) !== -1) {
    this.deviceData.type = DEVICE_TYPE.TV;
  }

  if(this.deviceData.type === '' /* && $this->isDesktop()*/){
    this.deviceData.type =  DEVICE_TYPE.DESKTOP;
  }
};

/**
 * @todo need realisation
 */
DeviceDetector.prototype.parseBot = function(){

};

/**
 * parse client
 */
DeviceDetector.prototype.parseClient = function(){
  for(let name in this.clientParserList){
    let parser = this.clientParserList[name];
    let result = parser.parse(this.userAgent);
    if(result){
      this.clientData = parser.getParseData();
      break;
    }
  }
};

/**
 * @param userAgent
 * @return {{os: (null|*), device: (null|*), client: (null|*)}}
 */
DeviceDetector.prototype.detect = function(userAgent){
  this.reset();
  this.userAgent = userAgent;

  this.parseBot();
  this.parseOs();
  this.parseDevice();
  this.parseClient();

  return {
    os: this.osData,
    device: this.deviceData,
    client: this.clientData
  };
};

/**
 * reset detect result
 */
DeviceDetector.prototype.reset = function(){
  this.userAgent = null;
  this.deviceData = {
    id : '',
    type: '',
    brand: '',
    model: ''
  };
  this.clientData = null;
};

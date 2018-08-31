module.exports = DeviceDetector;

// device parsers
const MobileParser = require('./parser/device/mobile');
const HbbTvParser = require('./parser/device/hbb-tv');
const Console = require('./parser/device/console');
const CarBrowser = require('./parser/device/car-browser');
const Camera = require('./parser/device/camera');
const PortableMediaPlayer = require('./parser/device/portable-media-player');
// client parsers
const MobileApp = require('./parser/client/mobile-app');
const Browser = require('./parser/client/browser');



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
  BROWSER: 'Browser'
};


function DeviceDetector(options){
  this.deviceData = null;
  this.clientData = null;
  this.deviceParserList = {};
  this.clientParserList = {};
  this.init();
}

DeviceDetector.prototype.init = function(){
  //FeedReader
  this.addParseClient(CLIENT_PARSER.MOBILE_APP, new MobileApp);
  //MediaPlayer
  //PIM
  this.addParseClient(CLIENT_PARSER.BROWSER, new Browser);
  //Library

  this.addParseDevice(DEVICE_PARSER.HBBTV, new HbbTvParser);
  this.addParseDevice(DEVICE_PARSER.CONSOLE, new Console);
  this.addParseDevice(DEVICE_PARSER.CAR_BROWSER, new CarBrowser());
  this.addParseDevice(DEVICE_PARSER.CAMERA, new Camera());
  this.addParseDevice(DEVICE_PARSER.PORTABLE_MEDIA_PLAYER, new PortableMediaPlayer());
  this.addParseDevice(DEVICE_PARSER.MOBILE, new MobileParser);

};

DeviceDetector.prototype.addParseDevice = function(name, parser){
  this.deviceParserList[name] = parser;
};

DeviceDetector.prototype.addParseClient = function(name, parser){
  this.clientParserList[name] = parser;
};


DeviceDetector.prototype.parseDevice = function(){
  for(let name in this.deviceParserList){
    let parser = this.deviceParserList[name];
    let result = parser.parse(this.userAgent);
    if(result){
      this.deviceData = parser.getParseData();
      break;
    }
  }
  // old check
  //

};

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

DeviceDetector.prototype.detect = function(userAgent){
  this.reset();
  this.userAgent = userAgent;
  this.parseDevice();
  this.parseClient();

  return {
    device: this.deviceData,
    client: this.clientData
  };
};

/**
 *
 */
DeviceDetector.prototype.reset = function(){
  this.userAgent = null;
  this.deviceData = null;
  this.clientData = null;
};

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
const MediaPlayer = require('./parser/client/media-player');
const Browser = require('./parser/client/browser');
const Library = require('./parser/client/library');
const FeedReader = require('./parser/client/feed-reader');
const PIM = require('./parser/client/pim');
// os
const OsParser = require('./parser/os-abstract-parser');


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

DeviceDetector.prototype.addParseDevice = function(name, parser){
  this.deviceParserList[name] = parser;
};

DeviceDetector.prototype.addParseOs = function(name, parser){
  this.osParserList[name] = parser;
};

DeviceDetector.prototype.addParseClient = function(name, parser){
  this.clientParserList[name] = parser;
};

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


DeviceDetector.prototype.parseDevice = function(){
  for(let name in this.deviceParserList){
    let parser = this.deviceParserList[name];
    let result = parser.parse(this.userAgent);
    if(result){
      this.deviceData = parser.getParseData();
      break;
    }
  }
};

DeviceDetector.prototype.parseBot = function(){

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
 *
 */
DeviceDetector.prototype.reset = function(){
  this.userAgent = null;
  this.deviceData = null;
  this.clientData = null;
};

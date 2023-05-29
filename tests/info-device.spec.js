const fs = require('fs');
const InfoDevice = require('../parser/device/info-device');
const DeviceDetector = require('../index');
const DeviceHelper = require('../helper');
const {YAMLLoad, getFixtureFolder, perryJSON} = require('./functions');
const {should, assert, expect} = require('chai');

const DATA_DEVICE_INFO = YAMLLoad(
  __dirname + '/../regexes/device-info/device.yml',
);

let ymlDeviceInfoFiles = fs.readdirSync(getFixtureFolder() + 'devices-info/');
const detector = new DeviceDetector({discardDeviceIndexes: false});
const infoDevice = new InfoDevice();
const TIMEOUT = 6000;

describe('tests info-device', function() {
  this.timeout(TIMEOUT);
  
  it('test get unknown result', () => {
    let result = infoDevice.info('unknown', 'unknown');
    expect(result).to.equal(null);
  });
  
  it('test get results', () => {
    infoDevice.setResolutionConvertObject(false);
    infoDevice.setSizeConvertObject(false);
    let result = infoDevice.info('Asus', 'ZenFone 4');
    expect(result.display.size).to.equal('5.5');
    expect(result.display.ratio).to.equal('16:9');
    expect(result.display.resolution).to.equal('1080x1920');
    expect(result.size).to.equal('75.2x155.4x7.7');
    expect(result.weight).to.equal('165');
    expect(result.release).to.equal('2017.08');
  });
  
  it('test get redirect result', () => {
    let result = infoDevice.info('Bravis', 'B501 Easy');
    expect(result !== null).to.equal(true);
  });
  
  it('test case size', () => {
    infoDevice.setResolutionConvertObject(true);
    infoDevice.setSizeConvertObject(true);
    let result = infoDevice.info('Asus', 'ZenFone 4');
    
    expect(result.display.resolution).to.deep.equal({
      width: '1080',
      height: '1920',
    });
    expect(result.size.width).to.equal('75.2');
    expect(result.size.height).to.equal('155.4');
    expect(result.size.thickness).to.equal('7.7');
  });
  
  let patternNumber = /^[0-9.]+$/i;
  let patternFloat = /^[0-9.]+$/i;
  let patternRatio = /^[0-9.]+:[0-9.]+$/i;
  let patternYear = /^([0-9]{4}\.(1[0-2]|0[1-9])|[0-9]{4})$/i;
  
  for (let brand in DATA_DEVICE_INFO) {
    for (let model in DATA_DEVICE_INFO[brand]) {
      let rawSource = DATA_DEVICE_INFO[brand][model];
      it(brand + ' - ' + model, () => {
        infoDevice.setSizeConvertObject(true);
        infoDevice.setResolutionConvertObject(true);
        let result = infoDevice.info(brand, model);
        
        if (result === null) {
          expect(rawSource !== void 0).to.equal(true);
          return;
        }
        
        let formatMessageFloat = `brand (${brand})  model (${model}) value does not match format ^[0-9.]+$ result: ${perryJSON(
          result,
        )}`;
        let formatMessageRatio = `brand (${brand})  model (${model}) value does not match format ^[0-9.]+:[0-9.]+$ result: ${perryJSON(
          result,
        )}`;
        let formatMessageNumber = `brand (${brand})  model (${model}) value does not match format ^[0-9]+$  result: ${perryJSON(
          result,
        )}`;
        let formatMessageYear = `brand (${brand})  model (${model}) value does not match format ^[0-9]{4}\.(1[0-2]|0[1-9])|[0-9]{4})$  result: ${perryJSON(
          result,
        )}`;
        
        if (result.display) {
          if (result.display.size) {
            expect(
              result.display.size,
              'display.size(DS) ' + formatMessageFloat,
            ).to.match(patternFloat);
            
          }
          if (result.display.resolution) {
            expect(result.display.ratio, formatMessageRatio).
            to.
            match(patternRatio);
            expect(
              result.display.resolution.width,
              'display.width(RS) ' + formatMessageFloat,
            ).to.match(patternFloat);
            expect(
              result.display.resolution.height,
              'display.height(RS) ' + formatMessageFloat,
            ).to.match(patternFloat);
            expect(result.display.ppi, formatMessageFloat).
            to.
            match(patternFloat);
          }
        }
        
        if (result.size) {
          expect(result.size.width, 'size.width(SZ) ' + formatMessageFloat).
          to.
          match(
            patternFloat,
          );
          expect(
            result.size.height,
            'size.height(SZ) ' + formatMessageFloat,
          ).to.match(patternFloat);
          expect(
            result.size.thickness,
            'size.thickness(SZ) ' + formatMessageFloat,
          ).to.match(patternFloat);
          
          // check correct width height for tablet
          if (result.display && parseFloat(result.display.size) >= 7) {
            let ua = `(${brand} ${model} build/xxxxx)`;
            if (result.size && parseFloat(result.size.width) <
              parseFloat(result.size.height)) {
              let detectResult = detector.detect(ua);
              if (DeviceHelper.isTablet(detectResult)) {
                console.log(result)
                throw new Error(`${brand} ${model} - physical size: width < height for table`)
              }
            }
            if (result.display.resolution &&
              parseFloat(result.display.resolution.width) <
              parseFloat(result.display.resolution.height)) {
              let detectResult = detector.detect(ua);
              if (DeviceHelper.isTablet(detectResult)) {
                throw new Error(`${brand} ${model} - display resolution: width < height for table`)
              }
            }
          }
        }

        if (result.performance && result.performance.antutu !== void 0) {
          expect(result.performance.antutu, formatMessageNumber).to.match(patternNumber);
        }

        if (result.weight !== void 0 && result.weight !== '') {
          expect(result.weight, formatMessageFloat).to.match(patternFloat);
        }
        if (result.release !== void 0 && result.release !== '') {
          expect(result.release, formatMessageYear).to.match(patternYear);
        }
        if (result.sim !== void 0) {
          expect(result.sim, formatMessageNumber).to.match(patternNumber);
        }
        
        if (result.hardware !== void 0) {
          if (result.hardware.ram) {
            expect(result.hardware.ram, formatMessageNumber).
            to.
            match(patternNumber);
          }
          
          if (result.hardware.cpu_id) {
            expect(result.hardware.cpu_id, formatMessageNumber).to.match(
              patternNumber,
            );
            expect(result.hardware.cpu).to.property('name');
            expect(result.hardware.cpu).to.property('type');
            expect(result.hardware.cpu).to.property('cores');
            expect(result.hardware.cpu).to.property('clock_rate');
          }
          if (result.hardware.gpu !== void 0) {
            expect(result.hardware.gpu).to.property('name');
            expect(result.hardware.gpu).to.property('clock_rate');
          }
        }
      });
    }
  }
  
  ymlDeviceInfoFiles.forEach(function(file) {
    describe('file fixture ' + file, function() {
      let fixtureData = YAMLLoad(getFixtureFolder() + 'devices-info/' + file);
      let total = fixtureData.length;
      
      fixtureData.forEach((fixture, pos) => {
        let itName = fixture.brand + ' - ' + fixture.model;
        
        it(itName, function() {
          infoDevice.setResolutionConvertObject(true);
          infoDevice.setSizeConvertObject(true);
          let result = infoDevice.info(fixture.brand, fixture.model);
          expect(fixture.result, 'Error in ' + itName).to.deep.equal(result);
        });
      });
    });
  });
});
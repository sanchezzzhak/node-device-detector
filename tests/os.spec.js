
const { should, assert, expect } = require('chai');
const {
  perryJSON,
  isObjNotEmpty,
  getFixtureFolder,
  YAMLLoad,
} = require('./functions');

const DeviceDetector = require('../index');


const TIMEOUT = 6000;
const detector = new DeviceDetector();
let fixtureFolder = getFixtureFolder();


function testVersionAndSkip(resultVersion, fixtureVersion, messageError) {
  try {
    expect(resultVersion, messageError).to.equal(String(fixtureVersion));
  } catch (e) {
    let regex = new RegExp('^([0-9]+).0$', 'i');
    let check =
        regex.exec(fixtureVersion) !== null &&
        Math.ceil(resultVersion) === Math.ceil(fixtureVersion);

    if (check) {
      console.log(
          'parse error version, fixture version %s | result version %s',
          fixtureVersion,
          resultVersion
      );
    } else {
      throw new SyntaxError(e.stack);
    }
  }
}


describe('tests oss', function () {
  let fixtureData = YAMLLoad(fixtureFolder + 'oss.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function () {

      let result = detector.detect(fixture.user_agent);
      let messageError = 'fixture data\n' + perryJSON(fixture);
      // test os data
      if (isObjNotEmpty(fixture.os.name)) {
        expect(fixture.os.name, messageError).to.equal(result.os.name);
      }
      if (isObjNotEmpty(fixture.os.short_name)) {
        expect(fixture.os.short_name, messageError).to.equal(result.os.short_name);
      }
      if (isObjNotEmpty(fixture.os.platform)) {
        expect(fixture.os.platform, messageError).to.equal(result.os.platform);
      }
      if (isObjNotEmpty(fixture.os.version)) {
        testVersionAndSkip.call(
            this,
            result.os.version,
            fixture.os.version,
            messageError
        );
      }
    });
  });
});

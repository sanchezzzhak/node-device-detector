
const { should, assert, expect } = require('chai');
const {
  perryJSON,
  isObjNotEmpty,
  getFixtureFolder,
  YAMLLoad,
} = require('./functions');

const OsDetector = require('../parser/os-abstract-parser');
const ClientHints = require('../client-hints');


const TIMEOUT = 6000;
const detector = new OsDetector();
const clientHints = new ClientHints();
let fixtureFolder = getFixtureFolder();


function testVersionAndSkip(resultVersion, fixtureVersion, messageError) {
  try {
    expect(resultVersion, messageError).to.equal(String(fixtureVersion));
  } catch (e) {
    let regex = new RegExp('^([0-9]+).0$', 'i');
    let check =
        regex.exec(''+ fixtureVersion) !== null &&
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

const runTest= (fixture, result) => {

  let messageError = 'fixture data\n' + perryJSON(fixture);

  if (isObjNotEmpty(fixture.os.name)) {
    expect(fixture.os.name, messageError).to.equal(result.name);
  }
  if (isObjNotEmpty(fixture.os.short_name)) {
    expect(fixture.os.short_name, messageError).to.equal(result.short_name);
  }
  if (isObjNotEmpty(fixture.os.platform)) {
    expect(fixture.os.platform, messageError).to.equal(result.platform);
  }
  expect('' + fixture.os.version, messageError).to.equal('' + result.version);
};

describe('tests oss', function () {
  let fixtureData = YAMLLoad(fixtureFolder + 'oss.yml');
  let total = fixtureData.length;
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function () {
      let result = detector.parse(fixture.user_agent, clientHints.parse(fixture.headers ?? {}));
      runTest(fixture, result)
    });
  });
});

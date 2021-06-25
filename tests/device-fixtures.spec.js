const fs = require('fs');

const { should, assert, expect } = require('chai');
const {
  YAMLLoad,
  getFixtureFolder,
} = require('./functions');

const TIMEOUT = 6000;

function checkRegexRuleForDoubleOr(regex) {
  return regex.indexOf('||') === -1;
}

function checkRegexVerticalLineClosingGroup(regex) {
  let pattern = '(?<!\\)(|))';
  if (regex.indexOf('|)') !== -1) {
    return new RegExp(pattern, 'is').test(regex);
  }
  return true;
}

function checkRegexRestrictionEndCondition(regex) {
  let regexPattern = /(\[[);\\\ ]{4}\])/;
  // get conditions [;)\ ]
  if (new RegExp(regexPattern, 'm').exec(regex) !== null) {
    return false;
  }
  
  // get conditions [);/ ] and check format
  let regexPatternCheck1 = /(?<!(?:\(\[\^[;/)]{3}\][+*]\)))(\[[);\/ ]{3,4}\])/;
  let matchConditionFormat1 = new RegExp(regexPatternCheck1, 'm').exec(regex);
  if (matchConditionFormat1 !== null) {
    // get conditions (?:[);/ ]|$)
    let regexPatternCheck2 = /(?:(?<=(?:\?:))(\[[);/ ]{3,4}\])(?=\|\$))/;
    let matchConditionFormat2 = new RegExp(regexPatternCheck2, 'm').exec(regex);
    if (matchConditionFormat2 === null) {
      return false;
    }
    return matchConditionFormat1[0].length === matchConditionFormat2[1].length;
  }
  return true;
}

function testsRegexStructureDevice(file, brand, regexData) {
  expect(regexData).to.property('regex');
  let regex = regexData['regex'];
  
  let prefixErrorFileBrand = `file ${file}, brand ${brand}, `;
  
  let errorMessageDoubleOr = `Detect \`||\` in regex ${prefixErrorFileBrand}`;
  expect(checkRegexRuleForDoubleOr(regex)).to.equal(
    true,
    errorMessageDoubleOr + `common regex ${regex}`
  );
  
  let errorMessageVerticalLineCloseGroup = `Detect \`|)\` in regex, ${prefixErrorFileBrand}`;
  expect(checkRegexVerticalLineClosingGroup(regex)).to.equal(
    true,
    errorMessageVerticalLineCloseGroup + `common regex ${regex}`
  );
  
  let errorMessageEndCondition = `Detect end of regular expression does not match the format \`(?:[);/ ]|$)\`, ${prefixErrorFileBrand}`;
  expect(checkRegexRestrictionEndCondition(regex)).to.equal(
    true,
    errorMessageEndCondition + `common regex ${regex}`
  );
  
  if (regexData.models !== undefined) {
    expect(Array.isArray(regexData.models)).to.equal(true);
    regexData.models.forEach((model, pos) => {
      expect(model).to.property('regex');
      expect(model).to.property('model');
      let regex = model.regex;
      expect(checkRegexRuleForDoubleOr(regex)).to.equal(
        true,
        errorMessageDoubleOr + `model regex ${regex}`
      );
      expect(checkRegexVerticalLineClosingGroup(regex)).to.equal(
        true,
        errorMessageVerticalLineCloseGroup + `model regex ${regex}`
      );
      expect(checkRegexRestrictionEndCondition(regex)).to.equal(
        true,
        errorMessageEndCondition + `model regex ${regex}`
      );
    });
  } else {
    expect(regexData).to.property('device');
    expect(regexData).to.property('model');
    expect(typeof regexData['model'] === 'string').to.equal(true);
  }
}

describe('tests device fixtures files', function () {
  this.timeout(TIMEOUT);
  let skipFiles = [
    'alias-device.yml',
  ];
  let pathRegexData = getFixtureFolder() + '../../regexes/device/';
  let deviceRegexFiles = fs.readdirSync(pathRegexData);
  deviceRegexFiles.forEach(function (file) {
    if (skipFiles.indexOf(file) !== -1) {
      return;
    }
    describe('file fixture ' + file, function () {
      let fixtureData = YAMLLoad(pathRegexData + file);
      for (let brand in fixtureData) {
        it(brand, function () {
          testsRegexStructureDevice.call(
            this,
            pathRegexData + file,
            brand,
            fixtureData[brand]
          );
        });
      }
    });
  });
});
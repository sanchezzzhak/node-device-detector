const AbstractParser = require('../parser/abstract-parser')
const { should, assert, expect } = require('chai');

describe('tests AbstractParser', function () {
  let parser = new AbstractParser;
  it('AbstractParser::getBaseRegExp', () => {
    let regex = 'ASUS_Z012DE';
    expect(parser.getBaseRegExp(regex).test('ASUS_Z012DE')).to.equal(true);
    expect(parser.getBaseRegExp(regex).test('test ASUS_Z012DE')).to.equal(true);
    expect(parser.getBaseRegExp(regex).test('/ASUS_Z012DE')).to.equal(true);
    expect(parser.getBaseRegExp(regex).test('-ASUS_Z012DE')).to.equal(false);
    expect(parser.getBaseRegExp(regex).test('_ASUS_Z012DE')).to.equal(false);
    expect(parser.getBaseRegExp(regex).test('azASUS_Z012DE')).to.equal(false);
  })
});
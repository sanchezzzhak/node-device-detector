const DataPacker = require('./../lib/data-packer');
const { should, assert, expect } = require('chai');

describe('test class DataPacker', function () {
  let SOURCE_DATA = {
    prop1: 'value_prop1',
    prop2: 'value_prop2',
    prop3: {
      desc: 'test-desc',
      name: 'value-name',

    }
  };
  let SOURCE_MAP = {
    PP: 'prop1',
    PB: 'prop2',
    PM: 'prop3.desc',
    PN: 'prop3.name',

  };

  it('methods pack/unpack', function() {
    let result = DataPacker.pack(SOURCE_DATA, SOURCE_MAP);
    
    expect(result).to.equal(
      `PP=value_prop1;PB=value_prop2;PM=test-desc;PN=value-name;`
    );
    let data = DataPacker.unpack(result, SOURCE_MAP);
    expect(SOURCE_DATA).to.deep.equal(data);
    
  })
  
  


});
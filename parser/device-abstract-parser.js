const ParserAbstract = require('./abstract-parser');
const util = require('util');


function DeviceParserAbstract() {
  // overwrite property

  DeviceParserAbstract.super_.call(this);
}
util.inherits(DeviceParserAbstract, ParserAbstract);

module.exports = DeviceParserAbstract;
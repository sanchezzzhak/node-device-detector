const ParserAbstract = require('./abstract-parser');
const util = require('util');

function ClientParserAbstract() {
  // overwrite property

  ClientParserAbstract.super_.call(this);
}
util.inherits(ClientParserAbstract, ParserAbstract);

module.exports = ClientParserAbstract;
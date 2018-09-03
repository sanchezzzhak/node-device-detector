const ParserAbstract = require('./abstract-parser');
const util = require('util');

function DeviceParserAbstract() {
  this.model = '';
  this.brand = '';
  this.type = '';
  this.id = '';
}

util.inherits(DeviceParserAbstract, ParserAbstract);


DeviceParserAbstract.prototype.reset = function(){
  this.model = '';
  this.brand = '';
  this.type = '';
  this.id = '';
};

DeviceParserAbstract.prototype.getParseData = function(){
  return {
    id : this.id,
    type: this.type,
    brand: this.brand,
    model: this.model
  };
};

/**
 *
 * @param {string} userAgent
 * @return {boolean}
 */
DeviceParserAbstract.prototype.parse = function(userAgent) {
  this.reset();

  let model = '';
  let deviceType = '';
  let brandId = '';
  
  for (let cursor in this.collection) {
    let item = this.collection[cursor];
    let match = this.getBaseRegExp(item['regex']).exec(userAgent);

    if (match) {
      if(item['device']!== undefined){
        deviceType = item['device'];
      }

      if (item['models'] !== undefined) {
        let models = item['models'];
        for (let i = 0, l = models.length; i < l; i++) {
          let data = models[i];
          let modelMatch = this.getBaseRegExp(data.regex).exec(userAgent);
          if (modelMatch) {
            model = this.buildModel(data.model, modelMatch);
            if (data.device !== undefined) {
              deviceType = data.device;
            }
            break;
          }
        }
      } else if (item['model'] !== undefined) {
        model = this.buildModel(item['model'], match);
      }

      this.brand = String(cursor).trim();
      this.model = String(model).trim();
      this.type = deviceType;
      this.id = brandId;

      return true;
    }
  }
  return false;
};



module.exports = DeviceParserAbstract;
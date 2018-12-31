const ParserAbstract = require('./abstract-parser');
const util = require('util');

const collectionBrand = Object.assign({},
    ...Object.entries(require('./device/brand-short')).map(([a, b]) => ({[b]: a})), {});

function VendorFragmentAbstractParser() {
    this.fixtureFile = 'vendorfragments.yml';
    this.loadCollection();
    this.reset();

}
util.inherits(VendorFragmentAbstractParser, ParserAbstract);

VendorFragmentAbstractParser.prototype.reset = function () {
    this.name = '';
    this.id = '';
};

VendorFragmentAbstractParser.prototype.getParseData = function(){
    return {
        id: this.id,
        name: this.name
    };
};

VendorFragmentAbstractParser.prototype.parse = function (userAgent) {
    this.reset();
    for (let key in this.collection) {
        let collection =  this.collection[key];
        for (let i = 0, l = collection.length; i < l; i++) {
            let item = collection[i];
            let regex = this.getBaseRegExp(item);
            let match = regex.exec(userAgent);
            if (match !== null) {

                let brandId = collectionBrand[key];

                this.name = key;
                this.id = brandId !== undefined ? brandId : '';

                return true;
            }
        }
    }

    return false;
};

module.exports = VendorFragmentAbstractParser;
module.exports.OsAbstractParser = VendorFragmentAbstractParser;
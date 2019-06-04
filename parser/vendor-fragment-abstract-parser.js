const ParserAbstract = require('./abstract-parser');
const util = require('util');

const collectionBrand = Object.assign({},
    ...Object.entries(require('./device/brand-short')).map(([a, b]) => ({[b]: a})), {});

function VendorFragmentAbstractParser() {
    this.fixtureFile = 'vendorfragments.yml';
    this.loadCollection();

}
util.inherits(VendorFragmentAbstractParser, ParserAbstract);




VendorFragmentAbstractParser.prototype.parse = function (userAgent) {

    for (let key in this.collection) {
        let collection =  this.collection[key];
        for (let i = 0, l = collection.length; i < l; i++) {
            let item = collection[i];
            let regex = this.getBaseRegExp(item);
            let match = regex.exec(userAgent);
            if (match !== null) {
                let brandId = collectionBrand[key];
                return {
                  name: key,
				  id: brandId !== undefined ? brandId : ''
				};
            }
        }
    }

    return null;
};

module.exports = VendorFragmentAbstractParser;
module.exports.OsAbstractParser = VendorFragmentAbstractParser;
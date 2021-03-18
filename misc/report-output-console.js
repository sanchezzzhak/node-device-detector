const Brands = Object.values(require('./../parser/device/brand-short'));
const Browsers = Object.values(require('./../parser/client/browser-short'));
const fs = require('fs');
const YAML = require('js-yaml');
const sortABC = (a, b) => {
	return String(a).localeCompare(String(b), 'en', {sensitivity: 'base'});
};

Brands.sort(sortABC);
Browsers.sort(sortABC);

console.log('Support detect brands list (%s): ', Brands.length);
console.log(
	'* ' + Brands.join(', ')
);
console.log('\n');

console.log('Support detect browsers list (%s): ', Browsers.length);
console.log(
	'* ' + Browsers.join(', ')
);

let brandInfos = YAML.safeLoad(fs.readFileSync(__dirname + '/../regexes/device/info-device.yml', 'utf8'));
let deviceInfo = 0;
for (let brand in brandInfos) {
	deviceInfo += Object.keys(brandInfos[brand]).length;
}
console.log('Device info count %s', deviceInfo);


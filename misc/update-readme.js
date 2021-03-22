const Brands = Object.values(require('./../parser/device/brand-short'));
const Browsers = Object.values(require('./../parser/client/browser-short'));
const fs = require('fs');
const YAML = require('js-yaml');
const sortABC = (a, b) => {
	return String(a).localeCompare(String(b), 'en', {sensitivity: 'base'});
};

Brands.sort(sortABC);
Browsers.sort(sortABC);

let brandInfos = YAML.safeLoad(fs.readFileSync(__dirname + '/../regexes/device/info-device.yml', 'utf8'));
let deviceInfoCount = 0;
for (let brand in brandInfos) {
	deviceInfoCount += Object.keys(brandInfos[brand]).length;
}

console.log('Update README.md');

let someFile = __dirname + '/../README.md';
fs.readFile(someFile, 'utf8', function (err,data) {
  if (err) {
	return console.log(err);
  }
  let brandLists = Brands.join(', ');
  data = data.replace(
    /(^#{5} Support detect brands list(?:.*?)<\/details>)/igms,
	`##### Support detect brands list (${Brands.length}):\n\n<details>\n<summary>Show details</summary>\n\n* ${brandLists}\n\n</details>`);

  let browserLists = Browsers.join(', ');
  data = data.replace(
	/(^#{5} Support detect browsers list(?:.*?)<\/details>)/igms,
	`##### Support detect brands list (${Browsers.length}):\n\n<details>\n<summary>Show details</summary>\n\n* ${browserLists}\n</details>`);

  data = data.replace(/few devices\. \([^)]+\)$/igms, `few devices. (${deviceInfoCount} devices)`);


  fs.writeFile(someFile, data, 'utf8', function (err) {
	if (err) return console.log(err);
  });
});
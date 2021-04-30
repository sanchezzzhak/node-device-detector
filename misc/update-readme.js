const Brands = Object.values(require('./../parser/device/brand-short'));
const Browsers = Object.values(require('./../parser/client/browser-short'));
const fs = require('fs');

const YAML = require('js-yaml');
const sortABC = (a, b) => {
  return String(a).localeCompare(String(b), 'en', { sensitivity: 'base' });
};

Brands.sort(sortABC);
Browsers.sort(sortABC);

let brandInfos = YAML.safeLoad(
  fs.readFileSync(__dirname + '/../regexes/device/info-device.yml', 'utf8')
);

// console.log({brandInfos});

let deviceInfoData = {};
let deviceAliasCount = 0;
let deviceInfoCount = 0;
for (let brand in brandInfos) {
  if (brandInfos[brand] !== null) {
    if (deviceInfoData[brand] === undefined) {
      deviceInfoData[brand] = {
        device: 0,
        alias: 0,
      };
    }

    if (!brandInfos[brand]) {
      continue;
    }
    for (let model in brandInfos[brand]) {
      if (brandInfos[brand][model] && brandInfos[brand][model]) {
        let row = brandInfos[brand][model];
        if (row.indexOf('->') !== -1) {
          deviceInfoData[brand].alias++;
          deviceAliasCount++;
        }
        if (row.indexOf(';') !== -1 && row.indexOf('=') !== -1) {
          deviceInfoData[brand].device++;
          deviceInfoCount++;
        }
      }
    }
  }
}

let deviceInfoTable =
  '| Brand | Device count | Alias count |\n |----|-------------|-------------|\n';
for (let brand in deviceInfoData) {
  deviceInfoTable += `| ${brand} | ${deviceInfoData[brand].device} | ${deviceInfoData[brand].alias} | \n`;
}

console.log('Update README.md');

let someFile = __dirname + '/../README.md';
fs.readFile(someFile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  let brandLists = Brands.join(', ');

  data = data.replace(
    /(^#{5} Support detail brands\/models list(?:.*?)<\/details>)/gims,
    `##### Support detail brands/models list:\n\n<details>\n<summary>Show details</summary>\n\n${deviceInfoTable}\n\n</details>`
  );

  data = data.replace(
    /(^#{5} Support detect brands list(?:.*?)<\/details>)/gims,
    `##### Support detect brands list (${Brands.length}):\n\n<details>\n<summary>Show details</summary>\n\n* ${brandLists}\n\n</details>`
  );

  let browserLists = Browsers.join(', ');
  data = data.replace(
    /(^#{5} Support detect browsers list(?:.*?)<\/details>)/gims,
    `##### Support detect browsers list (${Browsers.length}):\n\n<details>\n<summary>Show details</summary>\n\n* ${browserLists}\n</details>`
  );

  data = data.replace(
    /few devices\. \([^)]+\)$/gims,
    `few devices. (${deviceInfoCount} devices, alias devices ${deviceAliasCount})`
  );

  let dateObj = new Date();
  let month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  let day = ('0' + dateObj.getDate()).slice(-2);
  let year = dateObj.getFullYear();
  let shortDate = day + '/' + month + '/' + year;
  data = data.replace(
    /_Last update: ([^_]+)_/gims,
    `_Last update: ${shortDate}_`
  );

  fs.writeFile(someFile, data, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

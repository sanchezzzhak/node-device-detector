const Brands = Object.values(require('./../parser/device/brand-short'));
const Browsers = Object.values(require('./../parser/client/browser-short'));

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

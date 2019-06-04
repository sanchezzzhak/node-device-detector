// User-Agent: Mozilla/<version> (<system-information>) <platform> (<platform-details>) <extensions>
 let regular = '/' + [
    '(.*)?\s',  // version
    '\((.*)\)', // system-information
    '(.*)',     // platform
    '\((.*)\)', // platform-details
    '(.*)'      // extensions
 ].join('') + '/i';


// схема оптимизации

// 0 загружаем pull_array из файла.
// 1 парсим user-agent на состовляющие
// 2 проверяем pull_array есть информация, если нету информации парсим через все регулярки и создаем хеш.
// 4 выгрузить из статистики user-agents с 2015-2018 годы для фикстур

const DeviceDetector = require('./../index');

let userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
// let userAgent = 'Mozilla/5.0 (Linux; Android 7.0; Moto C Plus Build/NRD90M.01.033) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36';

let regex = new RegExp(regular);

let result = regex.exec(userAgent);
console.log(result);
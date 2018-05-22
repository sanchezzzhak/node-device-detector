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
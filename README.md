# [node-device-detector](https://www.npmjs.com/package/node-device-detector)

Port php lib [matomo-org/device-detector](https://github.com/matomo-org/device-detector) to NodeJs

### !!! library works only under nodejs v10+


Install
-

local install production

```
npm install node-device-detector --save
```
local machine install is developer
```
npm install node-device-detector --only=dev
```

# Before upgrading to up version, pls read;
### (ChangeLog)
* v1.3.4
    * Update fixtures from the motamo-org/device-detect `version#4.2.2` (update to 2021/03/17)
    * Added detect devices 532~ 
    * Added tests runs nodes [10.x, 15.x] for github actions
    * Added new experimental parser `InfoDevice`

* v1.3.3
    * Update fixtures from the motamo-org/device-detect `version#4.1.0` (update to 2021/02/22)
    
* v1.3.2
    * Update fixtures from the motamo-org/device-detect `version#4.1.0` (update to 2021/01/08)
    
* v1.3.1
    * Update fixtures from the motamo-org/device-detect `version#4.0.2` (update to 2020/12/07)
    
    
* OLD VERSIONS [CHANGELOG.MD](CHANGELOG.MD)
* [Online demo](https://iehol.sse.codesandbox.io/)


Usage
-
```js
const DeviceDetector = require('node-device-detector');
const detector = new DeviceDetector;

const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const result = detector.detect(userAgent);

/*
const DEVICE_TYPE = require('node-device-detector/parser/const/device-type');
const isTabled  = result.device && [DEVICE_TYPE.TABLET].indexOf(result.device.type) !== -1;
const isMobile = result.device && [DEVICE_TYPE.SMARTPHONE, DEVICE_TYPE.FEATURE_PHONE].indexOf(result.device.type) !== -1;
const isPhablet = result.device && [DEVICE_TYPE.PHABLET].indexOf(result.device.type) !== -1;
const isIOS = result.os && result.os.family === 'iOS';
const isWearable = result.device.type === DEVICE_TYPE.WEARABLE;
const isAndroid = result.os && result.os.family === 'Android';
const isDesktop = !isTabled && !isMobile && !isPhablet && !isWearable;
*/

console.log('result parse', result);
```
> PS: When creating an object`detector = new DeviceDetector;` data for parsing is reloaded from files, consider this, the best option is initialization at application start
> I recommend seeing [examples](#-others)

### Result parse

```text
{ 
    os: { 
        name: 'Android',
        short_name: 'AND',
        version: '5.0',
        platform: '',
        family: 'Android'
    },
    client:  { 
        type: 'browser',
        name: 'Chrome Mobile',
        short_name: 'CM',
        version: '43.0.2357.78',
        engine: 'Blink',
        engine_version: '' 
    },
    device: { 
        id: 'ZT',
        type: 'smartphone',
        brand: 'ZTE',
        model: 'Nubia Z7 max'
    }
}
```
Result is not detect
```text
{ 
  os: {},
  client: {},
  device: {
    id: '',
    type : 'device type',
    brand: '',
    model: ''
  }
}
```

Using parsers singly
-

#### Detect Bot
```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)';
const detector = new DeviceDetector();
const result = detector.parseBot(userAgent);
```

#### Detect Os
```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector;
const result = detector.parseOs(userAgent);
console.log('Result parse os', result);  
```

#### Detect Client 
```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector;
const result = detector.parseClient(userAgent);
console.log('Result parse client', result);
```

#### Lite parse not detect brand
```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector;
const resultOs = detector.parseOs(userAgent);
const resultClient = detector.parseClient(userAgent);
const resultDeviceType = detector.parseDeviceType(userAgent, resultOs, resultClient, {});
const result = Object.assign({os:resultOs}, {client:resultClient}, {device: resultDeviceType});
console.log('Result parse lite', result);
```

### Getter/Setter/Options
```js
const detector = new DeviceDetector({
  osVersionTruncate: 0, // Truncate Os version from 5.0 to 5 (default '' or null)
  clientVersionTruncate: 2  // Truncate Client version Chrome from 43.0.2357 .78 to 43.0.2357 (default '' or null)
});
// You can override these settings at any time using special methods, example
detector.setOsVersionTruncate(0);
detector.setClientVersionTruncate(2);
```

### Getting device code as it is from the useragent (experimental)
> Get device code as is

```js
const AliasDevice = require('node-device-detector/parser/device/alias-device');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const aliasDevice = new AliasDevice;
const result = aliasDevice.parse(userAgent);
console.log('Result parse code model', result);
/*
result 
{
  name: "NX505J"
}
is not parse result  {name: ""}
*/
``` 

### Get more information about a device (experimental)
> This parser is experimental and contains few devices. (133 devices)

```js
const InfoDevice = require('node-device-detector/parser/device/info-device');
const infoDevice = new InfoDevice;
const result = infoDevice.info('Asus', 'Zenfone 4');
console.log('Result information', result);
/*
result
{
  display: { size: '5.5', resolution: '1080x1920', ratio: '16:9' },
  size: '155.4x75.2x7.7',
  weight: '165',
  release: '2017'
  hardware: {
    // ...
  }
}
is not found result null
*/
```
Cast methods
```js
const InfoDevice = require('node-device-detector/parser/device/info-device');
const infoDevice = new InfoDevice;
infoDevice.setSizeConvertObject(true);
infoDevice.setResolutionConvertObject(true);
const result = infoDevice.info('Asus', 'Zenfone 4');
console.log('Result information', result);
/*
result
{  
  display: {
    size: "5.5",  // value in inchs
    resolution: {
      width: "1080", // value in px
      height: "1920" // value in px
    },
    ratio: "16:9",   // calculated field
    ppi: "401"       // calculated field
  },
  hardware: {
    ram: "4096",   // RAM value in megabytes
    cpu_id: 19,  // id cpu model in collection
    cpu: {
      name: "Qualcomm Snapdragon 630",  // brand + name
      type: "ARM",                      // architecture type 
      cores: "8",                       // number of cores / threads 
      clock_rate: 2200,                 // value in MHz
      gpu_id: 16                        // id gpu model in collection
	},
    gpu: {
      name: "Qualcomm Adreno 508",
      clock_rate: 650
    }
  },
  os: "Android 7.1",   // initial OS version
  release: "2017.08",  // date release or anonce
  sim": "2",           // count SIM 
  size: {           
    width: "75.2",     // physical width in millimeters
    height: "155.4",   // physical height in millimeters
    thickness: "7.7"   // physical thickness in millimeters
  },
  weight: "165"        // in grams
};
*/
```

Others
-
* [Micro service detect device](docs/MICROSERVICE.MD) from framework [moleculer js](http://moleculer.services)
* [Example1 detect device in native server](docs/NATIVE_SERVER.MD)
* [Example2 detect device in express.js](docs/EXPRESS_SERVER.MD)

##### Support detect brands list (964):

<details>
<summary>Show details</summary>

* 2E, 360, 3GNET, 3Q, 4Good, 4ife, 8848, A1, Accent, Ace, Acer, Acteck, Advan, Advance, AfriOne, AGM, Ainol, Airness, Airties, AIS, Aiuto, Aiwa, Akai, Alba, Alcatel, Alcor, ALDI NORD, ALDI SÜD, Alfawise, Aligator, AllCall, AllDocube, Allview, Allwinner, Altech UEC, Altice, altron, Amazon, AMGOO, Amigoo, Amoi, Andowl, Anry, ANS, AOC, Aoson, Apple, Archos, Arian Space, Ark, ArmPhone, Arnova, ARRIS, Artel, Artizlee, Asano, Asanzo, Ask, Assistant, Asus, AT&T, Atom, Atvio, Audiovox, Avenzo, AVH, Avvio, Axxion, Azumi Mobile, BangOlufsen, Barnes & Noble, BB Mobile, BBK, BDF, Becker, Beeline, Beelink, Beetel, Bellphone, BenQ, BenQ-Siemens, Beyond, Bezkam, BGH, Bigben, BIHEE, Billion, BioRugged, Bird, Bitel, Bitmore, Bkav, Black Bear, Black Fox, Blackview, Blaupunkt, Blu, Bluboo, Bluedot, Bluegood, Bluewave, Bmobile, Bobarry, bogo, Boway, bq, Brandt, Bravis, Brondi, Bush, CAGI, Camfone, Capitel, Captiva, Carrefour, Casio, Casper, Cat, Cavion, Celcus, Celkon, Cell-C, CellAllure, Centric, CG Mobile, Changhong, Cherry Mobile, CHIA, Chico Mobile, China Mobile, Chuwi, Claresta, Clarmin, Clementoni, Cloudfone, Cloudpad, Clout, CnM, Coby Kyros, Colors, Comio, Compal, Compaq, ComTrade Tesla, Concord, ConCorde, Condor, Connectce, Connex, Conquest, Contixo, Coolpad, CORN, Cosmote, Cowon, CreNova, Crescent, Cricket, Crius Mea, Crony, Crosscall, Cube, CUBOT, CVTE, Cyrus, Daewoo, Danew, Datalogic, Datamini, Datang, Datawind, Datsun, Dbtel, Dell, Denver, Desay, DeWalt, DEXP, Dialog, Dicam, Digi, Digicel, Digihome, Digiland, Digma, Ditecma, Diva, Divisat, DMM, DNS, DoCoMo, Doffler, Dolamee, Doogee, Doopro, Doov, Dopod, Doro, Droxio, Dune HD, E-Boda, E-Ceros, E-tel, Eagle, Easypix, EBEST, Echo Mobiles, ECS, EE, Einstein, EKO, Eks Mobility, EKT, ELARI, Electroneum, ELECTRONIA, Element, Elenberg, Elephone, Eltex, Energizer, Energy Sistem, Engel, Enot, Epik One, Ergo, Ericsson, Ericy, Essential, Essentielb, eSTAR, Eton, eTouch, Etuline, Eurostar, Evercoss, Evertek, Evolio, Evolveo, EvroMedia, EWIS, EXCEED, ExMobile, EXO, Explay, Extrem, Ezio, Ezze, F&U, Facebook, Fairphone, Famoco, FaRao Pro, FarEasTone, Fengxiang, Fero, FiGO, FinePower, Finlux, FireFly Mobile, Fly, FNB, Fondi, Fonos, FORME, Formuler, Forstar, Fortis, Foxconn, Freetel, Fuego, Fujitsu, G-TiDE, G-Touch, Garmin-Asus, Gateway, Gemini, General Mobile, GEOFOX, Geotel, Ghia, Ghong, Gigabyte, Gigaset, Gini, Ginzzu, Gionee, Globex, GLX, GOCLEVER, GoGEN, Gol Mobile, Goly, Gome, GoMobile, Google, Goophone, Gradiente, Grape, Gree, Gresso, Grundig, Hafury, Haier, HannSpree, Hardkernel, Hasee, Helio, Hezire, Hi-Level, High Q, Highscreen, Hipstreet, Hisense, Hitachi, Hoffmann, Hometech, Homtom, Honeywell, Hoozo, Horizon, Hosin, Hotel, Hotwav, How, HP, HTC, Huadoo, Huawei, Humax, Hurricane, Hyrican, Hyundai, Hyve, i-Cherry, i-Joy, i-mate, i-mobile, iBall, iBerry, iBrit, IconBIT, iDroid, iGet, iHunt, Ikea, IKI Mobile, iKoMo, IKU Mobile, iLA, iLife, iMars, IMO Mobile, Impression, INCAR, Inco, iNew, Infinix, InFocus, Inkti, InnJoo, Innos, Innostream, Inoi, INQ, Insignia, Intek, Intex, Invens, Inverto, Invin, iOcean, iPro, iQ&T, IQM, Irbis, Iris, iRola, iRulu, iSWAG, IT, iTel, iTruck, IUNI, iVA, iView, iVooMi, iZotron, JAY-Tech, Jesy, JFone, Jiake, Jiayu, Jinga, Jivi, JKL, Jolla, Just5, JVC, K-Touch, Kaan, Kaiomy, Kalley, Kanji, Karbonn, Kata, KATV1, Kazam, KDDI, Kempler & Strauss, Keneksi, Kenxinda, Kiano, Kingsun, Kivi, Klipad, Kocaso, Kodak, Kogan, Komu, Konka, Konrow, Koobee, Koolnee, Kooper, KOPO, Koridy, KRONO, Krüger&Matz, KT-Tech, KUBO, Kuliao, Kult, Kumai, Kyocera, Kzen, LAIQ, Land Rover, Landvo, Lanix, Lark, Laurus, Lava, LCT, Le Pan, Leader Phone, Leagoo, Ledstar, LeEco, Leff, Lemhoov, Lenco, Lenovo, Leotec, Lephone, Lesia, Lexand, Lexibook, LG, Lifemaxx, Lingwin, Linnex, Linsar, Loewe, Logic, Logicom, Lumigon, Lumus, Luna, Luxor, LYF, M.T.T., M4tel, Macoox, Magnus, Majestic, Malata, Manhattan, Mann, Manta Multimedia, Mantra, Masstel, Matrix, Maxcom, Maximus, Maxtron, MAXVI, Maxwest, Maze, MDC Store, meanIT, Mecer, Mecool, Mediacom, MediaTek, Medion, MEEG, MegaFon, Meitu, Meizu, Melrose, Memup, Metz, MEU, MicroMax, Microsoft, Minix, Mintt, Mio, Miray, Mito, Mitsubishi, MIVO, MIXC, MiXzo, MLLED, MLS, Mobicel, Mobiistar, Mobiola, Mobistel, MobiWire, Mobo, Modecom, Mofut, Motorola, Movic, Mpman, MSI, MStar, MTC, MTN, Multilaser, MYFON, MyPhone, Myria, Myros, Mystery, MyTab, MyWigo, Nabi, Naomi Phone, National, Navcity, Navitech, Navitel, Navon, NEC, Necnot, Neffos, Neomi, Netgear, NeuImage, Newgen, Newland, Newman, Newsday, NewsMy, NEXBOX, Nexian, NEXON, Nextbit, NextBook, NextTab, NG Optics, NGM, Nikon, Nintendo, NOA, Noain, Nobby, Noblex, Nokia, Nomi, Nomu, Nordmende, NorthTech, Nos, Nous, NuAns, NUU Mobile, Nuvo, Nvidia, NYX Mobile, O+, O2, Oale, Obi, Odys, Ok, Okapia, OKWU, Onda, OnePlus, Onix, ONN, OpelMobile, Openbox, OPPO, Opsson, Orange, Orbic, Ordissimo, Ouki, Oukitel, OUYA, Overmax, Ovvi, öwn, Owwo, Oysters, Oyyu, OzoneHD, P-UP, Palm, Panacom, Panasonic, Pantech, PCBOX, PCD, PCD Argentina, PEAQ, Pendoo, Pentagram, Phicomm, Philco, Philips, Phonemax, phoneOne, Pioneer, PiPO, Pixela, Pixelphone, Pixus, Planet Computers, Ployer, Plum, Pluzz, PocketBook, POCO, Point of View, Polaroid, PolyPad, Polytron, Pomp, Poppox, Positivo, Positivo BGH, PPTV, Premio, Prestigio, Primepad, Primux, Prixton, PROFiLO, Proline, ProScan, Protruly, PULID, Q-Touch, Q.Bell, Qilive, QMobile, Qtek, Quantum, Quechua, Qumo, R-TV, Ramos, Ravoz, Razer, RCA Tablets, Reach, Readboy, Realme, RED, Reeder, REGAL, Rikomagic, RIM, Rinno, Ritmix, Ritzviva, Riviera, Roadrover, Rokit, Roku, Rombica, Ross&Moor, Rover, RoverPad, RT Project, RugGear, Ruio, Runbo, Ryte, S-TELL, Saba, Safaricom, Sagem, Salora, Samsung, Sanei, Sansui, Santin, Sanyo, Savio, SCBC, Schneider, Seatel, Seeken, SEG, Sega, Selenga, Selevision, Selfix, SEMP TCL, Sencor, Sendo, Senkatel, Senseit, Senwa, Seuic, SFR, Sharp, Shift Phones, Shtrikh-M, Shuttle, Sico, Siemens, Sigma, Silelis, Silent Circle, Simbans, Simply, Siragon, Sky, Skyworth, Smadl, Smailo, Smart, Smartab, SMARTEC, Smartfren, Smartisan, Softbank, Solone, Sonim, SONOS, Sony, Sony Ericsson, Soundmax, Soyes, Spark, SPC, Spectrum, Spice, SQOOL, Star, Starlight, Starmobile, Starway, STF Mobile, STK, Stonex, Storex, StrawBerry, Subor, Sugar, Sumvision, Sunstech, SunVan, Sunvell, SuperSonic, SuperTab, Supra, Suzuki, Swipe, SWISSMOBILITY, Swisstone, SWTV, Symphony, Syrox, T-Mobile, Takara, Tanix, TB Touch, TCL, TD Systems, Technicolor, Technika, TechniSat, TechnoTrend, TechPad, Techwood, Teclast, Tecno Mobile, Teknosa, Tele2, Telefunken, Telego, Telenor, Telit, Tesco, Tesla, Tetratab, teXet, ThL, Thomson, Thuraya, TIANYU, Time2, Timovi, Tinai, Tinmo, TiPhone, TOKYO, Tolino, Tone, Tooky, Top House, Toplux, Torex, Toshiba, Touchmate, Transpeed, TrekStor, Trevi, Trifone, Trio, Tronsmart, True, TTEC, Tunisie Telecom, Turbo, Turbo-X, TurboKids, TVC, TWM, Twoe, TWZ, Tymes, U.S. Cellular, Ugoos, Uhans, Uhappy, Ulefone, Umax, UMIDIGI, Unihertz, Unimax, Uniscope, UNIWA, Unknown, Unnecto, Unonu, Unowhy, UTOK, UTStarcom, VAIO, Vastking, VC, Venso, Verico, Verizon, Vernee, Vertex, Vertu, Verykool, Vesta, Vestel, VGO TEL, Videocon, Videoweb, ViewSonic, Vinga, Vinsoc, Vipro, Vitelcom, Viumee, Vivax, Vivo, Vizio, VK Mobile, VKworld, Vodacom, Vodafone, Vonino, Vontar, Vorago, Vorke, Voto, VOX, Voxtel, Voyo, Vsmart, Vsun, Vulcan, VVETIME, Walton, WE, Web TV, Weimei, WellcoM, WELLINGTON, Western Digital, Westpoint, Wexler, Wieppo, Wigor, Wiko, Wileyfox, Winds, Wink, Winmax, Winnovo, Wintouch, Wiseasy, Wizz, Wolder, Wolfgang, Wonu, Woo, Wortmann, Woxter, X-BO, X-TIGI, X-View, X.Vision, Xgody, Xiaolajiao, Xiaomi, Xion, Xolo, Xoro, Xshitou, Xtouch, Yandex, Yarvik, Yes, Yezz, Yoka TV, Yota, Ytone, Yu, Yuandao, Yusun, Yxtel, Zatec, Zebra, Zeemi, Zen, Zenek, Zentality, Zfiner, ZH&K, Zidoo, Ziox, Zonda, Zopo, ZTE, Zuum, Zync, ZYQ

</details>

##### Support detect brands list (964):

<details>
<summary>Show details</summary>

* 2E, 360, 3GNET, 3Q, 4Good, 4ife, 8848, A1, Accent, Ace, Acer, Acteck, Advan, Advance, AfriOne, AGM, Ainol, Airness, Airties, AIS, Aiuto, Aiwa, Akai, Alba, Alcatel, Alcor, ALDI NORD, ALDI SÜD, Alfawise, Aligator, AllCall, AllDocube, Allview, Allwinner, Altech UEC, Altice, altron, Amazon, AMGOO, Amigoo, Amoi, Andowl, Anry, ANS, AOC, Aoson, Apple, Archos, Arian Space, Ark, ArmPhone, Arnova, ARRIS, Artel, Artizlee, Asano, Asanzo, Ask, Assistant, Asus, AT&T, Atom, Atvio, Audiovox, Avenzo, AVH, Avvio, Axxion, Azumi Mobile, BangOlufsen, Barnes & Noble, BB Mobile, BBK, BDF, Becker, Beeline, Beelink, Beetel, Bellphone, BenQ, BenQ-Siemens, Beyond, Bezkam, BGH, Bigben, BIHEE, Billion, BioRugged, Bird, Bitel, Bitmore, Bkav, Black Bear, Black Fox, Blackview, Blaupunkt, Blu, Bluboo, Bluedot, Bluegood, Bluewave, Bmobile, Bobarry, bogo, Boway, bq, Brandt, Bravis, Brondi, Bush, CAGI, Camfone, Capitel, Captiva, Carrefour, Casio, Casper, Cat, Cavion, Celcus, Celkon, Cell-C, CellAllure, Centric, CG Mobile, Changhong, Cherry Mobile, CHIA, Chico Mobile, China Mobile, Chuwi, Claresta, Clarmin, Clementoni, Cloudfone, Cloudpad, Clout, CnM, Coby Kyros, Colors, Comio, Compal, Compaq, ComTrade Tesla, Concord, ConCorde, Condor, Connectce, Connex, Conquest, Contixo, Coolpad, CORN, Cosmote, Cowon, CreNova, Crescent, Cricket, Crius Mea, Crony, Crosscall, Cube, CUBOT, CVTE, Cyrus, Daewoo, Danew, Datalogic, Datamini, Datang, Datawind, Datsun, Dbtel, Dell, Denver, Desay, DeWalt, DEXP, Dialog, Dicam, Digi, Digicel, Digihome, Digiland, Digma, Ditecma, Diva, Divisat, DMM, DNS, DoCoMo, Doffler, Dolamee, Doogee, Doopro, Doov, Dopod, Doro, Droxio, Dune HD, E-Boda, E-Ceros, E-tel, Eagle, Easypix, EBEST, Echo Mobiles, ECS, EE, Einstein, EKO, Eks Mobility, EKT, ELARI, Electroneum, ELECTRONIA, Element, Elenberg, Elephone, Eltex, Energizer, Energy Sistem, Engel, Enot, Epik One, Ergo, Ericsson, Ericy, Essential, Essentielb, eSTAR, Eton, eTouch, Etuline, Eurostar, Evercoss, Evertek, Evolio, Evolveo, EvroMedia, EWIS, EXCEED, ExMobile, EXO, Explay, Extrem, Ezio, Ezze, F&U, Facebook, Fairphone, Famoco, FaRao Pro, FarEasTone, Fengxiang, Fero, FiGO, FinePower, Finlux, FireFly Mobile, Fly, FNB, Fondi, Fonos, FORME, Formuler, Forstar, Fortis, Foxconn, Freetel, Fuego, Fujitsu, G-TiDE, G-Touch, Garmin-Asus, Gateway, Gemini, General Mobile, GEOFOX, Geotel, Ghia, Ghong, Gigabyte, Gigaset, Gini, Ginzzu, Gionee, Globex, GLX, GOCLEVER, GoGEN, Gol Mobile, Goly, Gome, GoMobile, Google, Goophone, Gradiente, Grape, Gree, Gresso, Grundig, Hafury, Haier, HannSpree, Hardkernel, Hasee, Helio, Hezire, Hi-Level, High Q, Highscreen, Hipstreet, Hisense, Hitachi, Hoffmann, Hometech, Homtom, Honeywell, Hoozo, Horizon, Hosin, Hotel, Hotwav, How, HP, HTC, Huadoo, Huawei, Humax, Hurricane, Hyrican, Hyundai, Hyve, i-Cherry, i-Joy, i-mate, i-mobile, iBall, iBerry, iBrit, IconBIT, iDroid, iGet, iHunt, Ikea, IKI Mobile, iKoMo, IKU Mobile, iLA, iLife, iMars, IMO Mobile, Impression, INCAR, Inco, iNew, Infinix, InFocus, Inkti, InnJoo, Innos, Innostream, Inoi, INQ, Insignia, Intek, Intex, Invens, Inverto, Invin, iOcean, iPro, iQ&T, IQM, Irbis, Iris, iRola, iRulu, iSWAG, IT, iTel, iTruck, IUNI, iVA, iView, iVooMi, iZotron, JAY-Tech, Jesy, JFone, Jiake, Jiayu, Jinga, Jivi, JKL, Jolla, Just5, JVC, K-Touch, Kaan, Kaiomy, Kalley, Kanji, Karbonn, Kata, KATV1, Kazam, KDDI, Kempler & Strauss, Keneksi, Kenxinda, Kiano, Kingsun, Kivi, Klipad, Kocaso, Kodak, Kogan, Komu, Konka, Konrow, Koobee, Koolnee, Kooper, KOPO, Koridy, KRONO, Krüger&Matz, KT-Tech, KUBO, Kuliao, Kult, Kumai, Kyocera, Kzen, LAIQ, Land Rover, Landvo, Lanix, Lark, Laurus, Lava, LCT, Le Pan, Leader Phone, Leagoo, Ledstar, LeEco, Leff, Lemhoov, Lenco, Lenovo, Leotec, Lephone, Lesia, Lexand, Lexibook, LG, Lifemaxx, Lingwin, Linnex, Linsar, Loewe, Logic, Logicom, Lumigon, Lumus, Luna, Luxor, LYF, M.T.T., M4tel, Macoox, Magnus, Majestic, Malata, Manhattan, Mann, Manta Multimedia, Mantra, Masstel, Matrix, Maxcom, Maximus, Maxtron, MAXVI, Maxwest, Maze, MDC Store, meanIT, Mecer, Mecool, Mediacom, MediaTek, Medion, MEEG, MegaFon, Meitu, Meizu, Melrose, Memup, Metz, MEU, MicroMax, Microsoft, Minix, Mintt, Mio, Miray, Mito, Mitsubishi, MIVO, MIXC, MiXzo, MLLED, MLS, Mobicel, Mobiistar, Mobiola, Mobistel, MobiWire, Mobo, Modecom, Mofut, Motorola, Movic, Mpman, MSI, MStar, MTC, MTN, Multilaser, MYFON, MyPhone, Myria, Myros, Mystery, MyTab, MyWigo, Nabi, Naomi Phone, National, Navcity, Navitech, Navitel, Navon, NEC, Necnot, Neffos, Neomi, Netgear, NeuImage, Newgen, Newland, Newman, Newsday, NewsMy, NEXBOX, Nexian, NEXON, Nextbit, NextBook, NextTab, NG Optics, NGM, Nikon, Nintendo, NOA, Noain, Nobby, Noblex, Nokia, Nomi, Nomu, Nordmende, NorthTech, Nos, Nous, NuAns, NUU Mobile, Nuvo, Nvidia, NYX Mobile, O+, O2, Oale, Obi, Odys, Ok, Okapia, OKWU, Onda, OnePlus, Onix, ONN, OpelMobile, Openbox, OPPO, Opsson, Orange, Orbic, Ordissimo, Ouki, Oukitel, OUYA, Overmax, Ovvi, öwn, Owwo, Oysters, Oyyu, OzoneHD, P-UP, Palm, Panacom, Panasonic, Pantech, PCBOX, PCD, PCD Argentina, PEAQ, Pendoo, Pentagram, Phicomm, Philco, Philips, Phonemax, phoneOne, Pioneer, PiPO, Pixela, Pixelphone, Pixus, Planet Computers, Ployer, Plum, Pluzz, PocketBook, POCO, Point of View, Polaroid, PolyPad, Polytron, Pomp, Poppox, Positivo, Positivo BGH, PPTV, Premio, Prestigio, Primepad, Primux, Prixton, PROFiLO, Proline, ProScan, Protruly, PULID, Q-Touch, Q.Bell, Qilive, QMobile, Qtek, Quantum, Quechua, Qumo, R-TV, Ramos, Ravoz, Razer, RCA Tablets, Reach, Readboy, Realme, RED, Reeder, REGAL, Rikomagic, RIM, Rinno, Ritmix, Ritzviva, Riviera, Roadrover, Rokit, Roku, Rombica, Ross&Moor, Rover, RoverPad, RT Project, RugGear, Ruio, Runbo, Ryte, S-TELL, Saba, Safaricom, Sagem, Salora, Samsung, Sanei, Sansui, Santin, Sanyo, Savio, SCBC, Schneider, Seatel, Seeken, SEG, Sega, Selenga, Selevision, Selfix, SEMP TCL, Sencor, Sendo, Senkatel, Senseit, Senwa, Seuic, SFR, Sharp, Shift Phones, Shtrikh-M, Shuttle, Sico, Siemens, Sigma, Silelis, Silent Circle, Simbans, Simply, Siragon, Sky, Skyworth, Smadl, Smailo, Smart, Smartab, SMARTEC, Smartfren, Smartisan, Softbank, Solone, Sonim, SONOS, Sony, Sony Ericsson, Soundmax, Soyes, Spark, SPC, Spectrum, Spice, SQOOL, Star, Starlight, Starmobile, Starway, STF Mobile, STK, Stonex, Storex, StrawBerry, Subor, Sugar, Sumvision, Sunstech, SunVan, Sunvell, SuperSonic, SuperTab, Supra, Suzuki, Swipe, SWISSMOBILITY, Swisstone, SWTV, Symphony, Syrox, T-Mobile, Takara, Tanix, TB Touch, TCL, TD Systems, Technicolor, Technika, TechniSat, TechnoTrend, TechPad, Techwood, Teclast, Tecno Mobile, Teknosa, Tele2, Telefunken, Telego, Telenor, Telit, Tesco, Tesla, Tetratab, teXet, ThL, Thomson, Thuraya, TIANYU, Time2, Timovi, Tinai, Tinmo, TiPhone, TOKYO, Tolino, Tone, Tooky, Top House, Toplux, Torex, Toshiba, Touchmate, Transpeed, TrekStor, Trevi, Trifone, Trio, Tronsmart, True, TTEC, Tunisie Telecom, Turbo, Turbo-X, TurboKids, TVC, TWM, Twoe, TWZ, Tymes, U.S. Cellular, Ugoos, Uhans, Uhappy, Ulefone, Umax, UMIDIGI, Unihertz, Unimax, Uniscope, UNIWA, Unknown, Unnecto, Unonu, Unowhy, UTOK, UTStarcom, VAIO, Vastking, VC, Venso, Verico, Verizon, Vernee, Vertex, Vertu, Verykool, Vesta, Vestel, VGO TEL, Videocon, Videoweb, ViewSonic, Vinga, Vinsoc, Vipro, Vitelcom, Viumee, Vivax, Vivo, Vizio, VK Mobile, VKworld, Vodacom, Vodafone, Vonino, Vontar, Vorago, Vorke, Voto, VOX, Voxtel, Voyo, Vsmart, Vsun, Vulcan, VVETIME, Walton, WE, Web TV, Weimei, WellcoM, WELLINGTON, Western Digital, Westpoint, Wexler, Wieppo, Wigor, Wiko, Wileyfox, Winds, Wink, Winmax, Winnovo, Wintouch, Wiseasy, Wizz, Wolder, Wolfgang, Wonu, Woo, Wortmann, Woxter, X-BO, X-TIGI, X-View, X.Vision, Xgody, Xiaolajiao, Xiaomi, Xion, Xolo, Xoro, Xshitou, Xtouch, Yandex, Yarvik, Yes, Yezz, Yoka TV, Yota, Ytone, Yu, Yuandao, Yusun, Yxtel, Zatec, Zebra, Zeemi, Zen, Zenek, Zentality, Zfiner, ZH&K, Zidoo, Ziox, Zonda, Zopo, ZTE, Zuum, Zync, ZYQ

</details>


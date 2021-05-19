
# [node-device-detector](https://www.npmjs.com/package/node-device-detector)

_Last update: 19/05/2021_

## Description

Port php lib [matomo-org/device-detector](https://github.com/matomo-org/device-detector) to NodeJs

* [Online demo](https://iehol.sse.codesandbox.io/)

## Code Status

![Chai](https://github.com/sanchezzzhak/node-device-detector/workflows/Tests/badge.svg?branch=master)
![YAML Lint](https://github.com/sanchezzzhak/node-device-detector/workflows/YAML%20Lint/badge.svg?branch=master)
![Prettier](https://github.com/sanchezzzhak/node-device-detector/workflows/Prettier/badge.svg?branch=master)

Install
-
```
npm install node-device-detector --save
```

Usage
-
```js
const DeviceDetector = require('node-device-detector');
const detector = new DeviceDetector;
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const result = detector.detect(userAgent);
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
Helper methods
```js
const DeviceDetector = require('node-device-detector');
const DeviceHelper = require('node-device-detector/helper');

const detector = new DeviceDetector;
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const result = detector.detect(userAgent);

/* check device type (feature phone, smartphone or phablet) */
DeviceHelper.isMobile(result);
/* check device type is desktop */
DeviceHelper.isDesktop(result);
/* check device type is tablet  */
DeviceHelper.isTablet(result);
/* check device type car (side panel in car)  */
DeviceHelper.isCar(result);
/* check device type feature phone (push-button telephones)  */
DeviceHelper.isFeaturePhone(result);
/* check device type smartphone  */
DeviceHelper.isSmartphone(result);
/* check device type phablet  */
DeviceHelper.isPhablet(result);
/* check device type game console (xBox, PlayStation, Nintendo etc)  */
DeviceHelper.isConsole(result);
/* check device type smart speaker (Alisa, Alexa, HomePod etc) */
DeviceHelper.isSmartSpeaker(result);
/* check device type SmartTV/TV box */
DeviceHelper.isTv(result);
/* check device type portable camera */
DeviceHelper.isCamera(result);
/* portable terminal, portable projector */
DeviceHelper.isPeripheral(result);
/*  */
DeviceHelper.isSmartDisplay(result);
/* check device type boxes, blu-ray players */
DeviceHelper.isPortableMediaPlayer(result);
/* check device type watches, headsets */
DeviceHelper.isWearable(result);
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
> This parser is experimental and contains few devices. (410 devices, alias devices 1177)
>
##### Support detail brands/models list:

<details>
<summary>Show details</summary>

| Brand | Device count | Alias count | - | Brand | Device count | Alias count |
|----|----|----|----|----|----|----|
| 360 | 10 | 10 | - | 8848 | 0 | 0 |
| 2e | 2 | 2 | - | 3gnet | 0 | 1 |
| 3q | 14 | 62 | - | 4good | 1 | 1 |
| 4ife | 0 | 1 | - | a1 | 0 | 1 |
| ace | 8 | 0 | - | acer | 5 | 68 |
| airo wireless | 1 | 0 | - | accent | 0 | 5 |
| acteck | 0 | 0 | - | advan | 0 | 1 |
| advance | 0 | 14 | - | afrione | 0 | 2 |
| agm | 0 | 0 | - | ainol | 0 | 16 |
| airness | 0 | 0 | - | airties | 0 | 0 |
| ais | 0 | 2 | - | aiuto | 0 | 0 |
| aiwa | 0 | 0 | - | akai | 1 | 5 |
| alba | 0 | 1 | - | alcatel | 0 | 427 |
| alcor | 1 | 0 | - | alfawise | 0 | 0 |
| aligator | 0 | 0 | - | allcall | 0 | 3 |
| alldocube | 2 | 6 | - | allview | 0 | 46 |
| allwinner | 0 | 3 | - | altek | 1 | 0 |
| altech uec | 0 | 0 | - | altice | 0 | 0 |
| altron | 0 | 1 | - | amazon | 19 | 30 |
| amgoo | 0 | 15 | - | amigoo | 0 | 0 |
| amoi | 62 | 2 | - | andowl | 0 | 0 |
| anry | 0 | 0 | - | ans | 0 | 0 |
| aoc | 0 | 0 | - | aoson | 0 | 6 |
| apple | 46 | 44 | - | archos | 89 | 7 |
| arian space | 0 | 2 | - | ark | 0 | 36 |
| armphone | 0 | 0 | - | arnova | 0 | 36 |
| arris | 0 | 0 | - | artel | 0 | 2 |
| artizlee | 0 | 1 | - | asano | 0 | 1 |
| asanzo | 1 | 0 | - | ask | 0 | 0 |
| assistant | 2 | 19 | - | asus | 75 | 215 |
| at&t | 1 | 2 | - | atvio | 0 | 0 |
| atom | 0 | 3 | - | avenzo | 1 | 3 |
| avh | 1 | 0 | - | avvio | 3 | 2 |
| axxion | 0 | 0 | - | azumi mobile | 0 | 1 |
| bellphone | 1 | 1 | - | benq | 0 | 1 |
| bravis | 21 | 17 | - | bb mobile | 2 | 10 |
| beyond | 0 | 7 | - | bangolufsen | 0 | 0 |
| barnes & noble | 1 | 6 | - | beeline | 11 | 1 |
| bird | 1 | 0 | - | billion | 1 | 1 |
| bezkam | 1 | 0 | - | bigben | 1 | 0 |
| bihee | 2 | 1 | - | black fox | 18 | 12 |
| öwn | 1 | 2 | - | zync | 2 | 0 |
| zyq | 1 | 13 | - |  |  |  |

</details>

```js
const InfoDevice = require('node-device-detector/parser/device/info-device');
const infoDevice = new InfoDevice;
const result = infoDevice.info('Asus', 'Zenfone 4');
console.log('Result information', result);
/*
result
{
  display: {
    size: '5.5',
    resolution: '1080x1920',  // width+height
    ratio: '16:9',
    ppi: "401"
  },
  size: '155.4x75.2x7.7',    // width+height+thickness
  weight: '165',
  hardware: {
    // ...
  }
  os: "Android 7.1",
  release: "2017.08",
  sim": "2",
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

##### Support detect brands list (1000):

<details>
<summary>Show details</summary>

* 2E, 2F Mobile, 360, 3GNET, 3Q, 4Good, 4ife, 8848, A1, Accent, Ace, Acer, Acteck, Advan, Advance, AfriOne, AGM, Ainol, Airness, Airties, AIS, Aiuto, Aiwa, Akai, Alba, Alcatel, Alcor, ALDI NORD, ALDI SÜD, Alfawise, Aligator, AllCall, AllDocube, Allview, Allwinner, Altech UEC, Altice, altron, Amazon, AMGOO, Amigoo, Amoi, Andowl, Anry, ANS, AOC, Aoson, Apple, Archos, Arian Space, Ark, ArmPhone, Arnova, ARRIS, Artel, Artizlee, Asano, Asanzo, Ask, Aspera, Assistant, Asus, AT&T, Atom, Atvio, Audiovox, AURIS, Avenzo, AVH, Avvio, Axxion, Azumi Mobile, BangOlufsen, Barnes & Noble, BB Mobile, BBK, BDF, Becker, Beeline, Beelink, Beetel, Bellphone, BenQ, BenQ-Siemens, Beyond, Bezkam, BGH, Bigben, BIHEE, BilimLand, Billion, BioRugged, Bird, Bitel, Bitmore, Bkav, Black Bear, Black Fox, Blackview, Blaupunkt, Blloc, Blu, Bluboo, Bluedot, Bluegood, Bluewave, Bmobile, Bobarry, bogo, Boway, bq, Brandt, Bravis, BrightSign, Brondi, Bush, CAGI, Camfone, Capitel, Captiva, Carrefour, Casio, Casper, Cat, Cavion, Celcus, Celkon, Cell-C, CellAllure, Centric, CG Mobile, Changhong, Cherry Mobile, CHIA, Chico Mobile, China Mobile, Chuwi, Claresta, Clarmin, Clementoni, Cloudfone, Cloudpad, Clout, CnM, Coby Kyros, Colors, Comio, Compal, Compaq, ComTrade Tesla, Concord, ConCorde, Condor, Connectce, Connex, Conquest, Contixo, Coolpad, CORN, Cosmote, Cowon, CreNova, Crescent, Cricket, Crius Mea, Crony, Crosscall, Cube, CUBOT, CVTE, Cyrus, Daewoo, Danew, Datalogic, Datamini, Datang, Datawind, Datsun, Dbtel, Dell, Denver, Desay, DeWalt, DEXP, Dialog, Dicam, Digi, Digicel, Digihome, Digiland, Digma, Ditecma, Diva, Divisat, DMM, DNS, DoCoMo, Doffler, Dolamee, Doogee, Doopro, Doov, Dopod, Doro, Droxio, Dune HD, E-Boda, E-Ceros, E-tel, Eagle, Easypix, EBEST, Echo Mobiles, ECS, EE, Einstein, EKO, Eks Mobility, EKT, ELARI, Electroneum, ELECTRONIA, Element, Elenberg, Elephone, Eltex, Energizer, Energy Sistem, Engel, Enot, Epik One, Ergo, Ericsson, Ericy, Essential, Essentielb, eSTAR, Eton, eTouch, Etuline, Eurostar, Evercoss, Evertek, Evolio, Evolveo, EvroMedia, EWIS, EXCEED, ExMobile, EXO, Explay, Extrem, Ezio, Ezze, F&U, F150, Facebook, Fairphone, Famoco, Fantec, FaRao Pro, FarEasTone, Fengxiang, Fero, FiGO, FinePower, Finlux, FireFly Mobile, Fly, FNB, Fondi, Fonos, FORME, Formuler, Forstar, Fortis, Fourel, Foxconn, Freetel, Fuego, Fujitsu, G-TiDE, G-Touch, Garmin-Asus, Gateway, Gemini, General Mobile, Genesis, GEOFOX, Geotel, GFive, Ghia, Ghong, Gigabyte, Gigaset, Gini, Ginzzu, Gionee, Globex, GLX, GOCLEVER, GoGEN, Gol Mobile, Goly, Gome, GoMobile, Google, Goophone, Gradiente, Grape, Gree, Greentel, Gresso, Grundig, Hafury, Haier, HannSpree, Hardkernel, Hasee, Helio, Hezire, Hi-Level, High Q, Highscreen, Hipstreet, Hisense, Hitachi, Hitech, Hoffmann, Hometech, Homtom, Honeywell, Hoozo, Horizon, Hosin, Hotel, Hotwav, How, HP, HTC, Huadoo, Huawei, Humax, Hurricane, Huskee, Hyrican, Hyundai, Hyve, i-Cherry, i-Joy, i-mate, i-mobile, iBall, iBerry, iBrit, IconBIT, iDroid, iGet, iHunt, Ikea, IKI Mobile, iKoMo, IKU Mobile, iLA, iLife, iMars, IMO Mobile, Impression, INCAR, Inco, iNew, Infinix, InFocus, InfoKit, Inkti, InnJoo, Innos, Innostream, Inoi, INQ, Insignia, Intek, Intex, Invens, Inverto, Invin, iOcean, iPro, iQ&T, IQM, Irbis, Iris, iRola, iRulu, iSWAG, IT, iTel, iTruck, IUNI, iVA, iView, iVooMi, iZotron, JAY-Tech, Jesy, JFone, Jiake, Jiayu, Jinga, Jivi, JKL, Jolla, Just5, JVC, K-Touch, Kaan, Kaiomy, Kalley, Kanji, Karbonn, Kata, KATV1, Kazam, KDDI, Kempler & Strauss, Keneksi, Kenxinda, Kiano, Kingsun, KINGZONE, Kivi, Klipad, Kocaso, Kodak, Kogan, Komu, Konka, Konrow, Koobee, Koolnee, Kooper, KOPO, Koridy, KRONO, Krüger&Matz, KT-Tech, KUBO, Kuliao, Kult, Kumai, Kyocera, Kyowon, Kzen, LAIQ, Land Rover, Landvo, Lanix, Lark, Laurus, Lava, LCT, Le Pan, Leader Phone, Leagoo, Ledstar, LeEco, Leff, Lemhoov, Lenco, Lenovo, Leotec, Lephone, Lesia, Lexand, Lexibook, LG, Lifemaxx, Lingwin, Linnex, Linsar, Loewe, Logic, Logicom, LT Mobile, Lumigon, Lumus, Luna, Luxor, LYF, M-Tech, M.T.T., M4tel, MAC AUDIO, Macoox, Magnus, Majestic, Malata, Manhattan, Mann, Manta Multimedia, Mantra, Masstel, Matrix, Maxcom, Maximus, Maxtron, MAXVI, Maxwest, Maze, Maze Speed, MDC Store, meanIT, Mecer, Mecool, Mediacom, MediaTek, Medion, MEEG, MegaFon, Meitu, Meizu, Melrose, Memup, Metz, MEU, MicroMax, Microsoft, Minix, Mintt, Mio, Miray, Mito, Mitsubishi, MIVO, MIXC, MiXzo, MLLED, MLS, Mobicel, Mobiistar, Mobiola, Mobistel, MobiWire, Mobo, Modecom, Mofut, Motorola, Movic, Mpman, MSI, MStar, MTC, MTN, Multilaser, MYFON, MyPhone, Myria, Myros, Mystery, MyTab, MyWigo, Nabi, Naomi Phone, National, Navcity, Navitech, Navitel, Navon, NEC, Necnot, Neffos, Neomi, Netgear, NeuImage, Newgen, Newland, Newman, Newsday, NewsMy, NEXBOX, Nexian, NEXON, Nextbit, NextBook, NextTab, NG Optics, NGM, Nikon, Nintendo, NOA, Noain, Nobby, Noblex, NOBUX, Nokia, Nomi, Nomu, Nordmende, NorthTech, Nos, Nous, NuAns, NUU Mobile, Nuvo, Nvidia, NYX Mobile, O+, O2, Oale, OASYS, Obi, Odys, OINOM, Ok, Okapia, OKWU, Onda, OnePlus, Onix, ONN, ONYX BOOX, OpelMobile, Openbox, OPPO, Opsson, Orange, Orbic, Ordissimo, Ouki, Oukitel, OUYA, Overmax, Ovvi, öwn, Owwo, Oysters, Oyyu, OzoneHD, P-UP, Palm, Panacom, Panasonic, Pantech, PCBOX, PCD, PCD Argentina, PEAQ, Pendoo, Pentagram, Phicomm, Philco, Philips, Phonemax, phoneOne, Pioneer, PiPO, Pixela, Pixelphone, Pixus, Planet Computers, Ployer, Plum, Pluzz, PocketBook, POCO, Point of View, Polaroid, PolyPad, Polytron, Pomp, Poppox, Positivo, Positivo BGH, PPTV, Premio, Prestigio, Primepad, Primux, Prixton, PROFiLO, Proline, ProScan, Protruly, PULID, Q-Touch, Q.Bell, Qilive, QMobile, Qtek, Quantum, Quechua, Qumo, R-TV, Ramos, Ravoz, Razer, RCA Tablets, Reach, Readboy, Realme, RED, Reeder, REGAL, Rikomagic, RIM, Rinno, Ritmix, Ritzviva, Riviera, Roadrover, Rokit, Roku, Rombica, Ross&Moor, Rover, RoverPad, RT Project, RugGear, Ruio, Runbo, Ryte, S-TELL, Saba, Safaricom, Sagem, Salora, Samsung, Sanei, Sansui, Santin, Sanyo, Savio, SCBC, Schneider, Seatel, Seeken, SEG, Sega, Selenga, Selevision, Selfix, SEMP TCL, Sencor, Sendo, Senkatel, Senseit, Senwa, Seuic, SFR, Sharp, Shift Phones, Shtrikh-M, Shuttle, Sico, Siemens, Sigma, Silelis, Silent Circle, Simbans, Simply, Singtech, Siragon, SKG, Sky, Skyworth, Smadl, Smailo, Smart, Smartab, SMARTEC, Smartfren, Smartisan, Softbank, SOLE, SOLO, Solone, Sonim, SONOS, Sony, Sony Ericsson, Soundmax, Soyes, Spark, SPC, Spectrum, Spice, SQOOL, Star, Starlight, Starmobile, Starway, STF Mobile, STK, Stonex, Storex, StrawBerry, Subor, Sugar, Sumvision, Sunny, Sunstech, SunVan, Sunvell, SuperSonic, SuperTab, Supra, Suzuki, Swipe, SWISSMOBILITY, Swisstone, SWTV, Symphony, Syrox, T-Mobile, Takara, Tanix, TB Touch, TCL, TD Systems, Technicolor, Technika, TechniSat, TechnoTrend, TechPad, Techwood, Teclast, Tecno Mobile, TEENO, Teknosa, Tele2, Telefunken, Telego, Telenor, Telit, Tesco, Tesla, Tetratab, teXet, ThL, Thomson, Thuraya, TIANYU, Time2, Timovi, Tinai, Tinmo, TiPhone, TOKYO, Tolino, Tone, Tooky, Top House, Toplux, Topway, Torex, Toshiba, Touchmate, Transpeed, TrekStor, Trevi, Trifone, Trio, Tronsmart, True, True Slim, TTEC, Tunisie Telecom, Turbo, Turbo-X, TurboKids, TVC, TWM, Twoe, TWZ, Tymes, U.S. Cellular, Ugoos, Uhans, Uhappy, Ulefone, Umax, UMIDIGI, Unihertz, Unimax, Uniscope, UNIWA, Unknown, Unnecto, Unonu, Unowhy, UTOK, UTStarcom, v-mobile, VAIO, Vastking, VC, Venso, Verico, Verizon, Vernee, Vertex, Vertu, Verykool, Vesta, Vestel, VGO TEL, Videocon, Videoweb, ViewSonic, Vinga, Vinsoc, Vipro, Vision Touch, Vitelcom, Viumee, Vivax, Vivo, Vizio, VK Mobile, VKworld, Vodacom, Vodafone, Vonino, Vontar, Vorago, Vorke, Voto, VOX, Voxtel, Voyo, Vsmart, Vsun, Vulcan, VVETIME, Walton, WE, Web TV, Weimei, WellcoM, WELLINGTON, Western Digital, Westpoint, Wexler, Wieppo, Wigor, Wiko, Wileyfox, Winds, Wink, Winmax, Winnovo, Wintouch, Wiseasy, Wizz, Wolder, Wolfgang, Wonu, Woo, Wortmann, Woxter, X-BO, X-TIGI, X-View, X.Vision, Xgody, Xiaolajiao, Xiaomi, Xion, Xolo, Xoro, Xshitou, Xtouch, Yandex, Yarvik, Yes, Yezz, Yoka TV, Yota, Ytone, Yu, Yuandao, YUHO, Yusun, Yxtel, Zatec, Zebra, Zeemi, Zen, Zenek, Zentality, Zfiner, ZH&K, Zidoo, Ziox, Zonda, Zopo, ZTE, Zuum, Zync, ZYQ

</details>

##### Support detect browsers list (323):

<details>
<summary>Show details</summary>

* 115 Browser, 2345 Browser, 360 Browser, 360 Phone Browser, 7654 Browser, 7Star, ABrowse, Aloha Browser, Aloha Browser Lite, Amaya, Amiga Aweb, Amiga Voyager, Amigo, Android Browser, ANT Fresco, ANTGalio, AOL Desktop, AOL Shield, Arctic Fox, Arora, Atom, Atomic Web Browser, Avant Browser, Avast Secure Browser, AVG Secure Browser, Avira Scout, AwoX, B-Line, Baidu Browser, Baidu Spark, Basilisk, Beaker Browser, Beamrise, Beonex, Biyubi, BlackBerry Browser, BlackHawk, Blue Browser, Borealis Navigator, Brave, BriskBard, BrowseX, Browzar, Bunjalloo, Byffox, Camino, CCleaner, Centaury, Charon, Chedot, Cheetah Browser, Cheshire, Chim Lac, Chrome, Chrome Frame, Chrome Mobile, Chrome Mobile iOS, Chrome Webview, ChromePlus, Chromium, Chromium GOST, CM Browser, Coast, Coc Coc, Colibri, CometBird, Comodo Dragon, Conkeror, CoolBrowser, CoolNovo, Cornowser, COS Browser, Craving Explorer, Crazy Browser, Crusta, Cunaguaro, Cyberfox, dbrowser, Deepnet Explorer, deg-degan, Deledao, Delta Browser, DeskBrowse, Dillo, Dolphin, Dooble, Dorado, Dot Browser, DuckDuckGo Privacy Browser, Ecosia, Element Browser, Elements Browser, Elinks, Epic, Espial TV Browser, EUI Browser, eZ Browser, Falkon, Faux Browser, Fennec, Firebird, Firefox, Firefox Focus, Firefox Mobile, Firefox Mobile iOS, Firefox Reality, Firefox Rocket, Fireweb, Fireweb Navigator, Flast, Flock, Flow, Fluid, FreeU, Galeon, Ghostery Privacy Browser, GinxDroid Browser, Glass Browser, GNOME Web, GOG Galaxy, Google Earth, HasBrowser, Hawk Turbo Browser, Headless Chrome, Helio, hola! Browser, HotJava, Huawei Browser, IBrowse, iCab, iCab Mobile, IceCat, IceDragon, Iceweasel, IE Mobile, Internet Explorer, Iridium, Iron, Iron Mobile, Isivioo, Japan Browser, Jasmine, JavaFX, Jig Browser, Jig Browser Plus, Jio Browser, K-meleon, K.Browser, Kapiko, Kazehakase, Kindle Browser, Kinza, Kiwi, Kode Browser, Konqueror, Kylo, LG Browser, LieBaoFast, Light, Links, Lolifox, Lovense Browser, LuaKit, Lulumi, Lunascape, Lunascape Lite, Lynx, MAUI WAP Browser, Maxthon, mCent, Meizu Browser, Mercury, MicroB, Microsoft Edge, Midori, Minimo, Mint Browser, MIUI Browser, Mobicip, Mobile Safari, Mobile Silk, Monument Browser, MxNitro, Mypal, Navigateur Web, NCSA Mosaic, NetFront, NetFront Life, NetPositive, Netscape, NetSurf, NFS Browser, Nokia Browser, Nokia OSS Browser, Nokia Ovi Browser, Nox Browser, NTENT Browser, Obigo, OceanHero, Oculus Browser, Odin, Odyssey Web Browser, Off By One, OhHai Browser, OmniWeb, ONE Browser, Openwave Mobile Browser, Opera, Opera Devices, Opera GX, Opera Mini, Opera Mini iOS, Opera Mobile, Opera Neon, Opera Next, Opera Touch, Oppo Browser, Orca, Ordissimo, Oregano, Origin In-Game Overlay, Origyn Web Browser, Otter Browser, Pale Moon, Palm Blazer, Palm Pre, Palm WebPro, Palmscape, Perfect Browser, Phantom Browser, Phoenix, Phoenix Browser, PlayFree Browser, Polaris, Polarity, PolyBrowser, Polypane, PrivacyWall, Puffin, Qazweb, QQ Browser, QQ Browser Lite, QQ Browser Mini, QtWebEngine, Quark, QupZilla, Qutebrowser, Qwant Mobile, Realme Browser, Rekonq, RockMelt, Safari, Safe Exam Browser, Sailfish Browser, SalamWeb, Samsung Browser, Seewo Browser, SEMC-Browser, Seraphic Sraf, Seznam Browser, SFive, Shiira, SimpleBrowser, Sizzy, Skyfire, Sleipnir, Slimjet, Smart Lenovo Browser, Smooz, Snowshoe, Sogou Explorer, Sogou Mobile Browser, SP Browser, Splash, Sputnik Browser, Stargon, START Internet Browser, Steam In-Game Overlay, Streamy, Sunrise, Super Fast Browser, SuperBird, surf, Swiftfox, T-Browser, t-online.de Browser, Tao Browser, TenFourFox, Tenta Browser, Tizen Browser, ToGate, Tungsten, TV Bro, TweakStyle, UBrowser, UC Browser, UC Browser HD, UC Browser Mini, UC Browser Turbo, UR Browser, Uzbl, Venus Browser, Vision Mobile Browser, Vivaldi, vivo Browser, VMware AirWatch, Waterfox, Wear Internet Browser, Web Explorer, WebPositive, WeTab Browser, Whale Browser, wOSBrowser, Xiino, xStand, Xvast, Yaani Browser, Yahoo! Japan Browser, Yandex Browser, Yandex Browser Lite, Yolo Browser, Zetakey, Zvu
</details>


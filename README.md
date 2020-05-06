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
<details>
<summary>Show details</summary>

* v1.2.3
    * Update fixtures from the motamo-org/devicedetect package#3.12.5 (update to 2020/05/07)
* v1.2.2
    * Update fixtures from the motamo-org/devicedetect package#3.12.4 (update to 2020/04/06)
* v1.2.1
    * Update fixtures from the motamo-org/devicedetect package#3.12.3 (update to 2020/03/14)
* v1.2.0
    * Update fixtures from the motamo-org/devicedetect package#3.12.3 (update to 2020/02/04)
* v1.1.9
    * Update fixtures(update to 2020/01/07)    
* v1.1.8
    * Update fixtures from the motamo-org/devicedetect package#3.12.0 (update to 2019/10/03)
* v1.1.7
    * Update fixtures from the motamo-org/devicedetect package#3.12.0
* v1.1.6
    * Update fixtures from the motamo-org/devicedetect package#3.11.8
* v1.1.5
    * Update fixtures from the motamo-org/devicedetect package#3.11.7
    * Remove methods: isBot(), isMobile(), isPhablet() is* etc...
    * All parsing results are no longer stored in the class object, the result is given immediately, this will allow you to use asynchrony
    
</details>
Usage
-

```js
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const detector = new DeviceDetector;

const result = detector.detect(userAgent);

/*
const DEVICE_TYPE = require('node-device-detector/parser/const/device-type');
const isTabled  = result.device && [DEVICE_TYPE.TABLET].indexOf(result.device.type) !== -1;
const isMobile = result.device && [DEVICE_TYPE.SMARTPHONE, DEVICE_TYPE.FEATURE_PHONE].indexOf(result.device.type) !== -1;
const isPhablet = result.device && [DEVICE_TYPE.PHABLET].indexOf(result.device.type) !== -1;
const isIOS = result.os && result.os.family === 'iOS';
const isAndroid = result.os && result.os.family === 'Android';
const isDesktop = !isTabled && !isMobile && !isPhablet;
*/

console.log('result parse', result);
```

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
const detector = new DeviceDetector;
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

Others
-
* [Micro service](MICROSERVICE.MD)  from framework [moleculer js](http://moleculer.services)

Support detect brands list (587):
* 3Q, 4Good, Ace, Acer, Advan, Advance, AGM, Ainol, Airness, AIS, Aiwa, Akai, Alba, Alcatel, Aligator, AllCall, AllDocube, Allview, Allwinner, altron, Amazon, AMGOO, Amoi, ANS, Apple, Archos, Arian Space, Ark, ArmPhone, Arnova, ARRIS, Ask, Assistant, Asus, Atom,
Audiovox, AVH, Avvio, Axxion, Azumi Mobile, Barnes & Noble, BDF, Becker, Beeline, Beetel, BenQ, BenQ-Siemens, Bezkam, BGH, Bird, Bitel, Black Fox, Blackview, Blaupunkt, Blu, Bluboo, Bluegood, Bmobile, bogo, Boway, bq, Bravis, Brondi, Bush, CAGI, Capitel, Captiv
a, Carrefour, Casio, Casper, Cat, Celkon, Changhong, Cherry Mobile, China Mobile, Chuwi, Clarmin, CnM, Coby Kyros, Comio, Compal, ComTrade Tesla, Concord, ConCorde, Condor, Coolpad, Crescent, Cricket, Crius Mea, Crosscall, Cube, CUBOT, CVTE, Cyrus, Daewoo, Dane
w, Datang, Datsun, Dbtel, Dell, Denver, Desay, DeWalt, DEXP, Dialog, Dicam, Digi, Digicel, Digiland, Digma, Divisat, DNS, DoCoMo, Doogee, Doov, Dopod, Doro, Dune HD, E-Boda, E-tel, Easypix, EBEST, Echo Mobiles, ECS, EE, EKO, Eks Mobility, Element, Elenberg, Ele
phone, Energizer, Energy Sistem, Ergo, Ericsson, Ericy, Essential, Essentielb, Eton, eTouch, Etuline, Eurostar, Evercoss, Evertek, Evolio, Evolveo, EvroMedia, Explay, Extrem, Ezio, Ezze, Fairphone, Famoco, Fengxiang, FiGO, FinePower, Fly, FNB, Fondi, FORME, For
star, Foxconn, Freetel, Fujitsu, G-TiDE, Garmin-Asus, Gemini, General Mobile, Geotel, Ghia, Ghong, Gigabyte, Gigaset, Ginzzu, Gionee, Globex, GOCLEVER, Goly, Gome, GoMobile, Google, Gradiente, Grape, Grundig, Hafury, Haier, HannSpree, Hasee, Hi-Level, Highscree
n, Hisense, Hoffmann, Homtom, Hoozo, Hosin, HP, HTC, Huadoo, Huawei, Hyundai, i-Joy, i-mate, i-mobile, iBall, iBerry, IconBIT, iGet, iHunt, iKoMo, iLA, IMO Mobile, Impression, iNew, Infinix, InFocus, Inkti, InnJoo, Innostream, Inoi, INQ, Insignia, Intex, iOcean
, iPro, Irbis, iRola, iRulu, iTel, iVA, iView, iZotron, JAY-Tech, JFone, Jiayu, Jolla, Just5, K-Touch, Kaan, Kaiomy, Kalley, Kanji, Karbonn, KATV1, Kazam, KDDI, Kempler & Strauss, Keneksi, Kiano, Kingsun, Kivi, Kocaso, Kodak, Kogan, Komu, Konka, Konrow, Koobee,
 KOPO, Koridy, KRONO, Krüger&Matz, KT-Tech, Kumai, Kyocera, LAIQ, Land Rover, Landvo, Lanix, Lark, Lava, LCT, Le Pan, Leagoo, Ledstar, LeEco, Lemhoov, Lenco, Lenovo, Leotec, Lephone, Lexand, Lexibook, LG, Lingwin, Logicom, Lumus, Luna, LYF, M.T.T., M4tel, Majes
tic, Mann, Manta Multimedia, Masstel, Maxcom, Maxwest, Maze, Mecer, Mecool, Mediacom, Medion, MEEG, MegaFon, Meitu, Meizu, Memup, MEU, MicroMax, Microsoft, Mio, Miray, Mitsubishi, MIXC, MLLED, Mobicel, Mobiistar, Mobiola, Mobistel, Modecom, Mofut, Motorola, Mov
ic, Mpman, MSI, MTC, MTN, MYFON, MyPhone, Myria, Mystery, MyWigo, National, Navon, NEC, Neffos, Netgear, NeuImage, Newgen, NewsMy, NEXBOX, Nexian, Nextbit, NextBook, NG Optics, NGM, NOA, Noain, Nobby, Noblex, Nokia, Nomi, Nous, NUU Mobile, Nuvo, Nvidia, NYX Mob
ile, O+, O2, Obi, Odys, Onda, OnePlus, OPPO, Opsson, Orange, Ouki, Oukitel, Overmax, öwn, Oysters, Palm, Panacom, Panasonic, Pantech, PCBOX, PCD, PCD Argentina, Pentagram, Phicomm, Philips, phoneOne, Pioneer, Pixus, Ployer, Plum, Point of View, Polaroid, PolyPa
d, Polytron, Pomp, Positivo, PPTV, Prestigio, Primepad, Proline, ProScan, Protruly, PULID, Q-Touch, Qilive, QMobile, Qtek, Quantum, Quechua, Qumo, R-TV, Ramos, Razer, RCA Tablets, Readboy, Rikomagic, RIM, Rinno, Ritmix, Ritzviva, Riviera, Roadrover, Rokit, Roku
, Rombica, Ross&Moor, Rover, RoverPad, RT Project, RugGear, Runbo, Ryte, Safaricom, Sagem, Samsung, Sanei, Santin, Sanyo, Savio, Selfix, Sencor, Sendo, Senseit, Senwa, SFR, Sharp, Shift Phones, Shuttle, Siemens, Sigma, Silent Circle, Simbans, Sky, Skyworth, Sma
rtfren, Smartisan, Softbank, Sonim, Sony, Soyes, Spectrum, Spice, Star, Starway, STF Mobile, STK, Stonex, Storex, Sumvision, SunVan, Sunvell, SuperSonic, Supra, SWISSMOBILITY, Symphony, Syrox, T-Mobile, TB Touch, TCL, TechPad, Teclast, Tecno Mobile, Telefunken,
 Telego, Telenor, Telit, Tesco, teXet, ThL, Thomson, TIANYU, Timovi, TiPhone, Tolino, Tooky, Top House, Toplux, Toshiba, Touchmate, TrekStor, Trevi, True, Tunisie Telecom, Turbo, Turbo-X, TVC, U.S. Cellular, Ugoos, Uhans, Uhappy, Ulefone, Umax, UMIDIGI, Unihert
z, Unimax, Uniscope, Unknown, Unnecto, Unonu, Unowhy, UTOK, UTStarcom, Vastking, Venso, Verizon, Vernee, Vertex, Vertu, Verykool, Vesta, Vestel, VGO TEL, Videocon, ViewSonic, Vinga, Vinsoc, Vitelcom, Vivax, Vivo, Vizio, VK Mobile, Vodafone, Vonino, Vontar, Vora
go, Vorke, Voto, Voxtel, Voyo, Vsun, Vulcan, Walton, Weimei, WellcoM, Wexler, Wieppo, Wigor, Wiko, Wileyfox, Wink, Wolder, Wolfgang, Wonu, Woo, Woxter, X-TIGI, X-View, Xiaolajiao, Xiaomi, Xion, Xolo, Xoro, Yandex, Yarvik, Yes, Yezz, Yota, Ytone, Yu, Yuandao, Yu
sun, Yxtel, Zeemi, Zen, Zenek, Zfiner, Zidoo, Zonda, Zopo, ZTE, Zuum, Zync, ZYQ


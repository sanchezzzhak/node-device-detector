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

* v1.2.8
    * Update fixtures from the motamo-org/devicedetect package#3.13.0 (update to 2020/09/03)
    * Added new methods: setOsVersionTruncate, setClientVersionTruncate

* v1.2.7
    * Update fixtures from the motamo-org/devicedetect package#3.13.0 (update to 2020/08/17)
    
* v1.2.6
    * Update fixtures from the motamo-org/devicedetect package#3.12.6 (update to 2020/08/06)
    
* OLD VERSIONS [CHANGELOG.MD](CHANGELOG.MD)

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
const isWearable = result.device.type === DEVICE_TYPE.WEARABLE;
const isAndroid = result.os && result.os.family === 'Android';
const isDesktop = !isTabled && !isMobile && !isPhablet && !isWearable;
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

### Parse commercial model (model raw name)
```js
const AliasDevice = require('node-device-detector/parser/device/alias-device');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const aliasDevice = new AliasDevice;
const result = aliasDevice.parse(userAgent);
console.log('Result parse commercial model', result);  // result {name: "NX505J"}
``` 

### Getter/Setter/Options methods
```js

const detector = new DeviceDetector({
  osVersionTruncate: 0, // Truncate Os version from 5.0 to 5 (default '' or null)
  clientVersionTruncate: 2  // Truncate Client version Chrome from 43.0.2357 .78 to 43.0.2357 (default '' or null)
});
// You can override these settings at any time using special methods, example
detector.setOsVersionTruncate(0);
detector.setClientVersionTruncate(2);
```
Others
-
* [Micro service detect device](docs/MICROSERVICE.MD) from framework [moleculer js](http://moleculer.services)
* [Example1 detect device in native server](docs/NATIVE_SERVER.MD)
* [Example2 detect device in express.js](docs/EXPRESS_SERVER.MD)

Support detect brands list (735):

<details>
<summary>Show details</summary>

* 2E, 360, 3Q, 4Good, Accent, Ace, Acer, Advan, Advance, AGM, Ainol, Airness, Airties, AIS, Aiwa, Akai, Alba, Alcatel, Alfawise, Aligator, AllCall, AllDocube, Allview, Allwinner, Altech UEC, altron, Amazon, AMGOO, Amigoo, Amoi, Anry
, ANS, Aoson, Apple, Archos, Arian Space, Ark, ArmPhone, Arnova, ARRIS, Asano, Ask, Assistant, Asus, AT&T, Atom, Audiovox, Avenzo, AVH, Avvio, Axxion, Azumi Mobile, BangOlufsen, Barnes & Noble, BB Mobile, BBK, BDF, Becker, Beeline,
Beelink, Beetel, BenQ, BenQ-Siemens, Bezkam, BGH, BIHEE, Billion, Bird, Bitel, Bitmore, Black Fox, Blackview, Blaupunkt, Blu, Bluboo, Bluegood, Bmobile, Bobarry, bogo, Boway, bq, Bravis, Brondi, Bush, CAGI, Capitel, Captiva, Carrefo
ur, Casio, Casper, Cat, Celkon, Changhong, Cherry Mobile, China Mobile, Chuwi, Clarmin, Cloudfone, Clout, CnM, Coby Kyros, Comio, Compal, Compaq, ComTrade Tesla, Concord, ConCorde, Condor, Contixo, Coolpad, Cowon, CreNova, Crescent,
 Cricket, Crius Mea, Crony, Crosscall, Cube, CUBOT, CVTE, Cyrus, Daewoo, Danew, Datang, Datawind, Datsun, Dbtel, Dell, Denver, Desay, DeWalt, DEXP, Dialog, Dicam, Digi, Digicel, Digiland, Digma, Divisat, DMM, DNS, DoCoMo, Doffler, D
olamee, Doogee, Doopro, Doov, Dopod, Doro, Droxio, Dune HD, E-Boda, E-Ceros, E-tel, Easypix, EBEST, Echo Mobiles, ECS, EE, EKO, Eks Mobility, Element, Elenberg, Elephone, Eltex, Energizer, Energy Sistem, Enot, Ergo, Ericsson, Ericy,
 Essential, Essentielb, Eton, eTouch, Etuline, Eurostar, Evercoss, Evertek, Evolio, Evolveo, EvroMedia, Explay, Extrem, Ezio, Ezze, Fairphone, Famoco, Fengxiang, FiGO, FinePower, FireFly Mobile, Fly, FNB, Fondi, FORME, Forstar, Foxc
onn, Freetel, Fujitsu, G-TiDE, Garmin-Asus, Gateway, Gemini, General Mobile, Geotel, Ghia, Ghong, Gigabyte, Gigaset, Ginzzu, Gionee, Globex, GOCLEVER, Goly, Gome, GoMobile, Google, Goophone, Gradiente, Grape, Gree, Grundig, Hafury,
Haier, HannSpree, Hasee, Hi-Level, Highscreen, Hisense, Hoffmann, Homtom, Hoozo, Hosin, Hotwav, How, HP, HTC, Huadoo, Huawei, Humax, Hyrican, Hyundai, i-Cherry, i-Joy, i-mate, i-mobile, iBall, iBerry, IconBIT, iDroid, iGet, iHunt, I
kea, iKoMo, iLA, iLife, iMars, IMO Mobile, Impression, iNew, Infinix, InFocus, Inkti, InnJoo, Innostream, Inoi, INQ, Insignia, Intek, Intex, Inverto, Invin, iOcean, iPro, IQM, Irbis, iRola, iRulu, iTel, iTruck, iVA, iView, iZotron,
JAY-Tech, JFone, Jiayu, Jinga, JKL, Jolla, Just5, K-Touch, Kaan, Kaiomy, Kalley, Kanji, Karbonn, KATV1, Kazam, KDDI, Kempler & Strauss, Keneksi, Kenxinda, Kiano, Kingsun, Kivi, Klipad, Kocaso, Kodak, Kogan, Komu, Konka, Konrow, Koob
ee, Kooper, KOPO, Koridy, KRONO, Krüger&Matz, KT-Tech, Kuliao, Kumai, Kyocera, Kzen, LAIQ, Land Rover, Landvo, Lanix, Lark, Lava, LCT, Le Pan, Leagoo, Ledstar, LeEco, Lemhoov, Lenco, Lenovo, Leotec, Lephone, Lesia, Lexand, Lexibook,
 LG, Lingwin, Loewe, Logic, Logicom, Lumigon, Lumus, Luna, LYF, M.T.T., M4tel, Macoox, Majestic, Mann, Manta Multimedia, Masstel, Maxcom, Maxtron, MAXVI, Maxwest, Maze, meanIT, Mecer, Mecool, Mediacom, MediaTek, Medion, MEEG, MegaFo
n, Meitu, Meizu, Melrose, Memup, Metz, MEU, MicroMax, Microsoft, Minix, Mio, Miray, Mito, Mitsubishi, MIXC, MiXzo, MLLED, MLS, Mobicel, Mobiistar, Mobiola, Mobistel, Mobo, Modecom, Mofut, Motorola, Movic, Mpman, MSI, MTC, MTN, Multi
laser, MYFON, MyPhone, Myria, Mystery, MyTab, MyWigo, National, Navon, NEC, Neffos, Neomi, Netgear, NeuImage, Newgen, Newland, Newman, NewsMy, NEXBOX, Nexian, NEXON, Nextbit, NextBook, NextTab, NG Optics, NGM, Nikon, Nintendo, NOA,
Noain, Nobby, Noblex, Nokia, Nomi, Nomu, Nos, Nous, NUU Mobile, Nuvo, Nvidia, NYX Mobile, O+, O2, Obi, Odys, Onda, OnePlus, Onix, ONN, Openbox, OPPO, Opsson, Orange, Orbic, Ordissimo, Ouki, Oukitel, OUYA, Overmax, öwn, Owwo, Oysters
, Oyyu, OzoneHD, Palm, Panacom, Panasonic, Pantech, PCBOX, PCD, PCD Argentina, PEAQ, Pentagram, Phicomm, Philco, Philips, Phonemax, phoneOne, Pioneer, Pixus, Ployer, Plum, PocketBook, POCO, Point of View, Polaroid, PolyPad, Polytron
, Pomp, Positivo, Positivo BGH, PPTV, Prestigio, Primepad, Primux, Prixton, Proline, ProScan, Protruly, PULID, Q-Touch, Q.Bell, Qilive, QMobile, Qtek, Quantum, Quechua, Qumo, R-TV, Ramos, Ravoz, Razer, RCA Tablets, Readboy, Realme,
RED, Rikomagic, RIM, Rinno, Ritmix, Ritzviva, Riviera, Roadrover, Rokit, Roku, Rombica, Ross&Moor, Rover, RoverPad, RT Project, RugGear, Runbo, Ryte, Safaricom, Sagem, Samsung, Sanei, Santin, Sanyo, Savio, Schneider, Sega, Selevisio
n, Selfix, SEMP TCL, Sencor, Sendo, Senkatel, Senseit, Senwa, SFR, Sharp, Shift Phones, Shuttle, Siemens, Sigma, Silent Circle, Simbans, Sky, Skyworth, Smart, Smartfren, Smartisan, Softbank, Sonim, Sony, Sony Ericsson, Soundmax, Soy
es, Spectrum, Spice, SQOOL, Star, Starway, STF Mobile, STK, Stonex, Storex, Sugar, Sumvision, Sunstech, SunVan, Sunvell, SuperSonic, Supra, Swipe, SWISSMOBILITY, Symphony, Syrox, T-Mobile, Takara, TB Touch, TCL, TD Systems, TechniSa
t, TechnoTrend, TechPad, Teclast, Tecno Mobile, Tele2, Telefunken, Telego, Telenor, Telit, Tesco, Tesla, Tetratab, teXet, ThL, Thomson, TIANYU, Time2, Timovi, Tinai, TiPhone, Tolino, Tone, Tooky, Top House, Toplux, Torex, Toshiba, T
ouchmate, TrekStor, Trevi, Tronsmart, True, Tunisie Telecom, Turbo, Turbo-X, TurboKids, TVC, TWM, Twoe, U.S. Cellular, Ugoos, Uhans, Uhappy, Ulefone, Umax, UMIDIGI, Unihertz, Unimax, Uniscope, Unknown, Unnecto, Unonu, Unowhy, UTOK,
UTStarcom, Vastking, Venso, Verizon, Vernee, Vertex, Vertu, Verykool, Vesta, Vestel, VGO TEL, Videocon, Videoweb, ViewSonic, Vinga, Vinsoc, Vipro, Vitelcom, Vivax, Vivo, Vizio, VK Mobile, VKworld, Vodacom, Vodafone, Vonino, Vontar,
Vorago, Vorke, Voto, Voxtel, Voyo, Vsmart, Vsun, Vulcan, Walton, Web TV, Weimei, WellcoM, Wexler, Wieppo, Wigor, Wiko, Wileyfox, Winds, Wink, Wolder, Wolfgang, Wonu, Woo, Wortmann, Woxter, X-BO, X-TIGI, X-View, Xgody, Xiaolajiao, Xi
aomi, Xion, Xolo, Xoro, Xshitou, Yandex, Yarvik, Yes, Yezz, Yota, Ytone, Yu, Yuandao, Yusun, Yxtel, Zeemi, Zen, Zenek, Zfiner, Zidoo, Ziox, Zonda, Zopo, ZTE, Zuum, Zync, ZYQ

</details>

##### Support detect browsers list (264):

<details>
<summary>Show details</summary>

* 115 Browser, 2345 Browser, 360 Browser, 360 Phone Browser, ABrowse, Aloha Browser, Aloha Browser Lite, Amaya, Amiga Aweb, Amiga Voyager, Amigo, Android Browser, ANT Fresco, ANTGalio, AOL Desktop, AOL Shield, Arctic Fox, Arora, Ato
  m, Atomic Web Browser, Avant Browser, Avast Secure Browser, AVG Secure Browser, B-Line, Baidu Browser, Baidu Spark, Basilisk, Beaker Browser, Beamrise, Beonex, BlackBerry Browser, BlackHawk, Blue Browser, Brave, BriskBard, BrowseX,
  Bunjalloo, Camino, CCleaner, Centaury, Charon, Cheetah Browser, Cheshire, Chrome, Chrome Frame, Chrome Mobile, Chrome Mobile iOS, Chrome Webview, ChromePlus, Chromium, CM Browser, Coast, Coc Coc, Colibri, CometBird, Comodo Dragon, C
  onkeror, CoolNovo, COS Browser, Crusta, Cunaguaro, Cyberfox, dbrowser, Deepnet Explorer, Delta Browser, Dillo, Dolphin, Dooble, Dorado, DuckDuckGo Privacy Browser, Ecosia, Element Browser, Elements Browser, Elinks, Epic, Espial TV B
  rowser, EUI Browser, eZ Browser, Falkon, Faux Browser, Fennec, Firebird, Firefox, Firefox Focus, Firefox Mobile, Firefox Mobile iOS, Firefox Reality, Firefox Rocket, Fireweb, Fireweb Navigator, Flock, Fluid, FreeU, Galeon, Glass Bro
  wser, GNOME Web, GOG Galaxy, Google Earth, Hawk Turbo Browser, Headless Chrome, hola! Browser, HotJava, Huawei Browser, IBrowse, iCab, iCab Mobile, IceCat, IceDragon, Iceweasel, IE Mobile, Internet Explorer, Iridium, Iron, Iron Mobi
  le, Isivioo, Jasmine, Jig Browser, Jig Browser Plus, Jio Browser, K-meleon, K.Browser, Kapiko, Kazehakase, Kindle Browser, Kinza, Kiwi, Konqueror, Kylo, LG Browser, LieBaoFast, Light, Links, Lovense Browser, LuaKit, Lulumi, Lunascap
  e, Lunascape Lite, Lynx, Maxthon, mCent, Meizu Browser, Mercury, MicroB, Microsoft Edge, Midori, Minimo, Mint Browser, MIUI Browser, Mobicip, Mobile Safari, Mobile Silk, Mypal, NCSA Mosaic, NetFront, NetFront Life, NetPositive, Nets
  cape, NetSurf, Nokia Browser, Nokia OSS Browser, Nokia Ovi Browser, Nox Browser, NTENT Browser, Obigo, Oculus Browser, Odyssey Web Browser, Off By One, OhHai Browser, OmniWeb, ONE Browser, Openwave Mobile Browser, Opera, Opera Devic
  es, Opera GX, Opera Mini, Opera Mini iOS, Opera Mobile, Opera Neon, Opera Next, Opera Touch, Oppo Browser, Ordissimo, Oregano, Origin In-Game Overlay, Origyn Web Browser, Otter Browser, Pale Moon, Palm Blazer, Palm Pre, Palm WebPro,
   Palmscape, Phoenix, Polaris, Polarity, Polypane, Puffin, QQ Browser, QQ Browser Mini, QtWebEngine, Quark, QupZilla, Qutebrowser, Qwant Mobile, Realme Browser, Rekonq, RockMelt, Safari, Safe Exam Browser, Sailfish Browser, SalamWeb,
   Samsung Browser, SEMC-Browser, Seraphic Sraf, Seznam Browser, Shiira, SimpleBrowser, Sizzy, Skyfire, Sleipnir, Snowshoe, Sogou Explorer, Sogou Mobile Browser, Splash, Sputnik Browser, START Internet Browser, Steam In-Game Overlay,
  Streamy, Sunrise, Super Fast Browser, SuperBird, surf, Swiftfox, t-online.de Browser, Tao Browser, TenFourFox, Tenta Browser, Tizen Browser, ToGate, Tungsten, TV Bro, TweakStyle, UBrowser, UC Browser, UC Browser Mini, UC Browser Tur
  bo, Uzbl, Vision Mobile Browser, Vivaldi, vivo Browser, VMware AirWatch, Waterfox, Wear Internet Browser, Web Explorer, WebPositive, WeTab Browser, Whale Browser, wOSBrowser, Xiino, Xvast, Yaani Browser, Yahoo! Japan Browser, Yandex
   Browser, Yandex Browser Lite, Zvu

</details>

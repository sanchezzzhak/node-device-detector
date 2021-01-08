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
* v1.3.2
    * Update fixtures from the motamo-org/device-detect package#4.1.0 (update to 2021/01/08)
    
* v1.3.1
    * Update fixtures from the motamo-org/device-detect package#4.0.2 (update to 2020/12/07)
    
* v1.3.0
    * Update fixtures from the motamo-org/device-detect package#4.0.1 (update to 2020/11/12)
    * Mason js prototyping has been replaced by ES classes
    


    
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

Support detect brands list (843): 

<details>
<summary>Show details</summary>

* 2E, 360, 3Q, 4Good, 4ife, 8848, A1, Accent, Ace, Acer, Advan, Advance, AGM, Ainol, Airness, Airties, AIS, Aiwa, Akai, Alba, Alcatel, Alcor, ALDI SÜD, Alfawise, Aligator, AllCall, AllDocube, Allview, Allwinner, Altech UEC, Altice, altron, Amazon, AMGOO, Amigoo, Amoi, Andowl, Anry, ANS, Aoson, Apple, Archos, Arian Space, Ark, ArmPhone, Arnova, ARRIS, Artel, Artizlee, Asano, Asanzo, Ask, Assistant, Asus, AT&T, Atom, Audiovox, Avenzo, AVH, Avvio, Axxion, Azumi Mobile, BangOlufsen, Barnes & Noble, BB Mobile, BBK, BDF, Becker, Beeline, Beelink, Beetel, BenQ, BenQ-Siemens, Bezkam, BGH, Bigben, BIHEE, Billion, BioRugged, Bird, Bitel, Bitmore, Bkav, Black Bear, Black Fox, Blackview, Blaupunkt, Blu, Bluboo, Bluedot, Bluegood, Bluewave, Bmobile, Bobarry, bogo, Boway, bq, Brandt, Bravis, Brondi, Bush, CAGI, Capitel, Captiva, Carrefour, Casio, Casper, Cat, Celcus, Celkon, Changhong, Cherry Mobile, China Mobile, Chuwi, Clarmin, Cloudfone, Cloudpad, Clout, CnM, Coby Kyros, Comio, Compal, Compaq, ComTrade Tesla, Concord, ConCorde, Condor, Conquest, Contixo, Coolpad, Cowon, CreNova, Crescent, Cricket, Crius Mea, Crony, Crosscall, Cube, CUBOT, CVTE, Cyrus, Daewoo, Danew, Datang, Datawind, Datsun, Dbtel, Dell, Denver, Desay, DeWalt, DEXP, Dialog, Dicam, Digi, Digicel, Digihome, Digiland, Digma, Diva, Divisat, DMM, DNS, DoCoMo, Doffler, Dolamee, Doogee, Doopro, Doov, Dopod, Doro, Droxio, Dune HD, E-Boda, E-Ceros, E-tel, Easypix, EBEST, Echo Mobiles, ECS, EE, EKO, Eks Mobility, ELARI, Element, Elenberg, Elephone, Eltex, Energizer, Energy Sistem, Enot, Epik One, Ergo, Ericsson, Ericy, Essential, Essentielb, eSTAR, Eton, eTouch, Etuline, Eurostar, Evercoss, Evertek, Evolio, Evolveo, EvroMedia, ExMobile, EXO, Explay, Extrem, Ezio, Ezze, Fairphone, Famoco, FarEasTone, Fengxiang, Fero, FiGO, FinePower, Finlux, FireFly Mobile, Fly, FNB, Fondi, Fonos, FORME, Forstar, Fortis, Foxconn, Freetel, Fujitsu, G-TiDE, Garmin-Asus, Gateway, Gemini, General Mobile, GEOFOX, Geotel, Ghia, Ghong, Gigabyte, Gigaset, Ginzzu, Gionee, Globex, GOCLEVER, Goly, Gome, GoMobile, Google, Goophone, Gradiente, Grape, Gree, Grundig, Hafury, Haier, HannSpree, Hardkernel, Hasee, Helio, Hezire, Hi-Level, Highscreen, Hipstreet, Hisense, Hitachi, Hoffmann, Hometech, Homtom, Hoozo, Hosin, Hotel, Hotwav, How, HP, HTC, Huadoo, Huawei, Humax, Hurricane, Hyrican, Hyundai, i-Cherry, i-Joy, i-mate, i-mobile, iBall, iBerry, iBrit, IconBIT, iDroid, iGet, iHunt, Ikea, iKoMo, iLA, iLife, iMars, IMO Mobile, Impression, Inco, iNew, Infinix, InFocus, Inkti, InnJoo, Innostream, Inoi, INQ, Insignia, Intek, Intex, Inverto, Invin, iOcean, iPro, IQM, Irbis, Iris, iRola, iRulu, iSWAG, iTel, iTruck, iVA, iView, iVooMi, iZotron, JAY-Tech, JFone, Jiayu, Jinga, JKL, Jolla, Just5, JVC, K-Touch, Kaan, Kaiomy, Kalley, Kanji, Karbonn, KATV1, Kazam, KDDI, Kempler & Strauss, Keneksi, Kenxinda, Kiano, Kingsun, Kivi, Klipad, Kocaso, Kodak, Kogan, Komu, Konka, Konrow, Koobee, Koolnee, Kooper, KOPO, Koridy, KRONO, Krüger&Matz, KT-Tech, Kuliao, Kult, Kumai, Kyocera, Kzen, LAIQ, Land Rover, Landvo, Lanix, Lark, Lava, LCT, Le Pan, Leagoo, Ledstar, LeEco, Leff, Lemhoov, Lenco, Lenovo, Leotec, Lephone, Lesia, Lexand, Lexibook, LG, Lingwin, Linsar, Loewe, Logic, Logicom, Lumigon, Lumus, Luna, Luxor, LYF, M.T.T., M4tel, Macoox, Majestic, Mann, Manta Multimedia, Masstel, Matrix, Maxcom, Maxtron, MAXVI, Maxwest, Maze, meanIT, Mecer, Mecool, Mediacom, MediaTek, Medion, MEEG, MegaFon, Meitu, Meizu, Melrose, Memup, Metz, MEU, MicroMax, Microsoft, Minix, Mintt, Mio, Miray, Mito, Mitsubishi, MIXC, MiXzo, MLLED, MLS, Mobicel, Mobiistar, Mobiola, Mobistel, MobiWire, Mobo, Modecom, Mofut, Motorola, Movic, Mpman, MSI, MTC, MTN, Multilaser, MYFON, MyPhone, Myria, Mystery, MyTab, MyWigo, National, Navitech, Navon, NEC, Neffos, Neomi, Netgear, NeuImage, Newgen, Newland, Newman, NewsMy, NEXBOX, Nexian, NEXON, Nextbit, NextBook, NextTab, NG Optics, NGM, Nikon, Nintendo, NOA, Noain, Nobby, Noblex, Nokia, Nomi, Nomu, Nordmende, NorthTech, Nos, Nous, NuAns, NUU Mobile, Nuvo, Nvidia, NYX Mobile, O+, O2, Oale, Obi, Odys, Okapia, Onda, OnePlus, Onix, ONN, OpelMobile, Openbox, OPPO, Opsson, Orange, Orbic, Ordissimo, Ouki, Oukitel, OUYA, Overmax, Ovvi, öwn, Owwo, Oysters, Oyyu, OzoneHD, P-UP, Palm, Panacom, Panasonic, Pantech, PCBOX, PCD, PCD Argentina, PEAQ, Pentagram, Phicomm, Philco, Philips, Phonemax, phoneOne, Pioneer, Pixelphone, Pixus, Planet Computers, Ployer, Plum, PocketBook, POCO, Point of View, Polaroid, PolyPad, Polytron, Pomp, Poppox, Positivo, Positivo BGH, PPTV, Premio, Prestigio, Primepad, Primux, Prixton, Proline, ProScan, Protruly, PULID, Q-Touch, Q.Bell, Qilive, QMobile, Qtek, Quantum, Quechua, Qumo, R-TV, Ramos, Ravoz, Razer, RCA Tablets, Reach, Readboy, Realme, RED, Reeder, Rikomagic, RIM, Rinno, Ritmix, Ritzviva, Riviera, Roadrover, Rokit, Roku, Rombica, Ross&Moor, Rover, RoverPad, RT Project, RugGear, Runbo, Ryte, Safaricom, Sagem, Salora, Samsung, Sanei, Sansui, Santin, Sanyo, Savio, Schneider, Sega, Selenga, Selevision, Selfix, SEMP TCL, Sencor, Sendo, Senkatel, Senseit, Senwa, SFR, Sharp, Shift Phones, Shtrikh-M, Shuttle, Sico, Siemens, Sigma, Silelis, Silent Circle, Simbans, Siragon, Sky, Skyworth, Smadl, Smailo, Smart, SMARTEC, Smartfren, Smartisan, Softbank, Solone, Sonim, Sony, Sony Ericsson, Soundmax, Soyes, SPC, Spectrum, Spice, SQOOL, Star, Starlight, Starmobile, Starway, STF Mobile, STK, Stonex, Storex, Sugar, Sumvision, Sunstech, SunVan, Sunvell, SuperSonic, Supra, Swipe, SWISSMOBILITY, Swisstone, Symphony, Syrox, T-Mobile, Takara, Tanix, TB Touch, TCL, TD Systems, TechniSat, TechnoTrend, TechPad, Techwood, Teclast, Tecno Mobile, Tele2, Telefunken, Telego, Telenor, Telit, Tesco, Tesla, Tetratab, teXet, ThL, Thomson, Thuraya, TIANYU, Time2, Timovi, Tinai, Tinmo, TiPhone, Tolino, Tone, Tooky, Top House, Toplux, Torex, Toshiba, Touchmate, Transpeed, TrekStor, Trevi, Trifone, Tronsmart, True, TTEC, Tunisie Telecom, Turbo, Turbo-X, TurboKids, TVC, TWM, Twoe, Tymes, U.S. Cellular, Ugoos, Uhans, Uhappy, Ulefone, Umax, UMIDIGI, Unihertz, Unimax, Uniscope, UNIWA, Unknown, Unnecto, Unonu, Unowhy, UTOK, UTStarcom, VAIO, Vastking, Venso, Verico, Verizon, Vernee, Vertex, Vertu, Verykool, Vesta, Vestel, VGO TEL, Videocon, Videoweb, ViewSonic, Vinga, Vinsoc, Vipro, Vitelcom, Viumee, Vivax, Vivo, Vizio, VK Mobile, VKworld, Vodacom, Vodafone, Vonino, Vontar, Vorago, Vorke, Voto, Voxtel, Voyo, Vsmart, Vsun, Vulcan, VVETIME, Walton, Web TV, Weimei, WellcoM, Westpoint, Wexler, Wieppo, Wigor, Wiko, Wileyfox, Winds, Wink, Winmax, Wiseasy, Wizz, Wolder, Wolfgang, Wonu, Woo, Wortmann, Woxter, X-BO, X-TIGI, X-View, X.Vision, Xgody, Xiaolajiao, Xiaomi, Xion, Xolo, Xoro, Xshitou, Xtouch, Yandex, Yarvik, Yes, 
</details>

##### Support detect browsers list (289):

<details>
<summary>Show details</summary>

* 115 Browser, 2345 Browser, 360 Browser, 360 Phone Browser, 7Star, ABrowse, Aloha Browser, Aloha Browser Lite, Amaya, Amiga Aweb, Amiga Voyager, Amigo, Android Browser, ANT Fresco, ANTGalio, AOL Desktop, AOL Shield, Arctic Fox, Arora, Atom, Atomic Web Browser, Avant Browser, Avast Secure Browser, AVG Secure Browser, B-Line, Baidu Browser, Baidu Spark, Basilisk, Beaker Browser, Beamrise, Beonex, BlackBerry Browser, BlackHawk, Blue Browser, Borealis Navigator, Brave, BriskBard, BrowseX, Browzar, Bunjalloo, Camino, CCleaner, Centaury, Charon, Cheetah Browser, Cheshire, Chim Lac, Chrome, Chrome Frame, Chrome Mobile, Chrome Mobile iOS, Chrome Webview, ChromePlus, Chromium, CM Browser, Coast, Coc Coc, Colibri, CometBird, Comodo Dragon, Conkeror, CoolNovo, COS Browser, Crazy Browser, Crusta, Cunaguaro, Cyberfox, dbrowser, Deepnet Explorer, Delta Browser, Dillo, Dolphin, Dooble, Dorado, DuckDuckGo Privacy Browser, Ecosia, Element Browser, Elements Browser, Elinks, Epic, Espial TV Browser, EUI Browser, eZ Browser, Falkon, Faux Browser, Fennec, Firebird, Firefox, Firefox Focus, Firefox Mobile, Firefox Mobile iOS, Firefox Reality, Firefox Rocket, Fireweb, Fireweb Navigator, Flock, Fluid, FreeU, Galeon, Ghostery Privacy Browser, Glass Browser, GNOME Web, GOG Galaxy, Google Earth, Hawk Turbo Browser, Headless Chrome, hola! Browser, HotJava, Huawei Browser, IBrowse, iCab, iCab Mobile, IceCat, IceDragon, Iceweasel, IE Mobile, Internet Explorer, Iridium, Iron, Iron Mobile, Isivioo, Japan Browser, Jasmine, Jig Browser, Jig Browser Plus, Jio Browser, K-meleon, K.Browser, Kapiko, Kazehakase, Kindle Browser, Kinza, Kiwi, Kode Browser, Konqueror, Kylo, LG Browser, LieBaoFast, Light, Links, Lovense Browser, LuaKit, Lulumi, Lunascape, Lunascape Lite, Lynx, MAUI WAP Browser, Maxthon, mCent, Meizu Browser, Mercury, MicroB, Microsoft Edge, Midori, Minimo, Mint Browser, MIUI Browser, Mobicip, Mobile Safari, Mobile Silk, Monument Browser, MxNitro, Mypal, Navigateur Web, NCSA Mosaic, NetFront, NetFront Life, NetPositive, Netscape, NetSurf, NFS Browser, Nokia Browser, Nokia OSS Browser, Nokia Ovi Browser, Nox Browser, NTENT Browser, Obigo, Oculus Browser, Odin, Odyssey Web Browser, Off By One, OhHai Browser, OmniWeb, ONE Browser, Openwave Mobile Browser, Opera, Opera Devices, Opera GX, Opera Mini, Opera Mini iOS, Opera Mobile, Opera Neon, Opera Next, Opera Touch, Oppo Browser, Ordissimo, Oregano, Origin In-Game Overlay, Origyn Web Browser, Otter Browser, Pale Moon, Palm Blazer, Palm Pre, Palm WebPro, Palmscape, Phoenix, Phoenix Browser, PlayFree Browser, Polaris, Polarity, Polypane, PrivacyWall, Puffin, QQ Browser, QQ Browser Mini, QtWebEngine, Quark, QupZilla, Qutebrowser, Qwant Mobile, Realme Browser, Rekonq, RockMelt, Safari, Safe Exam Browser, Sailfish Browser, SalamWeb, Samsung Browser, Seewo Browser, SEMC-Browser, Seraphic Sraf, Seznam Browser, SFive, Shiira, SimpleBrowser, Sizzy, Skyfire, Sleipnir, Slimjet, Smart Lenovo Browser, Snowshoe, Sogou Explorer, Sogou Mobile Browser, Splash, Sputnik Browser, Stargon, START Internet Browser, Steam In-Game Overlay, Streamy, Sunrise, Super Fast Browser, SuperBird, surf, Swiftfox, T-Browser, t-online.de Browser, Tao Browser, TenFourFox, Tenta Browser, Tizen Browser, ToGate, Tungsten, TV Bro, TweakStyle, UBrowser, UC Browser, UC Browser Mini, UC Browser Turbo, UR Browser, Uzbl, Vision Mobile Browser, Vivaldi, vivo Browser, VMware AirWatch, Waterfox, Wear Internet Browser, Web Explorer, WebPositive, WeTab Browser, Whale Browser, wOSBrowser, Xiino, Xvast, Yaani Browser, Yahoo! Japan Browser, Yandex Browser, Yandex Browser Lite, Yolo Browser, Zvu

</details>

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

* v1.2.5
    * Update fixtures from the motamo-org/devicedetect package#3.12.6 (update to 2020/07/13)
* v1.2.4
    * Update fixtures from the motamo-org/devicedetect package#3.12.5 (update to 2020/06/09)
* v1.2.3
    * Update fixtures from the motamo-org/devicedetect package#3.12.5 (update to 2020/05/07)

* OLD VERSIONS [CHANGELOG.MD](CHANGELOG.MD)
    
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

### Parse commercial model (model raw name)
```js
const AliasDevice = require('node-device-detector/parser/device/alias-device');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const aliasDevice = new AliasDevice;
const result = aliasDevice.parse(userAgent);
console.log('Result parse commercial model', result);  // result {name: "NX505J"}
```

Others
-
* [Micro service detect device](MICROSERVICE.MD) from framework [moleculer js](http://moleculer.services)
* [Example1 detect device in native server](NATIVE_SERVER.MD)

##### Support detect brands list (656):

<details>
<summary>Show details</summary>

3Q, 4Good, Ace, Acer, Advan, Advance, AGM, Ainol, Airness, Airties, AIS, Aiwa, Akai, Alba, Alcatel, Aligator, AllCall, AllDocube, Allview, Allwinner, Altech UEC, altron, Amazon, AMGOO, Amoi, ANS, Apple, Archos, Arian Space, Ark, ArmPhone, Arnova, ARRIS, Ask,
Assistant, Asus, Atom, Audiovox, AVH, Avvio, Axxion, Azumi Mobile, BangOlufsen, Barnes & Noble, BBK, BDF, Becker, Beeline, Beetel, BenQ, BenQ-Siemens, Bezkam, BGH, Bird, Bitel, Bitmore, Black Fox, Blackview, Blaupunkt, Blu, Bluboo, Bluegood, Bmobile, bogo, Bowa
y, bq, Bravis, Brondi, Bush, CAGI, Capitel, Captiva, Carrefour, Casio, Casper, Cat, Celkon, Changhong, Cherry Mobile, China Mobile, Chuwi, Clarmin, Clout, CnM, Coby Kyros, Comio, Compal, Compaq, ComTrade Tesla, Concord, ConCorde, Condor, Contixo, Coolpad, Cowon
, CreNova, Crescent, Cricket, Crius Mea, Crosscall, Cube, CUBOT, CVTE, Cyrus, Daewoo, Danew, Datang, Datawind, Datsun, Dbtel, Dell, Denver, Desay, DeWalt, DEXP, Dialog, Dicam, Digi, Digicel, Digiland, Digma, Divisat, DMM, DNS, DoCoMo, Doogee, Doov, Dopod, Doro,
 Droxio, Dune HD, E-Boda, E-Ceros, E-tel, Easypix, EBEST, Echo Mobiles, ECS, EE, EKO, Eks Mobility, Element, Elenberg, Elephone, Energizer, Energy Sistem, Ergo, Ericsson, Ericy, Essential, Essentielb, Eton, eTouch, Etuline, Eurostar, Evercoss, Evertek, Evolio,
Evolveo, EvroMedia, Explay, Extrem, Ezio, Ezze, Fairphone, Famoco, Fengxiang, FiGO, FinePower, Fly, FNB, Fondi, FORME, Forstar, Foxconn, Freetel, Fujitsu, G-TiDE, Garmin-Asus, Gateway, Gemini, General Mobile, Geotel, Ghia, Ghong, Gigabyte, Gigaset, Ginzzu, Gion
ee, Globex, GOCLEVER, Goly, Gome, GoMobile, Google, Goophone, Gradiente, Grape, Gree, Grundig, Hafury, Haier, HannSpree, Hasee, Hi-Level, Highscreen, Hisense, Hoffmann, Homtom, Hoozo, Hosin, How, HP, HTC, Huadoo, Huawei, Humax, Hyrican, Hyundai, i-Joy, i-mate,
i-mobile, iBall, iBerry, IconBIT, iGet, iHunt, Ikea, iKoMo, iLA, IMO Mobile, Impression, iNew, Infinix, InFocus, Inkti, InnJoo, Innostream, Inoi, INQ, Insignia, Intek, Intex, Inverto, iOcean, iPro, Irbis, iRola, iRulu, iTel, iVA, iView, iZotron, JAY-Tech, JFone
, Jiayu, JKL, Jolla, Just5, K-Touch, Kaan, Kaiomy, Kalley, Kanji, Karbonn, KATV1, Kazam, KDDI, Kempler & Strauss, Keneksi, Kiano, Kingsun, Kivi, Kocaso, Kodak, Kogan, Komu, Konka, Konrow, Koobee, KOPO, Koridy, KRONO, Krüger&Matz, KT-Tech, Kuliao, Kumai, Kyocera
, LAIQ, Land Rover, Landvo, Lanix, Lark, Lava, LCT, Le Pan, Leagoo, Ledstar, LeEco, Lemhoov, Lenco, Lenovo, Leotec, Lephone, Lexand, Lexibook, LG, Lingwin, Loewe, Logicom, Lumus, Luna, LYF, M.T.T., M4tel, Macoox, Majestic, Mann, Manta Multimedia, Masstel, Maxco
m, Maxtron, Maxwest, Maze, Mecer, Mecool, Mediacom, MediaTek, Medion, MEEG, MegaFon, Meitu, Meizu, Memup, Metz, MEU, MicroMax, Microsoft, Mio, Miray, Mito, Mitsubishi, MIXC, MLLED, MLS, Mobicel, Mobiistar, Mobiola, Mobistel, Mobo, Modecom, Mofut, Motorola, Movi
c, Mpman, MSI, MTC, MTN, Multilaser, MYFON, MyPhone, Myria, Mystery, MyWigo, National, Navon, NEC, Neffos, Netgear, NeuImage, Newgen, Newland, Newman, NewsMy, NEXBOX, Nexian, NEXON, Nextbit, NextBook, NG Optics, NGM, Nikon, Nintendo, NOA, Noain, Nobby, Noblex,
Nokia, Nomi, Nous, NUU Mobile, Nuvo, Nvidia, NYX Mobile, O+, O2, Obi, Odys, Onda, OnePlus, Onix, ONN, OPPO, Opsson, Orange, Orbic, Ordissimo, Ouki, Oukitel, OUYA, Overmax, öwn, Oysters, Palm, Panacom, Panasonic, Pantech, PCBOX, PCD, PCD Argentina, PEAQ, Pentagr
am, Phicomm, Philco, Philips, phoneOne, Pioneer, Pixus, Ployer, Plum, PocketBook, POCO, Point of View, Polaroid, PolyPad, Polytron, Pomp, Positivo, Positivo BGH, PPTV, Prestigio, Primepad, Prixton, Proline, ProScan, Protruly, PULID, Q-Touch, Q.Bell, Qilive, QMo
bile, Qtek, Quantum, Quechua, Qumo, R-TV, Ramos, Razer, RCA Tablets, Readboy, Realme, RED, Rikomagic, RIM, Rinno, Ritmix, Ritzviva, Riviera, Roadrover, Rokit, Roku, Rombica, Ross&Moor, Rover, RoverPad, RT Project, RugGear, Runbo, Ryte, Safaricom, Sagem, Samsung
, Sanei, Santin, Sanyo, Savio, Sega, Selevision, Selfix, SEMP TCL, Sencor, Sendo, Senseit, Senwa, SFR, Sharp, Shift Phones, Shuttle, Siemens, Sigma, Silent Circle, Simbans, Sky, Skyworth, Smart, Smartfren, Smartisan, Softbank, Sonim, Sony, Sony Ericsson, Soyes,
 Spectrum, Spice, Star, Starway, STF Mobile, STK, Stonex, Storex, Sugar, Sumvision, SunVan, Sunvell, SuperSonic, Supra, Swipe, SWISSMOBILITY, Symphony, Syrox, T-Mobile, TB Touch, TCL, TechniSat, TechnoTrend, TechPad, Teclast, Tecno Mobile, Telefunken, Telego, T
elenor, Telit, Tesco, Tesla, teXet, ThL, Thomson, TIANYU, Timovi, TiPhone, Tolino, Tooky, Top House, Toplux, Toshiba, Touchmate, TrekStor, Trevi, True, Tunisie Telecom, Turbo, Turbo-X, TVC, TWM, U.S. Cellular, Ugoos, Uhans, Uhappy, Ulefone, Umax, UMIDIGI, Unihe
rtz, Unimax, Uniscope, Unknown, Unnecto, Unonu, Unowhy, UTOK, UTStarcom, Vastking, Venso, Verizon, Vernee, Vertex, Vertu, Verykool, Vesta, Vestel, VGO TEL, Videocon, Videoweb, ViewSonic, Vinga, Vinsoc, Vitelcom, Vivax, Vivo, Vizio, VK Mobile, VKworld, Vodacom,
Vodafone, Vonino, Vontar, Vorago, Vorke, Voto, Voxtel, Voyo, Vsun, Vulcan, Walton, Web TV, Weimei, WellcoM, Wexler, Wieppo, Wigor, Wiko, Wileyfox, Wink, Wolder, Wolfgang, Wonu, Woo, Woxter, X-TIGI, X-View, Xiaolajiao, Xiaomi, Xion, Xolo, Xoro, Xshitou, Yandex,
Yarvik, Yes, Yezz, Yota, Ytone, Yu, Yuandao, Yusun, Yxtel, Zeemi, Zen, Zenek, Zfiner, Zidoo, Zonda, Zopo, ZTE, Zuum, Zync, ZYQ

</details>

##### Support detect browsers list (261):

<details>
<summary>Show details</summary>

115 Browser, 2345 Browser, 360 Browser, 360 Phone Browser, ABrowse, Aloha Browser, Aloha Browser Lite, Amaya, Amiga Aweb, Amiga Voyager, Amigo, Android Browser, ANT Fresco, ANTGalio, AOL Desktop, AOL Shield, Arctic Fox, Arora, Atom, Atomic Web Browser, Avant
Browser, Avast Secure Browser, AVG Secure Browser, B-Line, Baidu Browser, Baidu Spark, Basilisk, Beaker Browser, Beamrise, Beonex, BlackBerry Browser, BlackHawk, Brave, BriskBard, BrowseX, Bunjalloo, Camino, CCleaner, Centaury, Charon, Cheetah Browser, Cheshire
, Chrome, Chrome Frame, Chrome Mobile, Chrome Mobile iOS, Chrome Webview, ChromePlus, Chromium, CM Browser, Coast, Coc Coc, Colibri, CometBird, Comodo Dragon, Conkeror, CoolNovo, COS Browser, Crusta, Cunaguaro, Cyberfox, dbrowser, Deepnet Explorer, Delta Browse
r, Dillo, Dolphin, Dooble, Dorado, DuckDuckGo Privacy Browser, Ecosia, Element Browser, Elements Browser, Elinks, Epic, Espial TV Browser, EUI Browser, eZ Browser, Falkon, Faux Browser, Fennec, Firebird, Firefox, Firefox Focus, Firefox Mobile, Firefox Mobile iO
S, Firefox Reality, Firefox Rocket, Fireweb, Fireweb Navigator, Flock, Fluid, FreeU, Galeon, Glass Browser, GNOME Web, Google Earth, Hawk Turbo Browser, Headless Chrome, hola! Browser, HotJava, Huawei Browser, IBrowse, iCab, iCab Mobile, IceCat, IceDragon, Icew
easel, IE Mobile, Internet Explorer, Iridium, Iron, Iron Mobile, Isivioo, Jasmine, Jig Browser, Jig Browser Plus, Jio Browser, K-meleon, K.Browser, Kapiko, Kazehakase, Kindle Browser, Kinza, Kiwi, Konqueror, Kylo, LG Browser, LieBaoFast, Light, Links, Lovense B
rowser, LuaKit, Lulumi, Lunascape, Lunascape Lite, Lynx, Maxthon, mCent, Meizu Browser, Mercury, MicroB, Microsoft Edge, Midori, Minimo, Mint Browser, MIUI Browser, Mobicip, Mobile Safari, Mobile Silk, Mypal, NCSA Mosaic, NetFront, NetFront Life, NetPositive, N
etscape, NetSurf, Nokia Browser, Nokia OSS Browser, Nokia Ovi Browser, Nox Browser, NTENT Browser, Obigo, Oculus Browser, Odyssey Web Browser, Off By One, OhHai Browser, OmniWeb, ONE Browser, Openwave Mobile Browser, Opera, Opera Devices, Opera GX, Opera Mini,
Opera Mini iOS, Opera Mobile, Opera Neon, Opera Next, Opera Touch, Oppo Browser, Ordissimo, Oregano, Origin In-Game Overlay, Origyn Web Browser, Otter Browser, Pale Moon, Palm Blazer, Palm Pre, Palm WebPro, Palmscape, Phoenix, Polaris, Polarity, Polypane, Puffi
n, QQ Browser, QQ Browser Mini, QtWebEngine, Quark, QupZilla, Qutebrowser, Qwant Mobile, Realme Browser, Rekonq, RockMelt, Safari, Safe Exam Browser, Sailfish Browser, SalamWeb, Samsung Browser, SEMC-Browser, Seraphic Sraf, Seznam Browser, Shiira, SimpleBrowser
, Sizzy, Skyfire, Sleipnir, Snowshoe, Sogou Explorer, Sogou Mobile Browser, Splash, Sputnik Browser, START Internet Browser, Steam In-Game Overlay, Streamy, Sunrise, Super Fast Browser, SuperBird, surf, Swiftfox, t-online.de Browser, Tao Browser, TenFourFox, Te
nta Browser, Tizen Browser, ToGate, Tungsten, TV Bro, TweakStyle, UBrowser, UC Browser, UC Browser Mini, UC Browser Turbo, Uzbl, Vision Mobile Browser, Vivaldi, vivo Browser, VMware AirWatch, Waterfox, Wear Internet Browser, Web Explorer, WebPositive, WeTab Bro
wser, Whale Browser, wOSBrowser, Xiino, Xvast, Yahoo! Japan Browser, Yandex Browser, Yandex Browser Lite, Zvu

</details>

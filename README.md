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

Others
-
* [Micro service](MICROSERVICE.MD)  from framework [moleculer js](http://moleculer.services)

##### Support detect brands list (618):

<details>
<summary>Show details</summary>

3Q, 4Good, Ace, Acer, Advan, Advance, AGM, Ainol, Airness, Airties, AIS, Aiwa, Akai, Alba, Alcatel, Aligator, AllCall, AllDocube, Allview, Allwinner, Altech UEC, altron, Amazon, AMGOO, Amoi, ANS, Apple, Archos, Arian Space, Ark, ArmPhone, Arnova, ARRIS, Ask, As
sistant, Asus, Atom, Audiovox, AVH, Avvio, Axxion, Azumi Mobile, BangOlufsen, Barnes & Noble, BBK, BDF, Becker, Beeline, Beetel, BenQ, BenQ-Siemens, Bezkam, BGH, Bird, Bitel, Black Fox, Blackview, Blaupunkt, Blu, Bluboo, Bluegood, Bmobile, bogo, Boway, bq, Brav
is, Brondi, Bush, CAGI, Capitel, Captiva, Carrefour, Casio, Casper, Cat, Celkon, Changhong, Cherry Mobile, China Mobile, Chuwi, Clarmin, CnM, Coby Kyros, Comio, Compal, Compaq, ComTrade Tesla, Concord, ConCorde, Condor, Coolpad, Cowon, CreNova, Crescent, Cricke
t, Crius Mea, Crosscall, Cube, CUBOT, CVTE, Cyrus, Daewoo, Danew, Datang, Datsun, Dbtel, Dell, Denver, Desay, DeWalt, DEXP, Dialog, Dicam, Digi, Digicel, Digiland, Digma, Divisat, DMM, DNS, DoCoMo, Doogee, Doov, Dopod, Doro, Dune HD, E-Boda, E-tel, Easypix, EBE
ST, Echo Mobiles, ECS, EE, EKO, Eks Mobility, Element, Elenberg, Elephone, Energizer, Energy Sistem, Ergo, Ericsson, Ericy, Essential, Essentielb, Eton, eTouch, Etuline, Eurostar, Evercoss, Evertek, Evolio, Evolveo, EvroMedia, Explay, Extrem, Ezio, Ezze, Fairph
one, Famoco, Fengxiang, FiGO, FinePower, Fly, FNB, Fondi, FORME, Forstar, Foxconn, Freetel, Fujitsu, G-TiDE, Garmin-Asus, Gateway, Gemini, General Mobile, Geotel, Ghia, Ghong, Gigabyte, Gigaset, Ginzzu, Gionee, Globex, GOCLEVER, Goly, Gome, GoMobile, Google, Gr
adiente, Grape, Grundig, Hafury, Haier, HannSpree, Hasee, Hi-Level, Highscreen, Hisense, Hoffmann, Homtom, Hoozo, Hosin, HP, HTC, Huadoo, Huawei, Humax, Hyrican, Hyundai, i-Joy, i-mate, i-mobile, iBall, iBerry, IconBIT, iGet, iHunt, Ikea, iKoMo, iLA, IMO Mobile
, Impression, iNew, Infinix, InFocus, Inkti, InnJoo, Innostream, Inoi, INQ, Insignia, Intek, Intex, Inverto, iOcean, iPro, Irbis, iRola, iRulu, iTel, iVA, iView, iZotron, JAY-Tech, JFone, Jiayu, Jolla, Just5, K-Touch, Kaan, Kaiomy, Kalley, Kanji, Karbonn, KATV1
, Kazam, KDDI, Kempler & Strauss, Keneksi, Kiano, Kingsun, Kivi, Kocaso, Kodak, Kogan, Komu, Konka, Konrow, Koobee, KOPO, Koridy, KRONO, Krüger&Matz, KT-Tech, Kumai, Kyocera, LAIQ, Land Rover, Landvo, Lanix, Lark, Lava, LCT, Le Pan, Leagoo, Ledstar, LeEco, Lemh
oov, Lenco, Lenovo, Leotec, Lephone, Lexand, Lexibook, LG, Lingwin, Loewe, Logicom, Lumus, Luna, LYF, M.T.T., M4tel, Majestic, Mann, Manta Multimedia, Masstel, Maxcom, Maxwest, Maze, Mecer, Mecool, Mediacom, MediaTek, Medion, MEEG, MegaFon, Meitu, Meizu, Memup,
 Metz, MEU, MicroMax, Microsoft, Mio, Miray, Mitsubishi, MIXC, MLLED, Mobicel, Mobiistar, Mobiola, Mobistel, Modecom, Mofut, Motorola, Movic, Mpman, MSI, MTC, MTN, MYFON, MyPhone, Myria, Mystery, MyWigo, National, Navon, NEC, Neffos, Netgear, NeuImage, Newgen,
NewsMy, NEXBOX, Nexian, Nextbit, NextBook, NG Optics, NGM, Nikon, Nintendo, NOA, Noain, Nobby, Noblex, Nokia, Nomi, Nous, NUU Mobile, Nuvo, Nvidia, NYX Mobile, O+, O2, Obi, Odys, Onda, OnePlus, OPPO, Opsson, Orange, Ordissimo, Ouki, Oukitel, OUYA, Overmax, öwn,
 Oysters, Palm, Panacom, Panasonic, Pantech, PCBOX, PCD, PCD Argentina, PEAQ, Pentagram, Phicomm, Philips, phoneOne, Pioneer, Pixus, Ployer, Plum, Point of View, Polaroid, PolyPad, Polytron, Pomp, Positivo, PPTV, Prestigio, Primepad, Proline, ProScan, Protruly,
 PULID, Q-Touch, Qilive, QMobile, Qtek, Quantum, Quechua, Qumo, R-TV, Ramos, Razer, RCA Tablets, Readboy, Rikomagic, RIM, Rinno, Ritmix, Ritzviva, Riviera, Roadrover, Rokit, Roku, Rombica, Ross&Moor, Rover, RoverPad, RT Project, RugGear, Runbo, Ryte, Safaricom,
 Sagem, Samsung, Sanei, Santin, Sanyo, Savio, Sega, Selevision, Selfix, Sencor, Sendo, Senseit, Senwa, SFR, Sharp, Shift Phones, Shuttle, Siemens, Sigma, Silent Circle, Simbans, Sky, Skyworth, Smart, Smartfren, Smartisan, Softbank, Sonim, Sony, Sony Ericsson, S
oyes, Spectrum, Spice, Star, Starway, STF Mobile, STK, Stonex, Storex, Sumvision, SunVan, Sunvell, SuperSonic, Supra, SWISSMOBILITY, Symphony, Syrox, T-Mobile, TB Touch, TCL, TechniSat, TechnoTrend, TechPad, Teclast, Tecno Mobile, Telefunken, Telego, Telenor, T
elit, Tesco, Tesla, teXet, ThL, Thomson, TIANYU, Timovi, TiPhone, Tolino, Tooky, Top House, Toplux, Toshiba, Touchmate, TrekStor, Trevi, True, Tunisie Telecom, Turbo, Turbo-X, TVC, U.S. Cellular, Ugoos, Uhans, Uhappy, Ulefone, Umax, UMIDIGI, Unihertz, Unimax, U
niscope, Unknown, Unnecto, Unonu, Unowhy, UTOK, UTStarcom, Vastking, Venso, Verizon, Vernee, Vertex, Vertu, Verykool, Vesta, Vestel, VGO TEL, Videocon, Videoweb, ViewSonic, Vinga, Vinsoc, Vitelcom, Vivax, Vivo, Vizio, VK Mobile, Vodafone, Vonino, Vontar, Vorago
, Vorke, Voto, Voxtel, Voyo, Vsun, Vulcan, Walton, Web TV, Weimei, WellcoM, Wexler, Wieppo, Wigor, Wiko, Wileyfox, Wink, Wolder, Wolfgang, Wonu, Woo, Woxter, X-TIGI, X-View, Xiaolajiao, Xiaomi, Xion, Xolo, Xoro, Yandex, Yarvik, Yes, Yezz, Yota, Ytone, Yu, Yuand
ao, Yusun, Yxtel, Zeemi, Zen, Zenek, Zfiner, Zidoo, Zonda, Zopo, ZTE, Zuum, Zync, ZYQ
</details>

##### Support detect browsers list (259):

<details>
<summary>Show details</summary>

115 Browser, 2345 Browser, 360 Browser, 360 Phone Browser, ABrowse, Aloha Browser, Aloha Browser Lite, Amaya, Amiga Aweb, Amiga Voyager, Amigo, Android Browser, ANT Fresco, ANTGalio, AOL Desktop, AOL Shield, Arctic Fox, Arora, Atom, Atomic Web Browser, Avant Br
owser, Avast Secure Browser, AVG Secure Browser, B-Line, Baidu Browser, Baidu Spark, Basilisk, Beaker Browser, Beamrise, Beonex, BlackBerry Browser, BlackHawk, Brave, BriskBard, BrowseX, Bunjalloo, Camino, CCleaner, Centaury, Charon, Cheetah Browser, Cheshire,
Chrome, Chrome Frame, Chrome Mobile, Chrome Mobile iOS, Chrome Webview, ChromePlus, Chromium, CM Browser, Coast, Coc Coc, Colibri, CometBird, Comodo Dragon, Conkeror, CoolNovo, COS Browser, Crusta, Cunaguaro, Cyberfox, dbrowser, Deepnet Explorer, Delta Browser,
 Dillo, Dolphin, Dooble, Dorado, DuckDuckGo Privacy Browser, Ecosia, Element Browser, Elements Browser, Elinks, Epic, Espial TV Browser, EUI Browser, eZ Browser, Falkon, Faux Browser, Fennec, Firebird, Firefox, Firefox Focus, Firefox Mobile, Firefox Mobile iOS,
 Firefox Reality, Firefox Rocket, Fireweb, Fireweb Navigator, Flock, Fluid, FreeU, Galeon, Glass Browser, GNOME Web, Google Earth, Hawk Turbo Browser, Headless Chrome, hola! Browser, HotJava, Huawei Browser, IBrowse, iCab, iCab Mobile, IceCat, IceDragon, Icewea
sel, IE Mobile, Internet Explorer, Iridium, Iron, Iron Mobile, Isivioo, Jasmine, Jig Browser, Jig Browser Plus, Jio Browser, K-meleon, K.Browser, Kapiko, Kazehakase, Kindle Browser, Kinza, Kiwi, Konqueror, Kylo, LG Browser, LieBaoFast, Light, Links, Lovense Bro
wser, LuaKit, Lulumi, Lunascape, Lunascape Lite, Lynx, Maxthon, mCent, Meizu Browser, Mercury, MicroB, Microsoft Edge, Midori, Minimo, Mint Browser, MIUI Browser, Mobicip, Mobile Safari, Mobile Silk, Mypal, NCSA Mosaic, NetFront, NetFront Life, NetPositive, Net
scape, NetSurf, Nokia Browser, Nokia OSS Browser, Nokia Ovi Browser, Nox Browser, NTENT Browser, Obigo, Oculus Browser, Odyssey Web Browser, Off By One, OhHai Browser, OmniWeb, ONE Browser, Openwave Mobile Browser, Opera, Opera Devices, Opera GX, Opera Mini, Op
era Mini iOS, Opera Mobile, Opera Neon, Opera Next, Opera Touch, Oppo Browser, Ordissimo, Oregano, Origin In-Game Overlay, Origyn Web Browser, Otter Browser, Pale Moon, Palm Blazer, Palm Pre, Palm WebPro, Palmscape, Phoenix, Polaris, Polarity, Polypane, Puffin,
 QQ Browser, QQ Browser Mini, QtWebEngine, QupZilla, Qutebrowser, Qwant Mobile, Realme Browser, Rekonq, RockMelt, Safari, Safe Exam Browser, Sailfish Browser, SalamWeb, Samsung Browser, SEMC-Browser, Seraphic Sraf, Seznam Browser, Shiira, SimpleBrowser, Sizzy,
Skyfire, Sleipnir, Snowshoe, Sogou Explorer, Sogou Mobile Browser, Splash, Sputnik Browser, START Internet Browser, Steam In-Game Overlay, Streamy, Sunrise, Super Fast Browser, SuperBird, surf, Swiftfox, t-online.de Browser, Tao Browser, TenFourFox, Tenta Brows
er, Tizen Browser, ToGate, Tungsten, TV Bro, TweakStyle, UBrowser, UC Browser, UC Browser Mini, UC Browser Turbo, Uzbl, Vision Mobile Browser, Vivaldi, vivo Browser, VMware AirWatch, Waterfox, Wear Internet Browser, Web Explorer, WebPositive, WeTab Browser, Wha
le Browser, wOSBrowser, Xiino, Xvast, Yahoo! Japan Browser, Yandex Browser, Yandex Browser Lite
<details>



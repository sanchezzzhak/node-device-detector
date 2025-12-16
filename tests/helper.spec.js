const detector = new (require('../index'))();
const DeviceHelper = require('../helper');
const ParserHelper = require('../parser/helper');
const { should, assert, expect } = require('chai');

/*

 */

const fixtures = [
  {
    ua: 'Mozilla/5.0 (Linux; Android 5.0.2; DMC-CM1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36',
    checks: {
      isCamera: true,
      isCar: false,
      isConsole: false,
      isDesktop: false,
      isFeaturePhone: false,
      isMobile: false,
      isPeripheral: false,
      isPhablet: false,
      isPortableMediaPlayer: false,
      isSmartDisplay: false,
      isSmartSpeaker: false,
      isSmartphone: false,
      isTablet: false,
      isTv: false,
      isWearable: false,
      isAndroid: true,
      isIOS: false,
    },
  },
  {
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/605.1 NAVER(inapp; search; 700; 10.20.0; 11PROMAX)',
    checks: {
      isCamera: false,
      isCar: false,
      isConsole: false,
      isDesktop: false,
      isFeaturePhone: false,
      isMobile: true,
      isPeripheral: false,
      isPhablet: true,
      isPortableMediaPlayer: false,
      isSmartDisplay: false,
      isSmartSpeaker: false,
      isSmartphone: false,
      isTablet: false,
      isTv: false,
      isWearable: false,
      isAndroid: false,
      isIOS: true,
      isBrowser: false,
      isApp: true,
      isDesktopApp: false,
      isMobileApp: true,
    },
  },
  {
    ua: 'Mozilla/5.0 (Linux; Android 4.2.2; RCT6077W2 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Safari/537.36',
    checks: {
      isCamera: false,
      isCar: false,
      isConsole: false,
      isDesktop: false,
      isFeaturePhone: false,
      isMobile: false,
      isPeripheral: false,
      isPhablet: false,
      isPortableMediaPlayer: false,
      isSmartDisplay: false,
      isSmartSpeaker: false,
      isSmartphone: false,
      isTablet: true,
      isTv: false,
      isWearable: false,
      isAndroid: true,
      isIOS: false,
      isBrowser: true,
      isApp: false,
      isDesktopApp: false,
      isMobileApp: false,
    },
  },
  {
    ua: 'Fly_DS123/Q03C_MAUI_Browser/MIDP2.0 Configuration/CLDC-1.1',
    checks: {
      isCamera: false,
      isCar: false,
      isConsole: false,
      isDesktop: false,
      isFeaturePhone: true,
      isMobile: true,
      isPeripheral: false,
      isPhablet: false,
      isPortableMediaPlayer: false,
      isSmartDisplay: false,
      isSmartSpeaker: false,
      isSmartphone: false,
      isTablet: false,
      isTv: false,
      isWearable: false,
      isAndroid: false,
      isIOS: false,
      isBrowser: false,
      isApp: false,
      isDesktopApp: false,
      isMobileApp: false,
    },
  },
  {
    ua: 'Mozilla/5.0 Linux; Android 7.1.1; LG Watch Urbane Build/NWD1.180306.004 AppleWebKit/537.36 KHTML, like Gecko Chrome/19.77.34.5 Mobile Safari/537.36',
    checks: {
      isCamera: false,
      isCar: false,
      isConsole: false,
      isDesktop: false,
      isFeaturePhone: false,
      isMobile: false,
      isPeripheral: false,
      isPhablet: false,
      isPortableMediaPlayer: false,
      isSmartDisplay: false,
      isSmartSpeaker: false,
      isSmartphone: false,
      isTablet: false,
      isTv: false,
      isWearable: true,
      isAndroid: true,
      isIOS: false,
      isBrowser: true,
      isApp: false,
      isDesktopApp: false,
      isMobileApp: false,
    },
  },
];

describe('test helpers', function () {
  fixtures.forEach((fixture, i) => {
    describe(`fixture ${i}`, () => {
      let result = detector.detect(fixture.ua);
      for (let key in fixture.checks) {
        it('test ' + key, () => {
          expect(
            DeviceHelper[key](result),
            `fixture ${i} method ${key} for UA ${fixture.ua}`
          ).to.equal(fixture.checks[key]);
        });
      }
    });
  });
});

describe('hasUserAgentClientHintsFragment', () => {
  const userAgents = [
    {
      check: false,
      useragent:
        'Mozilla/5.0 (Linux; Android 9; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.180 Mobile Safari/537.36 Telegram-Android/12.2.10 (Zte ZTE Blade A3 2020RU; Android 9; SDK 28; LOW)',
    },
    {
      check: false,
      useragent:
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.171 Mobile Safari/537.36 Telegram-Android/12.2.7 (Itel itel W5006X; Android 10; SDK 29; LOW)',
    },
    {
      check: true,
      useragent:
        'Mozilla/5.0 (Linux; Android 16; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.171 Mobile Safari/537.36',
    },
    {
      check: true,
      useragent: 'Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0  Mobile Safari/537.36'
    },
    {
      check: true,
      useragent: 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.0.0 Mobile DuckDuckGo/5 Safari/537.36'
    },
    {
      check: false,
      useragent:
        'Mozilla/5.0 (Linux; Android 15; K) Telegram-Android/12.2.10 (Tecno TECNO CL6; Android 15; SDK 35; AVERAGE)',
    },
    {
      check: true,
      useragent:
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
    },

    {
      check: true,
      useragent:
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36 AlohaBrowser/5.10.4',
    },
    {
      check: true,
      useragent:
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.227.6834 Safari/537.36  SberBrowser/3.4.0.1123',
    },
    {
      check: true,
      useragent:
        'Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7232.2 Mobile Safari/537.36 YaApp_Android/22.116.1 YaSearchBrowser/9.20',
    },
    {
      check: true,
      useragent:
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like G -ecko) Chrome/142.0.0.0 Safari/537.36 EdgA/142.0.0.0',
    },
    {
      check: true,
      useragent:
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.118 Mobile Safari/537.36 XiaoMi/MiuiBrowser/14.33.0-gn',
    },

  ];
  userAgents.forEach((item, index) => {
    const { useragent, check } = item;
    it('test ' + index + ' ' + (check ? 'positive': 'negative'), () => {
      const result = ParserHelper.hasUserAgentClientHintsFragment(useragent);
      expect(result).to.equal(check, `wrong result for useragent: ${useragent}`);
    });
  });
});

describe('test splitUserAgent', function () {
  const userAgents = [
    {
      useragent:
        'Mozilla/5.0 (Linux; Android 11; moto tab g70 LTE Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/102.0.5005.125 Safari/537.36 GoogleApp/13.22.15.26.arm64',
      hash: '79a29cd8',
      path: 'mozilla.applewebkit.version.chrome.safari.googleapp',
    },
    {
      useragent:
        'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:11.0) Gecko/20100101 Firefox/11.0 CometBird/11.0',
      hash: '76bff86f',
      path: 'mozilla.gecko.firefox.cometbird',
    },
  ];

  userAgents.forEach((item, index) => {
    it('test ' + index, () => {
      let data = ParserHelper.splitUserAgent(item.useragent);
      expect(
        data.hash + ' ' + data.path,
        'data: ' + JSON.stringify(data, null, 2)
      ).to.equal(item.hash + ' ' + item.path);
    });
  });
});

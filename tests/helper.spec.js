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


describe('test splitUserAgent', function () {
  const userAgents = [
    {
      useragent: 'Mozilla/5.0 (Linux; Android 11; moto tab g70 LTE Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/102.0.5005.125 Safari/537.36 GoogleApp/13.22.15.26.arm64',
      hash: '79a29cd8',
      path: 'mozilla.applewebkit.version.chrome.safari.googleapp'
    }, {
      useragent: 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:11.0) Gecko/20100101 Firefox/11.0 CometBird/11.0',
      hash: '76bff86f',
      path: 'mozilla.gecko.firefox.cometbird'
    }
  ];

  userAgents.forEach((item, index) => {
    it('test ' + index, () => {
      let data = ParserHelper.splitUserAgent(item.useragent);
      expect(data.hash + ' ' + data.path, 'data: ' + JSON.stringify(data, null, 2))
      .to
      .equal(item.hash + ' ' + item.path);
    })
  });
})

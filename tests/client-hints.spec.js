const {should, assert, expect} = require('chai');

const fixtureData = [{
  headers: {
    'sec-ch-ua': 'Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'Windows',
    'sec-ch-ua-platform-version': '14.0.0',
  },
  result: {
    client: {
      name: "Google Chrome",
      version: "97"
    }
  }
}, {
  headers: {
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Microsoft Edge";v="96"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'Windows',
    'sec-ch-ua-platform-version': '14.0.0',
  },
  result: {
    client: {
      name: "Microsoft Edge",
      version: "96"
    }
  }
}, {
  headers: {
    'sec-ch-ua': '"Opera";v="81", " Not;A Brand";v="99", "Chromium";v="95"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'Windows',
    'sec-ch-ua-platform-version': '14.0.0',
  },
  result: {
    client: {
      name: "Opera",
      version: "81"
    }
  }
}, {
  headers: {
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'Windows',
    'sec-ch-ua-platform-version': '10.0.0',
  },
  result: {
    client: {
      name: "Google Chrome",
      version: "98"
    }
  }
}
];

const ClientHints = require('../parser/client-hints');
const clientHint = new ClientHints;

describe('tests client-hints', function () {
  let total = fixtureData.length;
  //
  fixtureData.forEach((fixture, pos) => {
    it(pos + '/' + total, function () {
      let result = clientHint.parse(fixture.headers)
      expect(result.client).to.deep.equal(fixture.result.client);
    })
  });
})
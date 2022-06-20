const fs = require('fs');
const {YAMLLoad, YAMLDump, getFixtureFolder} = require('./../functions');

let fixtureFolder = getFixtureFolder();
let browserFixture = fixtureFolder + 'clients/browser.yml';
let browserFixtureData = YAMLLoad(browserFixture);


let fixtureIndex = {};


browserFixtureData.forEach((fixture) => {
  console.log(regex.exec(fixture.user_agent))
});


// console.log(browserFixtureData)



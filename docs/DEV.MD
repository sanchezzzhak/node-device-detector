This is an instruction procedure for updating the package from data matomo/device-detector

1) download `node tests/tools/update-fixtures.js`
2) prepare yml to js `node tests/tools/generate-regexes-commonjs.js`
3) create browser indexes `node tests/tools/generate-client-indexes.js`
4) create device indexes `node tests/tools/generate-device-indexes.js`
5) run tests, is error test view js parser code and manual fix (after fix need step 3,4 again run )

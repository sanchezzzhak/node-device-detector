// #!/bin/bash
// #
// #   Add package.json files to cjs/mjs subtrees
// #
//
// cat >dist/cjs/package.json <<!EOF
// {
//     "type": "commonjs"
// }
// !EOF
//
// cat >dist/mjs/package.json <<!EOF
// {
//     "type": "module"
// }
// !EOF
//
// find src -name '*.d.ts' -exec cp {} dist/mjs \;
// find src -name '*.d.ts' -exec cp {} dist/cjs \;

const fs = require('node:fs');
fs.writeFileSync(__dirname + '/dist/cjs/package.json', `{"type": "commonjs"}`);
fs.writeFileSync(__dirname + '/dist/mjs/package.json', `{"type": "module"}`);
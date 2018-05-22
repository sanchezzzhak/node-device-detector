const detector = new (require('../index'));

// var user_agents =  [
//     "Mozilla/5.0 (Linux; U; Android 4.1.2; zh-CN; Amaze 4G Build/JZO54K) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 UCBrowser/9.5.0.360 U3/0.8.0 Mobile Safari/533.1"
// ];
//
// for(var i= 0, l = user_agents.length; i < l; i++){
//    console.dir());
// }
//
//
// const should = require('chai').should;
// const assert = require('chai').assert;
// const expect = require('chai').expect;
// const async = require('async');
//
const fs = require('fs');
const YML = require('yamljs');

let ymlFiles = [];
let fixtureFolder = __dirname + '/fixtures/tests';



describe('tests from fixtures', function () {
    
    fs.readdir(fixtureFolder, (err, files) => {
        files.forEach(file => {
            console.log(file);
            ymlFiles.push(file);
        });
    });


    before(function(done){

        console.log(ymlFiles);
        done();
    });

    for(let i, l = ymlFiles.length; i < l; i++){

    }

    // describe('file ' + ymlFiles[i], function(){
    //     let fixtureData = YML.load(fixtureFolder + file);
    //
    // });
    // it('1', () => {})




});


//
// $clientInfo = $dd->getClient(); // holds information about browser, feed reader, media player, ...
// $osInfo = $dd->getOs();
// $device = $dd->getDevice();
// $brand = $dd->getBrandName();
// $model = $dd->getModel();
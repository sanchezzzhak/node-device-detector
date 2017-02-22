module.exports = DeviceDetector;
module.exports.DeviceDetector = DeviceDetector;

const YAML = require('yamljs');


function getBaseRegExp(str) {
    str = str.replace(new RegExp('/', 'g'), '\\/');
    str = '(?:^|[^A-Z0-9\-_]|[^A-Z0-9\-]_|sprd-)(?:' + str + ')';
    return new RegExp(str, 'i');
}

function DeviceDetector(options) {

    this.base_path = __dirname + '/regexes';
    this.browser_collection = [];
    this.os_collection = [];
    this.brand_collection = [];

	this.init();
}
DeviceDetector.prototype.init = function(){
    this.loadBrowserCollection();
    this.loadOsCollection();
    this.loadBrandCollection();
};

DeviceDetector.prototype.loadBrowserCollection = function(){
    console.log('DeviceDetector load client/browser.yml');
    var path= this.base_path + '/client/browsers.yml';
    this.browser_collection  = YAML.load(path);
};

DeviceDetector.prototype.loadOsCollection = function(){
    console.log('DeviceDetector load oss.yml');
    var path= this.base_path + '/oss.yml';
    this.os_collection  = YAML.load(path);
};

DeviceDetector.prototype.loadBrandCollection = function(){
    console.log('DeviceDetector load device/mobiles.yml');
    var path= this.base_path + '/device/mobiles.yml';
    this.brand_collection  = YAML.load(path);
};


DeviceDetector.prototype.buildModel = function (model, matches)
{
    model = this.buildByMatch(model, matches).replace('_' , ' ').replace('/ TD$/i', '');
    return (model === 'Build') ? null : model;
};

DeviceDetector.prototype.buildByMatch = function(item, matches)
{
    for (var nb=1;nb<=3;nb++) {
        if (item.indexOf('$' + nb) == -1) {
            continue;
        }
        var replace =(matches[nb] !== undefined) ? matches[nb] : '';
        item = item.replace('$' + nb,replace);
    }
    return item;
};


DeviceDetector.prototype.findBrand = function(user_agent){
    for(var key in this.brand_collection){
        var regex = getBaseRegExp(this.brand_collection[key]['regex']), match;
        if(match = regex.exec(user_agent)){
            var model = null;
            for(var i= 0, l = this.brand_collection[key]['models'].length; i < l; i++){
                var data = this.brand_collection[key]['models'][i];
                var model_preg = getBaseRegExp(data.regex), model_match;
                if(model_match = model_preg.exec(user_agent)){
                    model = this.buildModel(data.model,model_match);
                    break;
                }
            }
            return {
                name : key,
                model : model,
                device: this.brand_collection[key].device
            };
        }
    }
    return [];
};

DeviceDetector.prototype.findBrowser = function(user_agent){
    for(var i= 0,l = this.browser_collection.length; i < l; i++){
        var regex = getBaseRegExp(this.browser_collection[i].regex);
        var match;
        if(match = regex.exec(user_agent)) {
            var browser = this.browser_collection[i].name;
            return {
                name: browser
            }
        }
    }
    return [];
};

DeviceDetector.prototype.findOs = function(user_agent){
    for(var i= 0,l = this.os_collection.length; i < l; i++){
        var regex = getBaseRegExp(this.os_collection[i].regex);
        var match;
        if(match = regex.exec(user_agent)) {
            var os = this.os_collection[i].name;
            return {
                name: os
            }
        }
    }
    return [];
};

DeviceDetector.prototype.detect = function(user_agent){
    var browser_data = this.findBrowser(user_agent);
    var os_data = this.findOs(user_agent);
    var brand_data = this.findBrand(user_agent);

    return {
        brand: brand_data,
        os : os_data,
        browser: browser_data
    }

};





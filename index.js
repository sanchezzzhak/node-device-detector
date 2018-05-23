module.exports = DeviceDetector;
module.exports.DeviceDetector = DeviceDetector;

const YAML = require('yamljs');
//const XRegExp = require('xregexp')

function getBaseRegExp(str) {
    str = str.replace(new RegExp('/', 'g'), '\\/');
    str = str.replace(new RegExp('\\+\\+', 'g'), '+');
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

DeviceDetector.prototype.init = function () {
    this.loadBrowserCollection();
    this.loadOsCollection();
    this.loadBrandCollection();
};

DeviceDetector.prototype.loadBrowserCollection = function () {
    console.log('DeviceDetector load client/browser.yml');
    let path = this.base_path + '/client/browsers.yml';
    this.browser_collection = YAML.load(path);
};

DeviceDetector.prototype.loadOsCollection = function () {
    console.log('DeviceDetector load oss.yml');
    let path = this.base_path + '/oss.yml';
    this.os_collection = YAML.load(path);
};

DeviceDetector.prototype.loadBrandCollection = function () {
    console.log('DeviceDetector load device/mobiles.yml');
    let path = this.base_path + '/device/mobiles.yml';
    this.brand_collection = YAML.load(path);
};


DeviceDetector.prototype.buildModel = function (model, matches) {
    model = this.buildByMatch(model, matches).replace('_', ' ').replace('/ TD$/i', '');
    return (model === 'Build') ? null : model;
};

DeviceDetector.prototype.buildByMatch = function (item, matches) {
    for (let nb = 1; nb <= 3; nb++) {
        if (item.indexOf('$' + nb) == -1) {
            continue;
        }
        let replace = (matches[nb] !== undefined) ? matches[nb] : '';
        item = item.replace('$' + nb, replace);
    }
    return item;
};


DeviceDetector.prototype.findBrand = function (user_agent) {
    for (let key in this.brand_collection) {

        let regex;
        let match;
        try {
            regex = getBaseRegExp(this.brand_collection[key]['regex']);
            match = regex.exec(user_agent)
        }catch (e){
            return [];
        }
        if (match) {
            let model = null;
            for (let i = 0, l = this.brand_collection[key]['models'].length; i < l; i++) {
                let data = this.brand_collection[key]['models'][i];
                let model_preg = getBaseRegExp(data.regex), model_match;
                if (model_match = model_preg.exec(user_agent)) {
                    model = this.buildModel(data.model, model_match);
                    break;
                }
            }
            return {
                name: key,
                model: model,
                device: this.brand_collection[key].device
            };
        }
    }
    return {};
};

DeviceDetector.prototype.findBrowser = function (user_agent) {
    for (let i = 0, l = this.browser_collection.length; i < l; i++) {
        let regex = getBaseRegExp(this.browser_collection[i].regex);
        let match;
        if (match = regex.exec(user_agent)) {
            let browser = this.browser_collection[i].name;
            return {
                name: browser
            }
        }
    }
    return [];
};

DeviceDetector.prototype.findOs = function (user_agent) {
    for (let i = 0, l = this.os_collection.length; i < l; i++) {
        let regex = getBaseRegExp(this.os_collection[i].regex);
        let match;
        if (match = regex.exec(user_agent)) {
            let os = this.os_collection[i].name;
            return {
                name: os
            }
        }
    }
    return [];
};

DeviceDetector.prototype.detect = function (user_agent) {
    let browser_data = this.findBrowser(user_agent);
    let os_data = this.findOs(user_agent);
    let brand_data = this.findBrand(user_agent);

    return {
        brand: brand_data,
        os: os_data,
        browser: browser_data
    }

};





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

DeviceDetector.prototype.fixStringName = function (result) {
    return result.replace(new RegExp('_', 'g'), ' ').replace(/ TD$/i, '');
};

DeviceDetector.prototype.buildModel = function (model, matches) {
    model = this.fixStringName(this.buildByMatch(model, matches));
    return (model === 'Build') ? null : model;
};

DeviceDetector.prototype.buildByMatch = function (item, matches) {
    for (let nb = 1; nb <= 3; nb++) {
        if (item.indexOf('$' + nb) === -1) {
            continue;
        }
        let replace = (matches[nb] !== undefined) ? matches[nb] : '';
        item = item.replace('$' + nb, replace);
    }
    return item;
};


DeviceDetector.prototype.findDevice = function (userAgent) {


    for (let brand in this.brand_collection) {
        
        let match = getBaseRegExp(this.brand_collection[brand]['regex']).exec(userAgent);
        let deviceType = this.brand_collection[brand]['device'];
        let model = '';

        if (match) {
            if(this.brand_collection[brand]['models']!==undefined){
                let models = this.brand_collection[brand]['models'];
                for (let i = 0, l = models.length; i < l; i++) {
                    let data = models[i];
                    let modelMatch = getBaseRegExp(data.regex).exec(userAgent);
                    if (modelMatch) {
                        model = this.buildModel(data.model, modelMatch);
                        if (data.device !== undefined) {
                            deviceType = data.device;
                        }
                        break;
                    }
                }
            }else if(this.brand_collection[brand]['model']!==undefined){
                model = this.buildModel(this.brand_collection[brand]['model'], match);
            }
            return {
                brand: String(brand).trim(),
                model: String(model).trim(),
                type: deviceType
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
            let version =  this.browser_collection[i].version;
            version =  version.length > 0 ? this.buildByMatch(version, match) : '';
            return {
                name: browser,
                version: version
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
            let name = this.os_collection[i].name;
            let version =  this.os_collection[i].version;
            version =  version.length > 0 ? this.buildByMatch(version, match) : '';
            return {
                name: name,
                version: version
            }
        }
    }
    return {};
};

DeviceDetector.prototype.detect = function (user_agent) {
    let browserData = this.findBrowser(user_agent);
    let osData = this.findOs(user_agent);
    let deviceData = this.findDevice(user_agent);

    return {
        device: {
            brand: deviceData.brand,
            model: deviceData.model,
            type: deviceData.type,
        },
        os: osData,
        browser: browserData
    }

};





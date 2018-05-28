module.exports = DeviceDetector;
module.exports.DeviceDetector = DeviceDetector;

const YAML = require('yamljs');

const BASE_REGEXES_DIR  = __dirname + '/regexes';

function getBaseRegExp(str) {
    str = str.replace(new RegExp('/', 'g'), '\\/');
    str = str.replace(new RegExp('\\+\\+', 'g'), '+');
    str = '(?:^|[^A-Z0-9\-_]|[^A-Z0-9\-]_|sprd-)(?:' + str + ')';
    return new RegExp(str, 'i');
}

function DeviceDetector(options) {

    this.browser_collection = [];
    this.app_collection = [];
    this.os_collection = [];
    this.device_collection = [];

    this.init();
}

DeviceDetector.prototype.init = function () {
    this.loadAppCollection();
    this.loadBrowserCollection();
    this.loadOsCollection();
    this.loadBrandCollection();
};

DeviceDetector.prototype.loadAppCollection = function () {
    console.log('DeviceDetector load client/mobile_apps.yml');
    let path = BASE_REGEXES_DIR + '/client/mobile_apps.yml';
    this.app_collection = YAML.load(path);


};

DeviceDetector.prototype.loadBrowserCollection = function () {
    console.log('DeviceDetector load client/browser.yml');
    let path = BASE_REGEXES_DIR + '/client/browsers.yml';
    this.browser_collection = YAML.load(path);
};

DeviceDetector.prototype.loadOsCollection = function () {
    console.log('DeviceDetector load oss.yml');
    let path = BASE_REGEXES_DIR + '/oss.yml';
    this.os_collection = YAML.load(path);
};

DeviceDetector.prototype.loadBrandCollection = function () {
    console.log('DeviceDetector load device/mobiles.yml');
    let path = BASE_REGEXES_DIR + '/device/mobiles.yml';
    this.device_collection = YAML.load(path);
};

DeviceDetector.prototype.fixStringName = function (result) {
    return result.replace(new RegExp('_', 'g'), ' ').replace(/ TD$/i, '');
};
DeviceDetector.prototype.fixStringVersion = function (result) {
    return result.replace(new RegExp('_', 'g'), '.').trim();
};

DeviceDetector.prototype.buildVersion = function (version, matches) {
    return this.fixStringVersion(this.buildByMatch(version, matches));
};

DeviceDetector.prototype.buildModel = function (model, matches) {
    model = this.fixStringName(this.buildByMatch(model, matches));
    return (model === 'Build') ? null : model;
};

DeviceDetector.prototype.buildByMatch = function (item, matches) {
    if(item.indexOf('$') !== -1){
        for (let nb = 1; nb <= 3; nb++) {
            if (item.indexOf('$' + nb) === -1) {
                continue;
            }
            let replace = (matches[nb] !== undefined) ? matches[nb] : '';
            item = item.replace('$' + nb, replace);
        }
    }
    return item;
};

DeviceDetector.prototype.findDevice = function (userAgent) {


    for (let brand in this.device_collection) {
        
        let match = getBaseRegExp(this.device_collection[brand]['regex']).exec(userAgent);
        let deviceType = this.device_collection[brand]['device'];
        let model = '';

        if (match) {
            if(this.device_collection[brand]['models']!==undefined){
                let models = this.device_collection[brand]['models'];
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
            }else if(this.device_collection[brand]['model']!==undefined){
                model = this.buildModel(this.device_collection[brand]['model'], match);
            }
            return {
                brand: String(brand).trim(),
                model: String(model).trim(),
                type: deviceType
            };
        }
    }
    return null;
};

DeviceDetector.prototype.findApp = function (userAgent) {
    for (let i = 0, l = this.app_collection.length; i < l; i++) {
        let item = this.app_collection[i];
        let regex = getBaseRegExp(item.regex);
        let match;
        if (match = regex.exec(userAgent)) {
            return {
                name: this.buildByMatch(item.name, match),
                version: this.buildVersion(item.version, match),
                type: 'mobile app'
            }
        }
    }
    return {};
};


DeviceDetector.prototype.findBrowser = function (user_agent) {
    for (let i = 0, l = this.browser_collection.length; i < l; i++) {
        let item = this.browser_collection[i];
        let regex = getBaseRegExp(item.regex);
        let match;
        if (match = regex.exec(user_agent)) {
            return {
                name: this.buildByMatch(item.name, match),
                version: this.buildVersion(item.version, match),
                type: 'browser'
            }
        }
    }
    return null;
};

DeviceDetector.prototype.findOs = function (user_agent) {
    for (let i = 0, l = this.os_collection.length; i < l; i++) {
        let item = this.os_collection[i];
        let regex = getBaseRegExp(item.regex);
        let match;
        if (match = regex.exec(user_agent)) {
            return {
                name: this.buildByMatch(item.name, match),
                version: this.buildVersion(item.version, match)
            }
        }
    }
    return null;
};

DeviceDetector.prototype.detect = function (user_agent) {
    let osData = this.findOs(user_agent);
    let clientData = this.findApp(user_agent);
    let deviceData = this.findDevice(user_agent);


    if(clientData.name === undefined){
        clientData = this.findBrowser(user_agent);
    }

    return {
        os: osData,
        client: {
            name: clientData.name,
            version: clientData.version,
            type: clientData.type
        },
        device: {
            brand: deviceData.brand,
            model: deviceData.model,
            type: deviceData.type,
        }
    }

};






const detector = new (require('../index'));

var user_agents =  [
    "Mozilla/5.0 (Linux; U; Android 4.1.2; zh-CN; Amaze 4G Build/JZO54K) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 UCBrowser/9.5.0.360 U3/0.8.0 Mobile Safari/533.1"
];

for(var i= 0, l = user_agents.length; i < l; i++){
   console.dir(detector.detect(user_agents[i]));
}



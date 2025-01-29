module.exports = [
  {
    "regex": "Dalvik/[\\d.]+ [(]Linux; U; ?Android ?(?:[\\d.]+;) ?(.+)(?: Build|MIUI)/",
    "name": "$1"
  },
  {
    "regex": "^MQQBrowser/[\\d.]+/Adr \\(Linux; U; (?:[\\d\\.]+;) ?(?:[a-z]{2}(?:-[a-z]{2})?;)(.+) Build/",
    "name": "$1"
  },
  {
    "regex": "Adr [\\d\\.]+; +(?:[a-z]{2}(?:[_-][a-z]{2})?;)\\s(.+)[)] +U2/(?:[\\d.]+) UCBrowser",
    "name": "$1"
  },
  {
    "regex": "^JUC ?\\(Linux; ?U; ?(?:[\\d.]+;) ?(?:[a-z]{2}(?:[_-][a-z]{2});) ?([^;]+); ?\\d+\\*\\d+;?\\) ?UCWEB",
    "name": "$1"
  },
  {
    "regex": "WhatsApp/.+ Device/(?:(?:[^-]+)-)?(.+)$",
    "name": "$1"
  },
  {
    "regex": "(?:like Mac.+FBDV|FBMD)/([^;]+);",
    "name": "$1"
  },
  {
    "regex": "Instagram (?:[\\d.]+) +[(]([^;]+);",
    "name": "$1"
  },
  {
    "regex": "CFNetwork/.+Darwin/.+(?:[(]x86_64[)])? +[(]([^)]+)[)]$",
    "name": "$1"
  },
  {
    "regex": "IEMobile/[0-9].+;(?:[^;]+); ?([^;]+);",
    "name": "$1"
  },
  {
    "regex": "IEMobile/[0-9].+;(?:[^;]+); ?([^)]+)[)] like",
    "name": "$1"
  },
  {
    "regex": "IEMobile/[0-9].+; ?([^)]+)[)]",
    "name": "$1"
  },
  {
    "regex": "Windows (?:Mobile|Phone) (?:[\\d\\.]+;{1,2}) Android (?:[\\d\\.]+;{1,2})(?: WebView/[0-9].0;)?(?:[^;]+); ([^;]+)\\) AppleWebKit",
    "name": "$1"
  },
  {
    "regex": "^([^/]+)[_ ](?:TD-LTE|TD)/(?:V\\d|\\d\\.0) ?(?:Linux/[\\d.]+)? Android/",
    "name": "$1"
  },
  {
    "regex": "^([^/]+)/(?:V\\d|\\d\\.0) ?(?:Linux/[\\d.]+)? Android/",
    "name": "$1"
  },
  {
    "regex": "Android.+; ([^;]+); U; .+\\).+Tenta/",
    "name": "$1"
  },
  {
    "regex": "Android +(?:[^;]+;{1,2}) ?(?:\\s*[a-z]{2}(?:[_-][a-z]{2})?;)? ?([^;]+); Android/.+Release/",
    "name": "$1"
  },
  {
    "regex": "Android +(?:[^;]+;{1,2})? ?(?:[^;]+;)? ?([^/;]+)(?:/(?:[\\d.]+) Android/|(?:/.*)?\\) Linux/| Release/.+AppleWebKit.+Build/)",
    "name": "$1"
  },
  {
    "regex": "[; ]([^;]+); HMSCore [\\d\\.]+; GMSCore [\\d\\.]+",
    "name": "$1"
  },
  {
    "regex": "Android +(?:[^;]+;{1,2}) ?(?:[^;]+;)? ?([^/;]+)(?:Release/.+Build ?/| Build ?/.+AppleWebKit|; HMSCore|; wv\\) AppleWebKit|; HPT/|/.+CTC/|; iPhone; Build/|; GMSCore)",
    "name": "$1"
  },
  {
    "regex": "Android +(?:[^;]+;{1,2}) ?(?:arm(?:_.*)?;|[a-z]{2}(?:[_-][a-z]{2})?;)? ?(.*?)(?:(?:; smart-tv)?[)] ?ShieldExperience|;? Build ?/|\\)? ?AppleWebKit|/[\\w]+\\) AppleWebKit)",
    "name": "$1"
  },
  {
    "regex": "BlackBerry; +U; +([^;]+); +(?:[a-z]{2}(?:[_-][a-z]{2})?;)?",
    "name": "$1"
  },
  {
    "regex": "Android OS.+; +([^;]+);?[)] AppleWebKit/.+UnityPlayer",
    "name": "$1"
  },
  {
    "regex": "^(.+)/(?:[\\d\\.]+).+ObigoInternetBrowser",
    "name": "$1"
  },
  {
    "regex": "InettvBrowser/(?:[\\d\\.]+).+\\(.+\\) ?(.+); CC/",
    "name": "$1"
  },
  {
    "regex": "dv\\(iPh([^)]+)\\);pr\\(UCBrowser/",
    "name": "iPhone$1"
  },
  {
    "regex": "dv\\(([^)]+)\\);pr\\(UCBrowser/",
    "name": "$1"
  },
  {
    "regex": "[\\(, ](iP(?:hone|[ao]d)|Watch)(\\d{1,2}),(\\d{1,2})[ ;\\]]",
    "name": "$1$2,$3"
  },
  {
    "regex": "(?:Non)?AppStore; Apple/(.*?)\\)",
    "name": "$1"
  },
  {
    "regex": "^com\\.ipspirates\\.ort v\\.\\d{3} \\((.*), ?Android",
    "name": "$1"
  },
  {
    "regex": "\\(Mobile; (?!LYF)([^;]+); (?:Android; )?rv:[\\d\\.]+(?:; CAEN)?\\) Gecko/[\\d\\.]+ Firefox/[\\d\\.]+ KAIOS/",
    "name": "$1"
  }
];

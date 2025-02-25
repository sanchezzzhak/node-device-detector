module.exports = [
  {
    "regex": "jpameblo;(\\d+\\.[.\\d]+)",
    "name": "Ameba",
    "version": "$1"
  },
  {
    "regex": "CSDNApp/(\\d+\\.[.\\d]+)",
    "name": "CSDN",
    "version": "$1"
  },
  {
    "regex": "binu(?:/(\\d+[.\\d]+))?",
    "name": "Moya",
    "version": ""
  },
  {
    "regex": "KPN_Veilig[ /](\\d+\\.[.\\d]+)",
    "name": "KPN Veilig",
    "version": "$1"
  },
  {
    "regex": "NAVER/(\\d+[.\\d]+) CFNetwork",
    "name": "Naver",
    "version": "$1"
  },
  {
    "regex": "NAVER\\(inapp; search; .+; (\\d+[.\\d]+);.+\\)",
    "name": "Naver",
    "version": "$1"
  },
  {
    "regex": "NAVER\\(inapp; search; .+; (\\d+[.\\d]+)\\)",
    "name": "Naver",
    "version": "$1"
  },
  {
    "regex": "NAVER\\(inapp; naverdicapp; .+; (\\d+[.\\d]+)\\)",
    "name": "NAVER Dictionary",
    "version": "$1"
  },
  {
    "regex": "Chrome/Soldier_([\\d.]+)",
    "name": "Soldier",
    "version": "$1"
  },
  {
    "regex": "AndroidDownloadManager(?:[ /]([\\d.]+))?",
    "name": "AndroidDownloadManager",
    "version": "$1"
  },
  {
    "regex": "(?:Apple)?News(?:[ /][\\d.]+)? Version(?:[ /]([\\d.]+))?",
    "name": "Apple News",
    "version": "$1"
  },
  {
    "regex": "appletv\\.client",
    "name": "Apple TV",
    "version": ""
  },
  {
    "regex": "AudienceNetworkForAndroid.+(?:FBAV)(?:[ /]([\\d.]+))?",
    "name": "Facebook Audience Network",
    "version": "$1"
  },
  {
    "regex": "(?:mLite|MessengerLite(?:ForiOS)?).*(?:FBAV)(?:[ /]([\\d.]+))?",
    "name": "Facebook Messenger Lite",
    "version": "$1"
  },
  {
    "regex": "(?:MessengerForiOS|MESSENGER|FB_IAB/Orca-Android).*(?:FBAV)(?:[ /]([\\d.]+))?",
    "name": "Facebook Messenger",
    "version": "$1"
  },
  {
    "regex": "(?:GroupsForiOS).*(?:FBAV)(?:[ /]([\\d.]+))?",
    "name": "Facebook Groups",
    "version": "$1"
  },
  {
    "regex": "FBAN/EMA.+FBAV(?:[ /]([\\d.]+))?",
    "name": "Facebook Lite",
    "version": "$1"
  },
  {
    "regex": "FBAN/FBPageAdmin.+FBAV(?:[ /]([\\d.]+))?",
    "name": "Meta Business Suite",
    "version": "$1"
  },
  {
    "regex": "(?:FBAV|com\\.facebook\\.katana|facebook-mobile/1\\.0|facebook-mobile/|Facebook/)(?:[ /]([\\d.]+))?",
    "name": "Facebook",
    "version": "$1"
  },
  {
    "regex": "(?:FBAN|FBSV|FBID|FBBV)/",
    "name": "Facebook",
    "version": ""
  },
  {
    "regex": "Instagram[ /]([\\d.]+)?",
    "name": "Instagram",
    "version": "$1"
  },
  {
    "regex": "Barcelona[ /]([\\d.]+)?",
    "name": "Threads",
    "version": "$1"
  },
  {
    "regex": "FeedR(?!eader)(?:/([\\d.]+))?",
    "name": "FeedR",
    "version": "$1"
  },
  {
    "regex": "com\\.google\\.android\\.apps\\.searchlite",
    "name": "Google Go",
    "version": ""
  },
  {
    "regex": "com\\.google\\.android\\.apps\\.photos",
    "name": "Google Photos",
    "version": ""
  },
  {
    "regex": "com\\.google\\.android\\.apps\\.magazines",
    "name": "Google Play Newsstand",
    "version": ""
  },
  {
    "regex": "com\\.google\\.GooglePlus",
    "name": "Google Plus",
    "version": ""
  },
  {
    "regex": "Google\\.DriveExtension(?:/([\\d.]+))?",
    "name": "Google Drive",
    "version": "$1"
  },
  {
    "regex": "OPA/([\\d.]+)",
    "name": "Google Assistant",
    "version": "$1"
  },
  {
    "regex": "MicroMessenger/([\\d.]+)",
    "name": "WeChat",
    "version": "$1"
  },
  {
    "regex": "WeChat/([\\d.]+)",
    "name": "WeChat",
    "version": "$1"
  },
  {
    "regex": "WeChatShareExtensionNew/([\\d.]+)",
    "name": "WeChat Share Extension",
    "version": "$1"
  },
  {
    "regex": "DingTalk/([0-9.]+)",
    "name": "DingTalk",
    "version": "$1"
  },
  {
    "regex": ".*__weibo__([0-9.]+)__",
    "name": "Sina Weibo",
    "version": "$1"
  },
  {
    "regex": "Pinterest(?: for (?:Android(?: Tablet)?|iOS))?(?:/([\\d.]+))?",
    "name": "Pinterest",
    "version": "$1"
  },
  {
    "regex": "Podcatcher Deluxe",
    "name": "Podcatcher Deluxe",
    "version": ""
  },
  {
    "regex": "com\\.google\\.android\\.youtube(?:/([\\d.]+))?",
    "name": "YouTube",
    "version": "$1"
  },
  {
    "regex": "YouTube/([\\d.]+)[JK]",
    "name": "YouTube",
    "version": "$1"
  },
  {
    "regex": "Rutube(?:TV)?BlackAndroid",
    "name": "Rutube",
    "version": "$1"
  },
  {
    "regex": "com\\.netflix\\.mediaclient(?:/(\\d+\\.[\\d.]+))?",
    "name": "Netflix",
    "version": "$1"
  },
  {
    "regex": "Downcast/(\\d+\\.[\\d.]+)?(?:.+(?:!Mac)|$)",
    "name": "Downcast",
    "version": "$1"
  },
  {
    "regex": "Flipp-iOS/.+CFNetwork",
    "name": "Flipp",
    "version": ""
  },
  {
    "regex": "Flipp-iOS/(\\d+[.\\d]+)",
    "name": "Flipp",
    "version": "$1"
  },
  {
    "regex": "WhatsApp(?:/2)?$",
    "name": "Signal",
    "version": ""
  },
  {
    "regex": "WhatsApp/([\\d.]+).+CloudAPI",
    "name": "WhatsApp Business",
    "version": "$1"
  },
  {
    "regex": "WhatsApp(?:Electron|\\-app|\\-linux-app)?(?:[ /]([\\d.]+))?",
    "name": "WhatsApp",
    "version": "$1"
  },
  {
    "regex": "YoWhatsApp2Plus(?:/(\\d+[.\\d]+))?",
    "name": "WhatsApp+2",
    "version": "$1"
  },
  {
    "regex": "YoFMWhatsApp(?:/(\\d+[.\\d]+))?",
    "name": "FM WhatsApp",
    "version": "$1"
  },
  {
    "regex": "(?:Yo)?GBWhatsApp(?:/(\\d+[.\\d]+))?",
    "name": "GBWhatsApp",
    "version": "$1"
  },
  {
    "regex": "YoYoWhatsApp(?:/(\\d+[.\\d]+))?",
    "name": "Yo WhatsApp",
    "version": "$1"
  },
  {
    "regex": "ANWhatsApp(?:/(\\d+[.\\d]+))?",
    "name": "AN WhatsApp",
    "version": "$1"
  },
  {
    "regex": "Telegram/(\\d+[.\\d]+) CFNetwork",
    "name": "Telegram",
    "version": ""
  },
  {
    "regex": "(?:^com\\.google\\.android\\.apps\\.youtube\\.music/|^YouTubeMusic(?:Dev)?/)([\\d.]+)?",
    "name": "Youtube Music",
    "version": "$1"
  },
  {
    "regex": "Line(?:[ /]([\\d.]+))",
    "name": "Line",
    "version": "$1"
  },
  {
    "regex": "Instacast(?:HD)?/([\\d\\.abc]+) CFNetwork/([\\d.]+) Darwin/([\\d.]+)",
    "name": "Instacast",
    "version": "$1"
  },
  {
    "regex": "Pocket Casts(?:, (?:Android|iOS) v([\\d.]+))?",
    "name": "Pocket Casts",
    "version": "$1"
  },
  {
    "regex": "Podcat/([\\d.]+)",
    "name": "Podcat",
    "version": "$1"
  },
  {
    "regex": "BeyondPod",
    "name": "BeyondPod",
    "version": ""
  },
  {
    "regex": "(?:^Overcast/([\\d.]+)|^Overcast.*Apple Watch)",
    "name": "Overcast",
    "version": "$1"
  },
  {
    "regex": "(?:CastBox|fm\\.castbox\\.audiobook\\.radio\\.podcast)/?([\\d.]+)?",
    "name": "CastBox",
    "version": "$1"
  },
  {
    "regex": "Podkicker( (?:Pro|Classic))?/([\\d.]+)",
    "name": "Podkicker$1",
    "version": "$2"
  },
  {
    "regex": "PodcastRepublic/([\\d.]+)",
    "name": "Podcast Republic",
    "version": "$1"
  },
  {
    "regex": "Castro/(\\d+)",
    "name": "Castro",
    "version": "$1"
  },
  {
    "regex": "Castro 2 ([\\d.]+)/[\\d]+ Like iTunes",
    "name": "Castro 2",
    "version": "$1"
  },
  {
    "regex": "Castro 2",
    "name": "Castro 2",
    "version": ""
  },
  {
    "regex": "DoggCatcher",
    "name": "DoggCatcher",
    "version": ""
  },
  {
    "regex": "(?:PodcastAddict/v([\\d]+)|^Podcast Addict)",
    "name": "Podcast & Radio Addict",
    "version": "$1"
  },
  {
    "regex": "Podcat(?:%202)?/([\\d]+) CFNetwork",
    "name": "Podcat",
    "version": "$1"
  },
  {
    "regex": "iCatcher[^\\d]+([\\d.]+)",
    "name": "iCatcher",
    "version": "$1"
  },
  {
    "regex": "YelpApp/([\\d.]+)",
    "name": "Yelp Mobile",
    "version": "$1"
  },
  {
    "regex": "jp\\.co\\.yahoo\\.(?:android\\.yjtop|ipn\\.appli)/([\\d.]+)",
    "name": "Yahoo! Japan",
    "version": "$1"
  },
  {
    "regex": "RSSRadio/([\\d]+)?",
    "name": "RSSRadio",
    "version": "$1"
  },
  {
    "regex": "SogouSearch Android[\\d.]+ version([\\d.]+)?",
    "name": "SogouSearch App",
    "version": "$1"
  },
  {
    "regex": "NewsArticle/([\\d.]+)?",
    "name": "NewsArticle App",
    "version": "$1"
  },
  {
    "regex": "tieba/([\\d.]+)?",
    "name": "tieba",
    "version": "$1"
  },
  {
    "regex": "com\\.douban\\.group/([\\d.]+)?",
    "name": "douban App",
    "version": "$1"
  },
  {
    "regex": "(?:com\\.google\\.GoogleMobile|GSA|GoogleApp)/([\\d.]+)?",
    "name": "Google Search App",
    "version": "$1"
  },
  {
    "regex": "Google/(\\d+[.\\d]+)? CFNetwork",
    "name": "Google Search App",
    "version": "$1"
  },
  {
    "regex": "(?:Google|SearchWith)Lens/(\\d+[.\\d]+)?",
    "name": "Google Lens",
    "version": "$1"
  },
  {
    "regex": "Flipboard/([\\d.]+)?",
    "name": "Flipboard App",
    "version": "$1"
  },
  {
    "regex": "baiduboxapp/([\\d.]+)?",
    "name": "Baidu Box App",
    "version": "$1"
  },
  {
    "regex": "baiduinput/([\\d.]+)?",
    "name": "Baidu Input",
    "version": "$1"
  },
  {
    "regex": "PetalSearch/([\\d.]+)?",
    "name": "Petal Search",
    "version": "$1"
  },
  {
    "regex": "Crosswalk(?!.*(?:Streamy|QwantMobile))/([\\d.]+)?",
    "name": "CrosswalkApp",
    "version": "$1"
  },
  {
    "regex": "Twitter for iPhone[/]?([\\d.]+)?",
    "name": "Twitter",
    "version": "$1"
  },
  {
    "regex": "Twitter/([\\d.]+)",
    "name": "Twitter",
    "version": "$1"
  },
  {
    "regex": "TwitterAndroid[/]?([\\d.]+)?",
    "name": "Twitter",
    "version": "$1"
  },
  {
    "regex": "^Pocket Casts",
    "name": "Pocket Casts",
    "version": ""
  },
  {
    "regex": "(?:^GaanaAndroid-|^Gaana-iOS|^Gaana/)([\\d.]+)?",
    "name": "Gaana",
    "version": "$1"
  },
  {
    "regex": "TopBuzz/([\\d.]+)",
    "name": "TopBuzz",
    "version": "$1"
  },
  {
    "regex": "(?:Safari/[\\d.]+)?Snapchat/?([\\d.]+)",
    "name": "Snapchat",
    "version": "$1"
  },
  {
    "regex": "CronetSnapDevSheldon",
    "name": "Snapchat",
    "version": ""
  },
  {
    "regex": "AhaRadio2/([\\d.]+)",
    "name": "Aha Radio 2",
    "version": "$1"
  },
  {
    "regex": "Unibox/([\\d.]+)",
    "name": "Unibox",
    "version": ""
  },
  {
    "regex": "strimio(?:-desktop)/(\\d+\\.(?:[.\\d]+))?",
    "name": "Strimio",
    "version": "$1"
  },
  {
    "regex": "UnityPlayer/([\\d.]+)",
    "name": "UnityPlayer",
    "version": "$1"
  },
  {
    "regex": "UCURSOS/v([\\d.]+)",
    "name": "U-Cursos",
    "version": "$1"
  },
  {
    "regex": "HeyTapBrowser/([\\d.]+)",
    "name": "HeyTapBrowser",
    "version": "$1"
  },
  {
    "regex": "RobloxApp/([\\d.]+)",
    "name": "Roblox",
    "version": "$1"
  },
  {
    "regex": "Viber(?:/(\\d+[.\\d]+))?",
    "name": "Viber",
    "version": "$1"
  },
  {
    "regex": "Siri/1",
    "name": "Siri",
    "version": "1.0"
  },
  {
    "regex": "LinkedIn(?:App)?(?:\\]?/([\\d.]+))?",
    "name": "LinkedIn",
    "version": "$1"
  },
  {
    "regex": "Instapaper/([\\d.]+)",
    "name": "Instapaper",
    "version": "$1"
  },
  {
    "regex": "Keeper/([\\d.]+)",
    "name": "Keeper Password Manager",
    "version": "$1"
  },
  {
    "regex": "Skyeng Teachers/([\\d.]+)",
    "name": "Skyeng Teachers",
    "version": "$1"
  },
  {
    "regex": "Kik/([\\d.]+) \\(Android",
    "name": "Kik",
    "version": "$1"
  },
  {
    "regex": "Procast/?([\\d.]+)?",
    "name": "Procast",
    "version": "$1"
  },
  {
    "regex": "DeviantArt/([\\d.]+)",
    "name": "DeviantArt",
    "version": ""
  },
  {
    "regex": "discord/([\\d.]+).+Electron",
    "name": "Discord",
    "version": "$1"
  },
  {
    "regex": "discord(?:-Updater)?/([\\d.]+)",
    "name": "Discord",
    "version": ""
  },
  {
    "regex": "Covenant%20Eyes/([\\d.]+)",
    "name": "Covenant Eyes",
    "version": "$1"
  },
  {
    "regex": "HP%20Smart/([\\d.]+)",
    "name": "HP Smart",
    "version": ""
  },
  {
    "regex": "Bitsboard/([\\d.]+)",
    "name": "Bitsboard",
    "version": "$1"
  },
  {
    "regex": "Betbull/([\\d.]+)",
    "name": "BetBull",
    "version": ""
  },
  {
    "regex": "U-Cursos/([\\d.]+)",
    "name": "U-Cursos",
    "version": ""
  },
  {
    "regex": "1PasswordThumbs/([\\d.]+)",
    "name": "1Password",
    "version": "$1"
  },
  {
    "regex": "(?:Microsoft Office )?(Access|Excel|OneDrive for Business|OneNote|PowerPoint|Project|Publisher|Visio|Word)(?: 20\\d{2})?[ /]\\(?(\\d+\\.[\\d.]*)",
    "name": "Microsoft Office $1",
    "version": "$2"
  },
  {
    "regex": "^Mozilla/4\\.0 \\(compatible; ms-office; MSOffice[ /]([\\d.]+)",
    "name": "Microsoft Office",
    "version": "$1"
  },
  {
    "regex": "Microsoft Office SyncProc ([\\d.]+)",
    "name": "Microsoft Office",
    "version": "$1"
  },
  {
    "regex": "Microsoft Lync ([\\d.]+)",
    "name": "Microsoft Lync",
    "version": "$1"
  },
  {
    "regex": "Microsoft\\.Data\\.Mashup",
    "name": "Microsoft Power Query",
    "version": ""
  },
  {
    "regex": "WpsM?office/([\\d.]+)",
    "name": "WPS Office",
    "version": "$1"
  },
  {
    "regex": "OneDriveiOSApp/([\\d.]+)",
    "name": "Microsoft OneDrive",
    "version": "$1"
  },
  {
    "regex": "Microsoft Office Existence Discovery",
    "name": "Microsoft Office",
    "version": ""
  },
  {
    "regex": "(?:Microsoft Office Mobile|officemobile)[ /]([\\d.]+)",
    "name": "Microsoft Office Mobile",
    "version": "$1"
  },
  {
    "regex": "Skype/([\\d.]+)",
    "name": "Skype",
    "version": "$1"
  },
  {
    "regex": "OC/([\\d.]+) \\(Skype for Business\\)",
    "name": "Skype for Business",
    "version": "$1"
  },
  {
    "regex": "iPhoneLync/([\\d.]+)",
    "name": "Skype for Business",
    "version": "$1"
  },
  {
    "regex": "WebexTeams",
    "name": "Webex Teams",
    "version": ""
  },
  {
    "regex": "GroupMe/([\\d.]+)",
    "name": "GroupMe",
    "version": "$1"
  },
  {
    "regex": "AppName/(?:musical_ly|trill) app_version/([\\d.]+)",
    "name": "TikTok",
    "version": "$1"
  },
  {
    "regex": "(?:TikTok[/ ]|com\\.zhiliaoapp\\.musically|musical_ly_|trill_)(\\d+\\.(?:[.\\d]+))?",
    "name": "TikTok",
    "version": "$1"
  },
  {
    "regex": "(?:musically_go|ultralite) app_version/([\\d.]+)",
    "name": "TikTok Lite",
    "version": "$1"
  },
  {
    "regex": "aweme(?: app_version)?/([\\d.]+)",
    "name": "Douyin",
    "version": "$1"
  },
  {
    "regex": "Copied/(\\d+[.\\d]+) CFNetwork",
    "name": "Copied",
    "version": ""
  },
  {
    "regex": "Pic%20Collage/(\\d+[.\\d]+) CFNetwork",
    "name": "Pic Collage",
    "version": "$1"
  },
  {
    "regex": "Papers/(\\d+[.\\d]+) CFNetwork",
    "name": "Papers",
    "version": "$1"
  },
  {
    "regex": "RoboForm/(\\d+[.\\d]+) CFNetwork",
    "name": "RoboForm",
    "version": ""
  },
  {
    "regex": "Slack/(\\d+[.\\d]+) CFNetwork",
    "name": "Slack",
    "version": ""
  },
  {
    "regex": "com\\.tinyspeck\\.chatlyio/(\\d+[.\\d]+)",
    "name": "Slack",
    "version": "$1"
  },
  {
    "regex": "KAKAOTALK (\\d+\\.(?:[.\\d]+))?",
    "name": "KakaoTalk",
    "version": "$1"
  },
  {
    "regex": "ShopeeVN/([\\d.]+)",
    "name": "Shopee",
    "version": "$1"
  },
  {
    "regex": "SPORT1/([\\d.]+)",
    "name": "SPORT1",
    "version": ""
  },
  {
    "regex": "Clovia/([\\d.]+)",
    "name": "Clovia",
    "version": "$1"
  },
  {
    "regex": "ShowMe/([\\d.]+)",
    "name": "ShowMe",
    "version": "$1"
  },
  {
    "regex": "Wattpad/([\\d.]+)",
    "name": "Wattpad",
    "version": "$1"
  },
  {
    "regex": "WSJ/([\\d.]+)",
    "name": "The Wall Street Journal",
    "version": ""
  },
  {
    "regex": "WH%20Questions/([\\d.]+)",
    "name": "WH Questions",
    "version": "$1"
  },
  {
    "regex": "whisper/([\\d.]+)",
    "name": "Whisper",
    "version": ""
  },
  {
    "regex": "Opal/([\\d.]+)",
    "name": "Opal Travel",
    "version": "$1"
  },
  {
    "regex": "Zalo/([\\d.]+)|Zalo (?:android|iOS)",
    "name": "Zalo",
    "version": "$1"
  },
  {
    "regex": "Yandex/([\\d.]+)",
    "name": "Yandex",
    "version": ""
  },
  {
    "regex": "ZenKit/([\\d.]+)",
    "name": "Zen",
    "version": "$1"
  },
  {
    "regex": "Zoho%20Chat/([\\d.]+)",
    "name": "Zoho Chat",
    "version": "$1"
  },
  {
    "regex": "Thunder/(\\d+[.\\d]+)",
    "name": "Thunder",
    "version": "$1"
  },
  {
    "regex": "CGNBrowser/(\\d+[.\\d]+)",
    "name": "CGN",
    "version": "$1"
  },
  {
    "regex": "(?:Podbean/.+App |Podbean/Android generic |Podbean/iOS \\([^)]+\\) )(\\d+[.\\d]+)",
    "name": "Podbean",
    "version": "$1"
  },
  {
    "regex": "TuneIn Radio Pro(?:[^/]*)/(\\d+[.\\d]+)",
    "name": "TuneIn Radio Pro",
    "version": "$1"
  },
  {
    "regex": "TuneIn(?:(?: |%20)Radio(?:[^/]*))?/?(\\d+[.\\d]+)?",
    "name": "TuneIn Radio",
    "version": "$1"
  },
  {
    "regex": "devcasts/(\\d+[.\\d]+)",
    "name": "DevCasts",
    "version": "$1"
  },
  {
    "regex": "Swoot/(\\d+[.\\d]+)",
    "name": "Swoot",
    "version": "$1"
  },
  {
    "regex": "(?:^RadioPublic[/ ](?:Android|iOS)[- ])(\\d+\\.[.\\d]+)",
    "name": "RadioPublic",
    "version": "$1"
  },
  {
    "regex": "Podimo/(\\d+[.\\d]+)",
    "name": "Podimo",
    "version": "$1"
  },
  {
    "regex": "com\\.evolve\\.podcast/(\\d+[.\\d]+)",
    "name": "Evolve Podcast",
    "version": "$1"
  },
  {
    "regex": "Rocket\\.Chat\\+?/(\\d+[.\\d]+)",
    "name": "Rocket Chat",
    "version": "$1"
  },
  {
    "regex": "^Pandora Audio.+Android",
    "name": "Pandora",
    "version": ""
  },
  {
    "regex": "^WirtschaftsWoche-iOS-(\\d+[.\\d]+)",
    "name": "Wirtschafts Woche",
    "version": "$1"
  },
  {
    "regex": "^TVirl/(\\d+[.\\d]+)",
    "name": "TVirl",
    "version": "$1"
  },
  {
    "regex": "2?chMate/(\\d+[.\\d]+)",
    "name": "ChMate",
    "version": "$1"
  },
  {
    "regex": "2tch/(\\d+[.\\d]+)",
    "name": "2tch",
    "version": "$1"
  },
  {
    "regex": "Ciisaa/(\\d+[.\\d]+)",
    "name": "Ciisaa",
    "version": "$1"
  },
  {
    "regex": "BB2C (\\d+[.\\d]+)",
    "name": "BB2C",
    "version": "$1"
  },
  {
    "regex": "twinkle/(\\d+[.\\d]+)",
    "name": "twinkle",
    "version": "$1"
  },
  {
    "regex": "JaneStyle_iOS/(\\d+[.\\d]+)",
    "name": "JaneStyle",
    "version": "$1"
  },
  {
    "regex": "BNC/.+\\(Android (\\d+[.\\d]+)\\)",
    "name": "Binance",
    "version": "$1"
  },
  {
    "regex": "Binance/(\\d+[.\\d]+)",
    "name": "Binance",
    "version": "$1"
  },
  {
    "regex": "ru\\.mail\\.my/(\\d+[.\\d]+)",
    "name": "My World",
    "version": "$1"
  },
  {
    "regex": "OK(?:Android|iOS)/([\\d.]+)",
    "name": "Odnoklassniki",
    "version": "$1"
  },
  {
    "regex": "yakyak/(\\d+[.\\d]+)",
    "name": "YakYak",
    "version": "$1"
  },
  {
    "regex": "(?:maglev|Teams)/(\\d+[.\\d]+)",
    "name": "Teams",
    "version": "$1"
  },
  {
    "regex": "TeamsMobile-(?:Android|iOS)",
    "name": "Teams",
    "version": ""
  },
  {
    "regex": "SohuNews/(\\d+\\.[.\\d]+)",
    "name": "SohuNews",
    "version": "$1"
  },
  {
    "regex": "StreamlabsOBS/(\\d+[.\\d]+)",
    "name": "Streamlabs OBS",
    "version": "$1"
  },
  {
    "regex": "Blitz/([\\d.]+)",
    "name": "Blitz",
    "version": "$1"
  },
  {
    "regex": "OfferUp/([\\d.]+)",
    "name": "OfferUp",
    "version": "$1"
  },
  {
    "regex": "Vuhuv/([\\d.]+)",
    "name": "Vuhuv",
    "version": "$1"
  },
  {
    "regex": ".+/(?:gfibertv|gftv200)-([\\d]+)-",
    "name": "Google Fiber TV",
    "version": "$1"
  },
  {
    "regex": "QuickCast$",
    "name": "QuickCast",
    "version": ""
  },
  {
    "regex": "Aliexpress(?:Android)?/([\\d.]+)",
    "name": "AliExpress",
    "version": "$1"
  },
  {
    "regex": "(?:lazada_android|AliApp\\(LA)[/ _](\\d+\\.[\\d.]+)",
    "name": "Lazada",
    "version": "$1"
  },
  {
    "regex": "(?:taobao_android|AliApp\\(TB)[/ _](\\d+\\.[\\d.]+)",
    "name": "Taobao",
    "version": "$1"
  },
  {
    "regex": "(?:AlipayClient|AliApp\\(AP)[/ _](\\d+\\.[\\d.]+)",
    "name": "Alipay",
    "version": "$1"
  },
  {
    "regex": "Blue Proxy/([\\d.]+)",
    "name": "Blue Proxy",
    "version": "$1"
  },
  {
    "regex": "ntvmobil/",
    "name": "NTV Mobil",
    "version": ""
  },
  {
    "regex": "COAF%20SMART%20Citizen/",
    "name": "COAF SMART Citizen",
    "version": ""
  },
  {
    "regex": "GitHub ?Desktop/([\\d.]+)",
    "name": "GitHub Desktop",
    "version": "$1"
  },
  {
    "regex": "logioptionsplus/([\\d.]+)",
    "name": "Logi Options+",
    "version": "$1"
  },
  {
    "regex": "EmbyTheater/([\\d.]+)",
    "name": "Emby Theater",
    "version": "$1"
  },
  {
    "regex": "y8-browser/([\\d.]+)",
    "name": "Y8 Browser",
    "version": "$1"
  },
  {
    "regex": "NuMuKiBrowser/([\\d.]+)",
    "name": "NuMuKi Browser",
    "version": "$1"
  },
  {
    "regex": "LandisGyrAIMbrowser/(\\d+[.\\d]+)",
    "name": "Landis+Gyr AIM Browser",
    "version": "$1"
  },
  {
    "regex": "(?:Code/|VSCode )(\\d+[.\\d]+)",
    "name": "Visual Studio Code",
    "version": "$1"
  },
  {
    "regex": "Wireshark/(\\d+[.\\d]+)",
    "name": "Wireshark",
    "version": "$1"
  },
  {
    "regex": "Magician",
    "name": "Samsung Magician",
    "version": ""
  },
  {
    "regex": "Razer Central PC",
    "name": "Razer Synapse",
    "version": ""
  },
  {
    "regex": "git/(\\d+[.\\d]+)",
    "name": "Git",
    "version": "$1"
  },
  {
    "regex": "^GooglePodcasts/(\\d+\\.[.\\d]+)",
    "name": "Google Podcasts",
    "version": "$1"
  },
  {
    "regex": "Microsoft-CryptoAPI/(\\d+[.\\d]+)",
    "name": "Windows CryptoAPI",
    "version": ""
  },
  {
    "regex": "Microsoft-Delivery-Optimization",
    "name": "Windows Delivery Optimization",
    "version": ""
  },
  {
    "regex": "Windows-Update-Agent",
    "name": "Windows Update Agent",
    "version": ""
  },
  {
    "regex": "^MSDW",
    "name": "Dr. Watson",
    "version": ""
  },
  {
    "regex": "qBittorrent/(\\d+[.\\d]+)",
    "name": "qBittorrent",
    "version": "$1"
  },
  {
    "regex": "^CPUID",
    "name": "CPU-Z",
    "version": ""
  },
  {
    "regex": "AIDA64",
    "name": "AIDA64",
    "version": ""
  },
  {
    "regex": "HandBrake Win Upd (\\d+[.\\d]+)",
    "name": "HandBrake",
    "version": "$1"
  },
  {
    "regex": "CCleaner, (\\d+[.\\d]+)",
    "name": "CCleaner",
    "version": "$1"
  },
  {
    "regex": "Microsoft Edge Update/(\\d+[.\\d]+)",
    "name": "Edge Update",
    "version": "$1"
  },
  {
    "regex": "Google(?:Software| )Update/(\\d+[.\\d]+)",
    "name": "Chrome Update",
    "version": "$1"
  },
  {
    "regex": "Bose Music",
    "name": "Bose Music",
    "version": ""
  },
  {
    "regex": "HikConnect",
    "name": "Hik-Connect",
    "version": ""
  },
  {
    "regex": "Cortana (\\d+[.\\d]+)",
    "name": "Cortana",
    "version": "$1"
  },
  {
    "regex": "Opera News/(\\d+[.\\d]+)",
    "name": "Opera News",
    "version": "$1"
  },
  {
    "regex": "(?:Acrobat|ReaderServices)/(\\d+[.\\d]+)",
    "name": "Adobe Acrobat Reader",
    "version": "$1"
  },
  {
    "regex": "CreativeCloud/(\\d+[.\\d]+)",
    "name": "Adobe Creative Cloud",
    "version": "$1"
  },
  {
    "regex": "rekordbox/(\\d+[.\\d]+)",
    "name": "rekordbox",
    "version": "$1"
  },
  {
    "regex": "Microsoft-WNS/(\\d+[.\\d]+)",
    "name": "Windows Push Notification Services",
    "version": "$1"
  },
  {
    "regex": "Microsoft BITS/(\\d+[.\\d]+)",
    "name": "Background Intelligent Transfer Service",
    "version": "$1"
  },
  {
    "regex": "ERA Agent Update",
    "name": "ESET Remote Administrator",
    "version": ""
  },
  {
    "regex": "EpicGamesLauncher/(\\d+[.\\d]+)",
    "name": "Epic Games Launcher",
    "version": "$1"
  },
  {
    "regex": "Microsoft-WebDAV-MiniRedir",
    "name": "WebDAV",
    "version": ""
  },
  {
    "regex": "Battle\\.net/(\\d+[.\\d]+)",
    "name": "Battle.net",
    "version": "$1"
  },
  {
    "regex": "Bookshelf-Android/(\\d+[.\\d]+)",
    "name": "Bookshelf",
    "version": "$1"
  },
  {
    "regex": "RaveSocial/(\\d+[.\\d]+)",
    "name": "Rave Social",
    "version": "$1"
  },
  {
    "regex": "wordcookies/(\\d+[.\\d]+)",
    "name": "Word Cookies!",
    "version": "$1"
  },
  {
    "regex": "com\\.meevii\\.bibleKJV/(\\d+[.\\d]+)",
    "name": "Bible KJV",
    "version": "$1"
  },
  {
    "regex": "MetaTrader 5 Terminal/(\\d+[.\\d]+)",
    "name": "MetaTrader",
    "version": "$1"
  },
  {
    "regex": "com\\.paint\\.bynumber/(\\d+[.\\d]+)",
    "name": "Paint by Number",
    "version": "$1"
  },
  {
    "regex": "zepeto_global/(\\d+[.\\d]+)",
    "name": "ZEPETO",
    "version": "$1"
  },
  {
    "regex": "Jungle Disk Workgroup HTTP",
    "name": "Jungle Disk",
    "version": ""
  },
  {
    "regex": "(?:mirall|Nextcloud-android)/(\\d+[.\\d]+)",
    "name": "Nextcloud",
    "version": "$1"
  },
  {
    "regex": "GoNativeIOS/(\\d+[.\\d]+)",
    "name": "GoNative",
    "version": "$1"
  },
  {
    "regex": "Pandora/(\\d+[.\\d]+)",
    "name": "Pandora",
    "version": "$1"
  },
  {
    "regex": "Blackboard/(\\d+[.\\d]+)?",
    "name": "Blackboard",
    "version": "$1"
  },
  {
    "regex": "TIM/(\\d+[.\\d]+)",
    "name": "TIM",
    "version": "$1"
  },
  {
    "regex": "TencentDocs/(\\d+[.\\d]+)",
    "name": "Tencent Docs",
    "version": "$1"
  },
  {
    "regex": "QQ/(\\d+[.\\d]+) V1_IPH_SQ_",
    "name": "QQ",
    "version": "$1"
  },
  {
    "regex": "QQMusic/(\\d+[.\\d]+)",
    "name": "QQMusic",
    "version": "$1"
  },
  {
    "regex": "etoro-cordova-app",
    "name": "eToro",
    "version": ""
  },
  {
    "regex": "Avid Link Desktop App/(\\d+[.\\d]+)",
    "name": "Avid Link",
    "version": "$1"
  },
  {
    "regex": "Netflix/(\\d+[.\\d]+)",
    "name": "Netflix",
    "version": "$1"
  },
  {
    "regex": "GoogleTagManager/(\\d+[.\\d]+)",
    "name": "Google Tag Manager",
    "version": "$1"
  },
  {
    "regex": "Adobe Synchronizer (\\d+[.\\d]+)",
    "name": "Adobe Synchronizer",
    "version": "$1"
  },
  {
    "regex": "BlueStacks(?: 5)?/(\\d+[.\\d]+)",
    "name": "BlueStacks",
    "version": "$1"
  },
  {
    "regex": "WindowsPowerShell/(\\d+[.\\d]+)",
    "name": "PowerShell",
    "version": "$1"
  },
  {
    "regex": "PAN GlobalProtect/(\\d+[.\\d]+)",
    "name": "GlobalProtect",
    "version": "$1"
  },
  {
    "regex": "Theyub v(\\d+[.\\d]+)",
    "name": "Theyub",
    "version": "$1"
  },
  {
    "regex": "BBCNewsUKWatchApp/(\\d+[.\\d]+)",
    "name": "BBC News",
    "version": "$1"
  },
  {
    "regex": "TradingView/(\\d+[.\\d]+)",
    "name": "TradingView",
    "version": "$1"
  },
  {
    "regex": "Instabridge(?:/([\\d.]+))?",
    "name": "Instabridge",
    "version": "$1"
  },
  {
    "regex": "Be Focused/(\\d+\\.[.\\d]+)?",
    "name": "Be Focused",
    "version": "$1"
  },
  {
    "regex": "Focus Matrix/(\\d+\\.[.\\d]+)?",
    "name": "Focus Matrix",
    "version": "$1"
  },
  {
    "regex": "Focuskeeper/(\\d+\\.[.\\d]+)?",
    "name": "Focus Keeper",
    "version": "$1"
  },
  {
    "regex": "WindowsStoreSDK",
    "name": "Microsoft Store",
    "version": ""
  },
  {
    "regex": "Asus Update/(\\d+\\.[.\\d]+)",
    "name": "ASUS Updater",
    "version": "$1"
  },
  {
    "regex": "imoAndroid/(20\\d{2}\\.[.\\d]+)",
    "name": "IMO HD Video Calls & Chat",
    "version": "$1"
  },
  {
    "regex": "imoAndroid/(\\d+\\.[.\\d]+)",
    "name": "IMO International Calls & Chat",
    "version": "$1"
  },
  {
    "regex": "(?:Bing)?Sapphire/(\\d+\\.[.\\d]+)",
    "name": "Microsoft Bing",
    "version": "$1"
  },
  {
    "regex": "BingWeb(?:/([\\d.]+))?|bingipadclient",
    "name": "Microsoft Bing",
    "version": "$1"
  },
  {
    "regex": "NewsSapphire/(\\d+\\.[.\\d]+)",
    "name": "Microsoft Start",
    "version": "$1"
  },
  {
    "regex": "CopilotSapphire/(\\d+\\.[.\\d]+)",
    "name": "Microsoft Copilot",
    "version": "$1"
  },
  {
    "regex": ".+HiSearch/(\\d+\\.[.\\d]+)",
    "name": "HiSearch",
    "version": "$1"
  },
  {
    "regex": "RDDocuments/(\\d+\\.[.\\d]+)",
    "name": "RDDocuments",
    "version": "$1"
  },
  {
    "regex": "FSCDCSafe[ /](\\d+\\.[.\\d]+)",
    "name": "F-Secure SAFE",
    "version": "$1"
  },
  {
    "regex": "Twitterrific",
    "name": "Twitterrific",
    "version": ""
  },
  {
    "regex": "UconnectLive",
    "name": "Uconnect LIVE",
    "version": ""
  },
  {
    "regex": "Wayback%20Machine%20Extension",
    "name": "Wayback Machine",
    "version": ""
  },
  {
    "regex": "com\\.Nanoteq\\.QmunicateH10p.+/(\\d+\\.[.\\d]+) \\(",
    "name": "Q-municate",
    "version": "$1"
  },
  {
    "regex": "NET\\.mede",
    "name": "NET.mede",
    "version": ""
  },
  {
    "regex": "My%20Bentley",
    "name": "My Bentley",
    "version": ""
  },
  {
    "regex": "Skyeng%20App",
    "name": "Skyeng",
    "version": ""
  },
  {
    "regex": "Skyeng%20Teachers",
    "name": "Skyeng Teachers",
    "version": ""
  },
  {
    "regex": "(Millennium/|Millennium%20Corp)",
    "name": "Bank Millenium",
    "version": ""
  },
  {
    "regex": "MBolsa",
    "name": "MBolsa",
    "version": ""
  },
  {
    "regex": "(MEmpresas|Millennium%20Empresas)",
    "name": "MEmpresas",
    "version": ""
  },
  {
    "regex": "OrangeRadio/(\\d+\\.[.\\d]+)",
    "name": "Orange Radio",
    "version": "$1"
  },
  {
    "regex": "Radio%20Italiane/(\\d+\\.[.\\d]+)",
    "name": "Radio Italiane",
    "version": "$1"
  },
  {
    "regex": "com\\.apple\\.Safari\\.SearchHelper/(\\d+\\.[.\\d]+)",
    "name": "Safari Search Helper",
    "version": "$1"
  },
  {
    "regex": "Citrix%20Viewer",
    "name": "Citrix Workspace",
    "version": ""
  },
  {
    "regex": "com\\.mercbank\\.s1mobileipad",
    "name": "Mercantile Bank of Michigan",
    "version": ""
  },
  {
    "regex": "D-Stream%20Air",
    "name": "DStream Air",
    "version": ""
  },
  {
    "regex": "ExpediaBookings",
    "name": "Expedia",
    "version": ""
  },
  {
    "regex": "Windows Antivirus (\\d+\\.[.\\d]+)",
    "name": "Windows Antivirus",
    "version": "$1"
  },
  {
    "regex": "^Reflect",
    "name": "Macrium Reflect",
    "version": ""
  },
  {
    "regex": "Opera autoupdate agent",
    "name": "Opera Updater",
    "version": ""
  },
  {
    "regex": "Ballz/(\\d+\\.[.\\d]+)",
    "name": "Ballz",
    "version": "$1"
  },
  {
    "regex": "rnps-action-cards/(\\d+\\.[.\\d]+)",
    "name": "RNPS Action Cards",
    "version": "$1"
  },
  {
    "regex": "PlexMediaServer/(\\d+\\.[.\\d]+)",
    "name": "Plex Media Server",
    "version": "$1"
  },
  {
    "regex": "FreeSafeIP",
    "name": "SafeIP",
    "version": ""
  },
  {
    "regex": "Surfshark(?:Android)?/([\\d.]+)",
    "name": "Surfshark",
    "version": "$1"
  },
  {
    "regex": "APP/yym-hago-and(\\d+\\.[.\\d]+)",
    "name": "Hago",
    "version": "$1"
  },
  {
    "regex": "Azureus (\\d+\\.[.\\d]+)",
    "name": "Vuze",
    "version": "$1"
  },
  {
    "regex": "IPM",
    "name": "Adobe IPM",
    "version": ""
  },
  {
    "regex": "Adobe NGL|NGL Client/(\\d+\\.[.\\d]+)",
    "name": "Adobe NGL",
    "version": "$1"
  },
  {
    "regex": "/Satoshi:(\\d+\\.[.\\d]+)/",
    "name": "Bitcoin Core",
    "version": "$1"
  },
  {
    "regex": "/Shibetoshi:(\\d+\\.[.\\d]+)/",
    "name": "Dogecoin Core",
    "version": "$1"
  },
  {
    "regex": "Amazon\\.com/(\\d+\\.[.\\d]+)",
    "name": "Amazon Shopping",
    "version": "$1"
  },
  {
    "regex": "de\\.mobile\\.android\\.app/(\\d+\\.[.\\d]+)",
    "name": "mobile.de",
    "version": "$1"
  },
  {
    "regex": "de\\.mobile\\.android\\.app/(.*) \\((\\d+\\.[.\\d]+)\\)",
    "name": "mobile.de",
    "version": "$2"
  },
  {
    "regex": "jitsi-meet/",
    "name": "Jitsi Meet",
    "version": ""
  },
  {
    "regex": "Waste My Time! Extension/(\\d+\\.[.\\d]+)",
    "name": "Don't Waste My Time!",
    "version": "$1"
  },
  {
    "regex": "1Password/(\\d+\\.[.\\d]+)",
    "name": "1Password",
    "version": "$1"
  },
  {
    "regex": "iOSStartsidenApp",
    "name": "Startsiden",
    "version": ""
  },
  {
    "regex": "HisThumbnail",
    "name": "HisThumbnail",
    "version": ""
  },
  {
    "regex": "OneSearch/(\\d+\\.[.\\d]+)",
    "name": "Yahoo OneSearch",
    "version": "$1"
  },
  {
    "regex": "anonymized by Abelssoft",
    "name": "AntiBrowserSpy",
    "version": ""
  },
  {
    "regex": "Anonymisiert durch AlMiSoft(?! Browser-Maulkorb)",
    "name": "Browser-Anonymizer",
    "version": ""
  },
  {
    "regex": "DaumApps/(\\d+\\.[.\\d]+)?",
    "name": "Daum",
    "version": "$1"
  },
  {
    "regex": "AT&T TV",
    "name": "DIRECTV",
    "version": ""
  },
  {
    "regex": "Reddit/Version (\\d+\\.[.\\d]+)/",
    "name": "Reddit",
    "version": "$1"
  },
  {
    "regex": "TuyaSmart/(\\d+\\.[.\\d]+)",
    "name": "Tuya Smart Life",
    "version": "$1"
  },
  {
    "regex": "(?:Spotify(?:-Lite)?/(\\d+\\.[.\\d]+|12\\d+)|^spotify_)",
    "name": "Spotify",
    "version": "$1"
  },
  {
    "regex": "(?:AmazonMusic|^Harley)(?:(?:%2F|/)(\\d+\\.[.\\d]+))?",
    "name": "Amazon Music",
    "version": "$1"
  },
  {
    "regex": "Klarna/(\\d+\\.[.\\d]+)?",
    "name": "Klarna",
    "version": "$1"
  },
  {
    "regex": "^R/(\\d+[.\\d]+)",
    "name": "R",
    "version": "$1"
  },
  {
    "regex": "RadioAppFree/",
    "name": "RadioApp",
    "version": ""
  },
  {
    "regex": "^(?:Audible, Android, |com\\.audible\\.playersdk\\.player/|Audible/)(\\d+\\.[.\\d]+)?",
    "name": "Audible",
    "version": "$1"
  },
  {
    "regex": "Overcast/?(\\d+\\.[.\\d]+)? \\(\\+http://overcast\\.fm/; (?:Apple Watch|iOS) podcast",
    "name": "Overcast",
    "version": "$1"
  },
  {
    "regex": "^HTTPrequestmaker",
    "name": "HTTP request maker",
    "version": ""
  },
  {
    "regex": "^bonprix mobile App (\\d+\\.[.\\d]+)",
    "name": "BonPrix",
    "version": "$1"
  },
  {
    "regex": "Safari Quora (\\d+\\.[.\\d]+)",
    "name": "Quora",
    "version": "$1"
  },
  {
    "regex": "RelesysApp/(\\d+\\.[.\\d]+) \\(\\d{1,2}\\) net\\.relesysapp\\.jj2go",
    "name": "JJ2GO",
    "version": "$1"
  },
  {
    "regex": "MyWatchParty/(\\d+\\.[.\\d]+)",
    "name": "My Watch Party",
    "version": "$1"
  },
  {
    "regex": "LoseIt!/(\\d+\\.[.\\d]+)",
    "name": "LoseIt!",
    "version": "$1"
  },
  {
    "regex": "ActionExtension/([\\d.]+)",
    "name": "ActionExtension",
    "version": "$1"
  },
  {
    "regex": "^Adori(?:-Dev|-Listen)?/([\\d.]+)",
    "name": "Adori",
    "version": "$1"
  },
  {
    "regex": "^Agora/([\\d.]+)",
    "name": "Agora",
    "version": "$1"
  },
  {
    "regex": "^Airr(?:%20Beta)?/([\\d.]+)|^Airr \\(",
    "name": "Airr",
    "version": "$1"
  },
  {
    "regex": "^Airsonic/(\\d+\\.[.\\d]+)",
    "name": "Airsonic",
    "version": "$1"
  },
  {
    "regex": "(?:AllYouCanBooksApp|^AllYouCanBooks/([\\d.]+))",
    "name": "All You Can Books",
    "version": "$1"
  },
  {
    "regex": "^AllHitMusicRadio/([\\d.]+)",
    "name": "AllHitMusicRadio",
    "version": "$1"
  },
  {
    "regex": "^Amazon;AF",
    "name": "Amazon Fire",
    "version": ""
  },
  {
    "regex": "^Anchor/([\\d.]+)",
    "name": "Anchor",
    "version": "$1"
  },
  {
    "regex": "^AnchorFM/(\\d+\\.[.\\d]+)",
    "name": "AnchorFM",
    "version": "$1"
  },
  {
    "regex": "(?:^Anghami Android |^Anghami/|^أنغامي/)([\\d.]+)",
    "name": "Anghami",
    "version": "$1"
  },
  {
    "regex": "(?:^AntennaPod/|^de\\.danoeh\\.antennapod/|antenna/)([\\d.]+)?",
    "name": "AntennaPod",
    "version": "$1"
  },
  {
    "regex": "^Anybox/([\\d.]+)",
    "name": "Anybox",
    "version": "$1"
  },
  {
    "regex": "^Anytime/(\\d+\\.[.\\d]+).*amugofjava",
    "name": "Anytime Podcast Player",
    "version": "$1"
  },
  {
    "regex": "^APKXDL",
    "name": "APK Downloader",
    "version": ""
  },
  {
    "regex": "^Apollo/([\\d.]+)",
    "name": "Apollo",
    "version": "$1"
  },
  {
    "regex": "(?:^MessagesViewService/|^Messages/|^Messages Share Extension/|^MessagesNotificationExtension/)([\\d.]+)",
    "name": "Apple iMessage",
    "version": "$1"
  },
  {
    "regex": "(?:^Podcasts/|^Balados/|^Podcasti/|^Podcastit/|^Podcasturi/|^Podcasty/|^Podcast’ler/|^Podkaster/|^Podcaster/|^Podcastok/|^Подкасти/|^Подкасты/|^פודקאסטים/|^البودكاست/|^पॉडकास्ट/|^พ็อดคาสท์/|^播客/|^팟캐스트/|^ポッドキャスト/|^إسمعلي/|^Подкасттар/|^Podcast/|AirPodcasts/)([\\d.]+)?",
    "name": "Apple Podcasts",
    "version": "$1"
  },
  {
    "regex": "^Recordatorios/([\\d.]+)",
    "name": "Apple Reminders",
    "version": "$1"
  },
  {
    "regex": "^Arvocast/([\\d.]+)",
    "name": "Arvocast",
    "version": "$1"
  },
  {
    "regex": "^Radio\\.com/(\\d+\\.[.\\d]+)",
    "name": "Audacy",
    "version": "$1"
  },
  {
    "regex": "^Audio/([\\d.]+)",
    "name": "Audio",
    "version": "$1"
  },
  {
    "regex": "^Android_AudioNow",
    "name": "Audio Now",
    "version": ""
  },
  {
    "regex": "^Awasu/(\\d+\\.[.\\d]+)",
    "name": "Awasu",
    "version": "$1"
  },
  {
    "regex": "^Bear/([\\d.]+)",
    "name": "Bear",
    "version": "$1"
  },
  {
    "regex": "^Bible/([\\d.]+)",
    "name": "Bible",
    "version": "$1"
  },
  {
    "regex": "^Bolt/([\\d.]+)",
    "name": "Bolt",
    "version": "$1"
  },
  {
    "regex": "^Bookmobile/([\\d.]+)",
    "name": "Bookmobile",
    "version": "$1"
  },
  {
    "regex": "^Boom/([\\d.]+)",
    "name": "Boom",
    "version": "$1"
  },
  {
    "regex": "^Boomplay/(\\d+\\.[.\\d]+)",
    "name": "Boomplay",
    "version": "$1"
  },
  {
    "regex": "^Bose/(\\d+\\.[.\\d]+)",
    "name": "Bose SoundTouch",
    "version": "$1"
  },
  {
    "regex": "^bPod$",
    "name": "bPod",
    "version": ""
  },
  {
    "regex": "^breez/(\\d+\\.[.\\d]+)",
    "name": "Breez",
    "version": "$1"
  },
  {
    "regex": "^Broadcast/(\\d+\\.[.\\d]+)",
    "name": "Broadcast",
    "version": "$1"
  },
  {
    "regex": "BroadwayPodcastNetwork/iOS",
    "name": "Broadway Podcast Network",
    "version": ""
  },
  {
    "regex": "^(?:Browser|browser_iso)/([\\d.]+)",
    "name": "Browser app",
    "version": "$1"
  },
  {
    "regex": "^BrowserPlus/([\\d.]+)",
    "name": "BrowserPlus",
    "version": "$1"
  },
  {
    "regex": "^Bullhorn(?:/([\\d.]+))?",
    "name": "Bullhorn",
    "version": "$1"
  },
  {
    "regex": "^Capital/([\\d.]+)",
    "name": "Capital",
    "version": "$1"
  },
  {
    "regex": "^capsule\\.fm/([\\d.]+)|^capsule-android",
    "name": "capsule.fm",
    "version": "$1"
  },
  {
    "regex": "^Castamatic/([\\d.]+)",
    "name": "Castamatic",
    "version": "$1"
  },
  {
    "regex": "^Castaway/([\\d.]+)",
    "name": "Castaway",
    "version": "$1"
  },
  {
    "regex": "^CastBox/(\\d+\\.[.\\d]+)",
    "name": "CastBox",
    "version": "$1"
  },
  {
    "regex": "^Classic FM/([\\d.]+)",
    "name": "Classic FM",
    "version": "$1"
  },
  {
    "regex": "^Client/([\\d.]+)",
    "name": "Client",
    "version": "$1"
  },
  {
    "regex": "^Cosmicast/([\\d.]+)",
    "name": "Cosmicast",
    "version": "$1"
  },
  {
    "regex": "CPod/(\\d+\\.[.\\d]+)",
    "name": "CPod",
    "version": "$1"
  },
  {
    "regex": "^damus/([\\d.]+)",
    "name": "Damus",
    "version": "$1"
  },
  {
    "regex": "(?:be\\.standaard\\.audio|^DS podcast/|DS%20Podcast/)([\\d.]+)?",
    "name": "De Standaard",
    "version": "$1"
  },
  {
    "regex": "^DManager/([\\d.]+)",
    "name": "DManager",
    "version": "$1"
  },
  {
    "regex": "^doubleTwist CloudPlayer",
    "name": "DoubleTwist CloudPlayer",
    "version": ""
  },
  {
    "regex": "^Doughnut/([\\d.]+)",
    "name": "Doughnut",
    "version": "$1"
  },
  {
    "regex": "^Downie/([\\d.]+)",
    "name": "Downie",
    "version": "$1"
  },
  {
    "regex": "^Downloader/([\\d.]+)",
    "name": "Downloader",
    "version": "$1"
  },
  {
    "regex": "^EMAudioPlayer (\\d+\\.[.\\d]+)",
    "name": "EMAudioPlayer",
    "version": "$1"
  },
  {
    "regex": "^Expo/(\\d+\\.[.\\d]+)",
    "name": "Expo",
    "version": "$1"
  },
  {
    "regex": "^CFR%20Plus/([\\d.]+)",
    "name": "faidr",
    "version": "$1"
  },
  {
    "regex": "^Fathom/([\\d.]+)",
    "name": "Fathom",
    "version": "$1"
  },
  {
    "regex": "^FeedStation/(\\d+\\.[.\\d]+)",
    "name": "FeedStation",
    "version": "$1"
  },
  {
    "regex": "^Files/([\\d.]+)",
    "name": "Files",
    "version": "$1"
  },
  {
    "regex": "^Fountain(?:app)?/([\\d.]+)",
    "name": "Fountain",
    "version": "$1"
  },
  {
    "regex": "^Garmin fenix 5X Plus/(\\d+\\.[.\\d]+)",
    "name": "Garmin fenix 5X",
    "version": "$1"
  },
  {
    "regex": "^Garmin Forerunner (?:\\d+)(?: Music| Solar)?/(\\d+\\.[.\\d]+)",
    "name": "Garmin Forerunner",
    "version": "$1"
  },
  {
    "regex": "^Gold/([\\d.]+)",
    "name": "Gold",
    "version": "$1"
  },
  {
    "regex": "^GoldenPod/(\\d+\\.[.\\d]+)",
    "name": "GoldenPod",
    "version": "$1"
  },
  {
    "regex": "^GoLoud/([\\d.]+)",
    "name": "GoLoud",
    "version": "$1"
  },
  {
    "regex": "Goodpods(?:\\.Android|\\.iOS)? ?/ ?([\\d.]+)",
    "name": "Goodpods",
    "version": "$1"
  },
  {
    "regex": "^GoodReader(?:4|IPad)?/([\\d.]+)",
    "name": "GoodReader",
    "version": "$1"
  },
  {
    "regex": "\\(Fuchsia\\).* CrKey/(:?\\d+\\.[.\\d]+)",
    "name": "Google Nest Hub",
    "version": ""
  },
  {
    "regex": "^Guacamole/([\\d.]+)",
    "name": "Guacamole",
    "version": "$1"
  },
  {
    "regex": "^Hammel/([\\d.]+)",
    "name": "Hammel",
    "version": "$1"
  },
  {
    "regex": "^HardCast/([\\d.]+)",
    "name": "HardCast",
    "version": "$1"
  },
  {
    "regex": "^Hark/([\\d.]+)",
    "name": "Hark Audio",
    "version": "$1"
  },
  {
    "regex": "^Heart/([\\d.]+)",
    "name": "Heart",
    "version": "$1"
  },
  {
    "regex": "hermespod\\.com/v?([\\d.]+)",
    "name": "HermesPod",
    "version": "$1"
  },
  {
    "regex": "^HiCast/([\\d.]+)",
    "name": "HiCast",
    "version": "$1"
  },
  {
    "regex": "^Himalaya(?:_test)?/([\\d.]+)",
    "name": "Himalaya",
    "version": "$1"
  },
  {
    "regex": "^HyperCatcher/([\\d.]+)",
    "name": "HyperCatcher",
    "version": "$1"
  },
  {
    "regex": "^(?:iHeartRadio|iHeartPodcasts)/([\\d.]+)",
    "name": "iHeartRadio",
    "version": "$1"
  },
  {
    "regex": "^IOSAudiobooks/([\\d.]+)",
    "name": "Audiobooks",
    "version": "$1"
  },
  {
    "regex": "^iVoox(?:App|New)?[ /]?([\\d.]+)?",
    "name": "iVoox",
    "version": "$1"
  },
  {
    "regex": "^Jam/(\\d+\\.[.\\d]+)",
    "name": "Jam",
    "version": "$1"
  },
  {
    "regex": "^(?:com\\.jio\\.media\\.jiobeats/(\\d+\\.[.\\d]+)|com\\.saavn\\.android|^[sS]aavn)",
    "name": "JioSaavn",
    "version": "$1"
  },
  {
    "regex": "KajabiMobileApp|KajabiPodcast",
    "name": "Kajabi",
    "version": ""
  },
  {
    "regex": "^KakaoTalk/(\\d+\\.[.\\d]+)",
    "name": "KakaoTalk",
    "version": "$1"
  },
  {
    "regex": "^Kids(?:%20| )Listen/([\\d.]+)",
    "name": "Kids Listen",
    "version": "$1"
  },
  {
    "regex": "^KidspodMobileClient/([\\d.]+)",
    "name": "KidsPod",
    "version": "$1"
  },
  {
    "regex": "^KKBOX/(\\d+\\.[.\\d]+)",
    "name": "KKBOX",
    "version": "$1"
  },
  {
    "regex": "^(?:Laughable.+iOS|Laughable)/(\\d+\\.[.\\d]+)",
    "name": "Laughable",
    "version": "$1"
  },
  {
    "regex": "^LBC/([\\d.]+)",
    "name": "LBC",
    "version": "$1"
  },
  {
    "regex": "LG Player (\\d+\\.[.\\d]+)",
    "name": "LG Player",
    "version": "$1"
  },
  {
    "regex": "^Listen(?:(?: |%20)App)?/([\\d.]+)",
    "name": "Listen",
    "version": "$1"
  },
  {
    "regex": "^Liulo/([\\d.]+)",
    "name": "Liulo",
    "version": "$1"
  },
  {
    "regex": "Listen5[ /]([\\d.]+)",
    "name": "Just Listen",
    "version": "$1"
  },
  {
    "regex": "^(?:Luminary(?:Preprod)?|luminary\\.next)/([\\d.]+)",
    "name": "Luminary",
    "version": "$1"
  },
  {
    "regex": "^Megaphone\\.fm",
    "name": "Megaphone",
    "version": ""
  },
  {
    "regex": "^Menucast/(\\d+\\.[.\\d]+)",
    "name": "Menucast",
    "version": "$1"
  },
  {
    "regex": "^Messenger/([\\d.]+)",
    "name": "MessengerX",
    "version": "$1"
  },
  {
    "regex": "^Mimir(?:-macOS)?/([\\d.]+)",
    "name": "Mimir",
    "version": "$1"
  },
  {
    "regex": "^MobileSMS/([\\d.]+)",
    "name": "MobileSMS",
    "version": "$1"
  },
  {
    "regex": "^Moon ?FM/([\\d.]+)",
    "name": "MoonFM",
    "version": "$1"
  },
  {
    "regex": "^myTuner(?:(?:%20Radio%20app|iOS%20Free|_podcasts_androidplayer)/ ?([\\d.]+)?)?",
    "name": "MyTuner",
    "version": "$1"
  },
  {
    "regex": "^Newsly$",
    "name": "Newsly",
    "version": ""
  },
  {
    "regex": "^NRC(?: |%20)Audio/([\\d.]+)",
    "name": "NRC Audio",
    "version": "$1"
  },
  {
    "regex": "(?:NRC-Nieuws/|nl\\.nrc\\.nrcapp |com\\.twipemobile\\.nrc )([\\d.]+)",
    "name": "NRC",
    "version": "$1"
  },
  {
    "regex": "^Outcast[/ ]?([\\d.]+)?",
    "name": "Outcast",
    "version": "$1"
  },
  {
    "regex": "^Podcast Overhaul/(\\d+\\.[.\\d]+)",
    "name": "Overhaul FM",
    "version": "$1"
  },
  {
    "regex": "^Palco MP3/(\\d+\\.[.\\d]+)",
    "name": "Palco MP3",
    "version": "$1"
  },
  {
    "regex": "^PeaCast/(\\d+\\.[.\\d]+)",
    "name": "PeaCast",
    "version": "$1"
  },
  {
    "regex": "^Player FM|^Player%20FM|^Alpha%20PlayerFM/",
    "name": "Player FM",
    "version": ""
  },
  {
    "regex": "^Podbay/([\\d.]+)",
    "name": "Podbay",
    "version": "$1"
  },
  {
    "regex": "^PodcastGuru[ /]([\\d.]+)",
    "name": "Podcast Guru",
    "version": "$1"
  },
  {
    "regex": "^Podcast Player/(\\d+\\.[.\\d]+)",
    "name": "Podcast Player",
    "version": "$1"
  },
  {
    "regex": "^PodcastRepublic/(\\d+\\.[.\\d]+)",
    "name": "Podcast Republic",
    "version": "$1"
  },
  {
    "regex": "^Podcastly[/ ]?(\\d+\\.[.\\d]+)?",
    "name": "Podcastly",
    "version": "$1"
  },
  {
    "regex": "^Podchaser |^Podchaser-Parser",
    "name": "Podchaser",
    "version": ""
  },
  {
    "regex": "^Podclipper/([\\d.]+)",
    "name": "Podclipper",
    "version": "$1"
  },
  {
    "regex": "^PodCruncher/(\\d+\\.[.\\d]+)",
    "name": "PodCruncher",
    "version": "$1"
  },
  {
    "regex": "^Podeo/([\\d.]+)",
    "name": "Podeo",
    "version": "$1"
  },
  {
    "regex": "^Podfriend[ /](\\d+\\.[.\\d]+)",
    "name": "Podfriend",
    "version": "$1"
  },
  {
    "regex": "(?:^Podhero(?:%20Alpha)?/|^Swoot[/ ](?:Agent[/ ])?)([\\d.]+)",
    "name": "Podhero",
    "version": "$1"
  },
  {
    "regex": "^Podimo/(\\d+\\.[.\\d]+)",
    "name": "Podimo",
    "version": "$1"
  },
  {
    "regex": "PodKast$",
    "name": "PodKast",
    "version": ""
  },
  {
    "regex": "^Podkicker(?: Pro)/(\\d+\\.[.\\d]+)",
    "name": "Podkicker Pro",
    "version": "$1"
  },
  {
    "regex": "PodLP/(\\d+\\.[.\\d]+)",
    "name": "PodLP",
    "version": "$1"
  },
  {
    "regex": "^(?:Podme android app|PodMe)/(\\d+\\.[.\\d]+)?",
    "name": "PodMe",
    "version": "$1"
  },
  {
    "regex": "^PodMN/(?:iOS|Android) (\\d+\\.[.\\d]+)",
    "name": "PodMN",
    "version": "$1"
  },
  {
    "regex": "^PodNL/([\\d.]+)",
    "name": "PodNL",
    "version": "$1"
  },
  {
    "regex": "^(?:Podopolo|podopolo)/?([\\d.]+)",
    "name": "Podopolo",
    "version": "$1"
  },
  {
    "regex": "^Podplay/(\\d+\\.[.\\d]+)",
    "name": "Podplay",
    "version": "$1"
  },
  {
    "regex": "^Pods/",
    "name": "Pods",
    "version": "$1"
  },
  {
    "regex": "^Podurama/(\\d+\\.[.\\d]+)",
    "name": "Podurama",
    "version": "$1"
  },
  {
    "regex": "^PodTrapper$",
    "name": "PodTrapper",
    "version": ""
  },
  {
    "regex": "^Podvine/(\\d+\\.[.\\d]+)",
    "name": "Podvine",
    "version": "$1"
  },
  {
    "regex": "^Podverse/",
    "name": "Podverse",
    "version": ""
  },
  {
    "regex": "(?:Podyssey App|com\\.toysinboxes\\.Echo|fm\\.podyssey\\.podcasts|^Podyssey)/?([\\d.]+)?",
    "name": "Podyssey",
    "version": "$1"
  },
  {
    "regex": "^PugpigBolt (\\d+\\.[.\\d]+)",
    "name": "PugPig Bolt",
    "version": "$1"
  },
  {
    "regex": "^radio\\.([a-z]{2}|net)[ /]([\\d.]+)",
    "name": "radio.$1",
    "version": "$2"
  },
  {
    "regex": "^GetPodcast[ /]([\\d.]+)",
    "name": "GetPodcast",
    "version": "$1"
  },
  {
    "regex": "^radio\\.next[ /]([\\d.]+)",
    "name": "Radio Next",
    "version": "$1"
  },
  {
    "regex": "(?:^Radioline%202/(\\d+\\.[.\\d]+)|^Radioline$)",
    "name": "Radioline",
    "version": "$1"
  },
  {
    "regex": "^Repod/(\\d+\\.[.\\d]+)",
    "name": "Repod",
    "version": "$1"
  },
  {
    "regex": "^rhythmbox/(\\d+\\.[.\\d]+)",
    "name": "Rhythmbox",
    "version": "$1"
  },
  {
    "regex": "^SachNoi\\.?app/([\\d.]+)",
    "name": "SachNoi",
    "version": "$1"
  },
  {
    "regex": "^sp-agent",
    "name": "Samsung Podcasts",
    "version": ""
  },
  {
    "regex": "^(?:ServeStream(?: Dynamo)?/?(\\d+\\.[.\\d]+)?)",
    "name": "ServeStream",
    "version": "$1"
  },
  {
    "regex": "^Shadow/([\\d.]+)",
    "name": "Shadow",
    "version": "$1"
  },
  {
    "regex": "^Shadowrocket/([\\d.]+)",
    "name": "Shadowrocket",
    "version": "$1"
  },
  {
    "regex": "^(?:SiriusXM|sxm-android|sxm-apple)/([\\d.]+)",
    "name": "SiriusXM",
    "version": "$1"
  },
  {
    "regex": "^Snipd/([\\d.]+)",
    "name": "Snipd",
    "version": "$1"
  },
  {
    "regex": "^Sodes/([\\d.]+)",
    "name": "'sodes",
    "version": "$1"
  },
  {
    "regex": "(?:Sonnet/(?:Android|iOS)|^Simple Podcast Player/(\\d+\\.[.\\d]+))",
    "name": "Sonnet",
    "version": "$1"
  },
  {
    "regex": "^sony_tv;ps5;",
    "name": "Sony PlayStation 5",
    "version": ""
  },
  {
    "regex": "^SoundOn/([\\d.]+)",
    "name": "SoundOn",
    "version": "$1"
  },
  {
    "regex": "^SoundWaves-(\\d+\\.[.\\d]+)",
    "name": "SoundWaves",
    "version": "$1"
  },
  {
    "regex": "Spreaker/([\\d.]+)",
    "name": "Spreaker",
    "version": "$1"
  },
  {
    "regex": "^Stitcher/|^Stitcher Demo/|^AlexaMediaPlayer/Stitcher",
    "name": "Stitcher",
    "version": ""
  },
  {
    "regex": "^StoryShots/(\\d+\\.[.\\d]+)",
    "name": "StoryShots",
    "version": "$1"
  },
  {
    "regex": "^Swinsian/([\\d.]+)",
    "name": "Swinsian",
    "version": "$1"
  },
  {
    "regex": "^ThePodcastApp/(\\d+\\.[.\\d]+)",
    "name": "Podcast App",
    "version": "$1"
  },
  {
    "regex": "^TREBLE/([\\d.]+)",
    "name": "Treble.fm",
    "version": "$1"
  },
  {
    "regex": "^Turtlecast/(\\d+\\.[.\\d]+)",
    "name": "Turtlecast",
    "version": "$1"
  },
  {
    "regex": "^Ubook Player$",
    "name": "Ubook Player",
    "version": ""
  },
  {
    "regex": "^VictorReader Stream Trek",
    "name": "Victor Reader Stream Trek",
    "version": ""
  },
  {
    "regex": "^VictorReader Stream V3",
    "name": "Victor Reader Stream 3",
    "version": ""
  },
  {
    "regex": "^(?:VictorReader Stream 503|VictorReader_)",
    "name": "Victor Reader Stream New Generation",
    "version": ""
  },
  {
    "regex": "^Vodacast/([\\d.]+)",
    "name": "Vodacast",
    "version": "$1"
  },
  {
    "regex": "^WynkMusic/(\\d+\\.[.\\d]+)",
    "name": "Wynk Music",
    "version": "$1"
  },
  {
    "regex": "^Xiaoyuzhou/(\\d+\\.[.\\d]+)",
    "name": "Xiao Yu Zhou",
    "version": "$1"
  },
  {
    "regex": "^Ya(ndex)?\\.Music/",
    "name": "Yandex Music",
    "version": ""
  },
  {
    "regex": "^yapa/([\\d.]+)",
    "name": "Yapa",
    "version": "$1"
  },
  {
    "regex": "Zune/(\\d+\\.[.\\d]+)",
    "name": "Zune",
    "version": ""
  },
  {
    "regex": "UCast/([\\d.]+)",
    "name": "UCast",
    "version": "$1"
  },
  {
    "regex": "(?:^NPROneAndroid$|(?:^NPR%20One|nprone_android)/([\\d.]+))",
    "name": "NPR",
    "version": "$1"
  },
  {
    "regex": "Uforia/([\\d.]+)",
    "name": "Uforia",
    "version": "$1"
  },
  {
    "regex": "^LAT-Native-App",
    "name": "L.A. Times",
    "version": ""
  },
  {
    "regex": "(?:^NYT(?: |%20)?Audio(?:-iOS)?|nytios)/([\\d.]+)",
    "name": "The New York Times",
    "version": "$1"
  },
  {
    "regex": "^LiSTNR[.\\w]*/([\\d.]+)",
    "name": "LiSTNR",
    "version": "$1"
  },
  {
    "regex": "^Podu_player$",
    "name": "podU",
    "version": "$1"
  },
  {
    "regex": "^TiviMate/([\\d.]+)",
    "name": "TiviMate",
    "version": "$1"
  },
  {
    "regex": "IPTV/([\\d.]+)",
    "name": "IPTV",
    "version": "$1"
  },
  {
    "regex": "IPTV Pro/([\\d.]+)",
    "name": "IPTV Pro",
    "version": "$1"
  },
  {
    "regex": "^com\\.audials(?:\\.paid)?/([\\d.]+)",
    "name": "Audials",
    "version": "$1"
  },
  {
    "regex": "^CoolerFM/([\\d.]+)",
    "name": "Cooler",
    "version": "$1"
  },
  {
    "regex": "^Metacast/([\\d.]+)",
    "name": "Metacast",
    "version": "$1"
  },
  {
    "regex": "^mowPod/([\\d.]+)",
    "name": "mowPod",
    "version": "$1"
  },
  {
    "regex": "com\\.meecel\\.feedreader\\.RssDemonAd",
    "name": "RSSDemon",
    "version": ""
  },
  {
    "regex": "^Virgin(?:%20|\\s)Radio/([\\d.]+)",
    "name": "Virgin Radio",
    "version": "$1"
  },
  {
    "regex": "MetaMask(?:Mobile)?",
    "name": "MetaMask",
    "version": ""
  },
  {
    "regex": "\\+Simple Browser",
    "name": "+Simple",
    "version": ""
  },
  {
    "regex": "Bitwarden_Mobile/([\\d.]+)",
    "name": "Bitwarden",
    "version": "$1"
  },
  {
    "regex": "MXPlayer/([\\d.]+)",
    "name": "MX Player",
    "version": "$1"
  },
  {
    "regex": "HistoryHound/([\\d.]+)",
    "name": "HistoryHound",
    "version": "$1"
  },
  {
    "regex": "Quicksilver",
    "name": "Quicksilver",
    "version": ""
  },
  {
    "regex": "CamScanner/([\\d.]+)",
    "name": "CamScanner",
    "version": "$1"
  },
  {
    "regex": "OBS/(\\d+[.\\d]+)",
    "name": "OBS Studio",
    "version": "$1"
  },
  {
    "regex": "XSplitBroadcaster/(\\d+[.\\d]+)",
    "name": "XSplit Broadcaster",
    "version": "$1"
  },
  {
    "regex": "twitch-desktop-electron-platform.*spotlight/(\\d+[.\\d]+)",
    "name": "Twitch Studio",
    "version": "$1"
  },
  {
    "regex": "Stream Master$",
    "name": "Stream Master",
    "version": ""
  },
  {
    "regex": "Freespoke/(\\d+\\.[.\\d]+)",
    "name": "Freespoke",
    "version": "$1"
  },
  {
    "regex": "Whatplay",
    "name": "Whatplay",
    "version": ""
  },
  {
    "regex": "Lark/(\\d+[.\\d]+)",
    "name": "Lark",
    "version": "$1"
  },
  {
    "regex": "SearchCraft/(\\d+[.\\d]+)",
    "name": "SearchCraft",
    "version": "$1"
  },
  {
    "regex": "DeFiWallet/(\\d+[.\\d]+)",
    "name": "Crypto.com DeFi Wallet",
    "version": "$1"
  },
  {
    "regex": "Clipbox\\+/(\\d+[.\\d]+)",
    "name": "Clipbox+",
    "version": "$1"
  },
  {
    "regex": "appname/HideX",
    "name": "HideX",
    "version": ""
  },
  {
    "regex": "HMSCore(?:[ /]([\\d.]+))?(?!.*HuaweiBrowser)",
    "name": "Huawei Mobile Services",
    "version": "$1"
  },
  {
    "regex": "appname/PLAYit",
    "name": "PLAYit",
    "version": ""
  },
  {
    "regex": "Autopliuslt(?:/([\\d.]+))?",
    "name": "Autoplius.lt",
    "version": "$1"
  },
  {
    "regex": "HCom(?:/([\\d.]+))?",
    "name": "Hotels.com",
    "version": "$1"
  },
  {
    "regex": "CoinbaseRetail(?:/([\\d.]+))?",
    "name": "Coinbase",
    "version": "$1"
  },
  {
    "regex": "De Telegraaf(?:/([\\d.]+))?",
    "name": "De Telegraaf",
    "version": "$1"
  },
  {
    "regex": "waipu/([\\d.]+)",
    "name": "waipu.tv",
    "version": "$1"
  },
  {
    "regex": "Redditor",
    "name": "Redditor",
    "version": ""
  },
  {
    "regex": "com\\.topbuzz\\.videoen/([\\d.]+)",
    "name": "BuzzVideo",
    "version": "$1"
  },
  {
    "regex": "GlobalProtect",
    "name": "GlobalProtect",
    "version": ""
  },
  {
    "regex": "Trade Me(?:/([\\d.]+))?",
    "name": "Trade Me",
    "version": "$1"
  },
  {
    "regex": "XING(?:-iPhone)?/([\\d.]+)",
    "name": "XING",
    "version": "$1"
  },
  {
    "regex": "Bridge/([\\d.]+)",
    "name": "Bridge",
    "version": "$1"
  },
  {
    "regex": "iPlayTV/([\\d.]+)",
    "name": "iPlayTV",
    "version": "$1"
  },
  {
    "regex": "momoWebView/([\\d.]+)",
    "name": "MOMO",
    "version": "$1"
  },
  {
    "regex": "nate_app;appver:([\\d.]+)",
    "name": "nate",
    "version": "$1"
  },
  {
    "regex": "SOFI_APP_VERSION=([\\d.]+)",
    "name": "SoFi",
    "version": "$1"
  },
  {
    "regex": "WNYC(?: App)?[/ ]?([\\d.]+)?",
    "name": "WNYC",
    "version": "$1"
  },
  {
    "regex": "com\\.theepochtimes\\.mobile/([\\d.]+)",
    "name": "The Epoch Times",
    "version": "$1"
  },
  {
    "regex": "ReutersNews(?: App)?[/ ]?([\\d.]+)?",
    "name": "Reuters News",
    "version": "$1"
  },
  {
    "regex": "WatchFree/([\\d.]+)",
    "name": "WatchFree+",
    "version": "$1"
  },
  {
    "regex": "obsidian/([\\d.]+)",
    "name": "Obsidian",
    "version": "$1"
  },
  {
    "regex": "Perplexity",
    "name": "Perplexity",
    "version": ""
  },
  {
    "regex": "XShare",
    "name": "XShare",
    "version": ""
  },
  {
    "regex": "VISHAAPP ([\\d.]+)",
    "name": "Visha",
    "version": "$1"
  },
  {
    "regex": "nyt_android/([\\d.]+)",
    "name": "The Crossword",
    "version": "$1"
  },
  {
    "regex": "mojeek-app",
    "name": "Mojeek",
    "version": ""
  },
  {
    "regex": "Fiddler/(\\d+[.\\d]+)",
    "name": "Fiddler Classic",
    "version": "$1"
  },
  {
    "regex": "ZONApp/(?:iOS|Android)/([\\d.]+)",
    "name": "ZEIT ONLINE",
    "version": "$1"
  },
  {
    "regex": "tracepal(?:\\.app)?/([\\d.]+)",
    "name": "TracePal",
    "version": "$1"
  },
  {
    "regex": "topsecret\\.chat/([\\d.]+)",
    "name": "TopSecret Chat",
    "version": "$1"
  },
  {
    "regex": "Kwai/([\\d.]+)",
    "name": "Kwai",
    "version": "$1"
  },
  {
    "regex": "Kwai_Pro/([\\d.]+)",
    "name": "Kwai Pro",
    "version": "$1"
  },
  {
    "regex": "Sooplive Webview/([\\d.]+)",
    "name": "SOOP",
    "version": "$1"
  },
  {
    "regex": "GoEuro(?:Android|IOS )/([\\d.]+)",
    "name": "GoEuro",
    "version": "$1"
  },
  {
    "regex": "BOOM v([\\d.]+)",
    "name": "Boom360",
    "version": "$1"
  },
  {
    "regex": "WallaNews/([\\d.]+)",
    "name": "Walla News",
    "version": "$1"
  },
  {
    "regex": "TRP_iPhone_App/([\\d.]+)",
    "name": "TRP Retail Locator",
    "version": "$1"
  },
  {
    "regex": "Townnews-Now/([\\d.]+)",
    "name": "TownNews Now",
    "version": "$1"
  },
  {
    "regex": "^Klara/",
    "name": "Klara",
    "version": ""
  },
  {
    "regex": "EdmodoAndroid/([\\d.]+)",
    "name": "Edmodo",
    "version": "$1"
  },
  {
    "regex": "HFEducationIOS/([\\d.]+)",
    "name": "HeartFocus Education",
    "version": "$1"
  },
  {
    "regex": "OpenVAS-VT ([\\d.]+)",
    "name": "OpenVAS",
    "version": "$1"
  },
  {
    "regex": "appdb/([\\d.]+)",
    "name": "appdb",
    "version": "$1"
  },
  {
    "regex": "Apache/([\\d.]+)",
    "name": "Apache",
    "version": "$1"
  },
  {
    "regex": " (?!(?:AppleWebKit|brave|Cypress|Franz|Mailspring|Notion|Basecamp|Evernote|catalyst|ramboxpro|BlueMail|BeakerBrowser|Dezor|TweakStyle|Colibri|Polypane|Singlebox|Skye|VibeMate|(?:d|LT|Glass|Sushi|Flash|OhHai)Browser|Sizzy))([a-z0-9]*)(?:-desktop|-electron-app)?/(\\d+\\.[\\d.]+).*Electron/",
    "name": "$1",
    "version": "$2"
  },
  {
    "regex": "appname/([^/; ]*)",
    "name": "$1",
    "version": ""
  },
  {
    "regex": "(?!AlohaBrowser)([^/;]*)/(\\d+\\.[\\d.]+) \\((?:iPhone|iPad); (?:iOS|iPadOS) [0-9.]+; Scale/[0-9.]+\\)",
    "name": "$1",
    "version": "$2"
  }
];

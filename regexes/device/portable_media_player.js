module.exports = {
  "Apple": {
    "regex": "(?:Apple-)?iPod",
    "device": "portable media player",
    "models": [
      {
        "regex": "(?:Apple-)?iPod1[C,_]?1",
        "model": "iPod Touch 1G"
      },
      {
        "regex": "(?:Apple-)?iPod2[C,_]?1",
        "model": "iPod Touch 2G"
      },
      {
        "regex": "(?:Apple-)?iPod3[C,_]?1",
        "model": "iPod Touch 3"
      },
      {
        "regex": "(?:Apple-)?iPod4[C,_]?1",
        "model": "iPod Touch 4"
      },
      {
        "regex": "(?:Apple-)?iPod5[C,_]?1",
        "model": "iPod Touch 5"
      },
      {
        "regex": "(?:Apple-)?iPod7[C,_]?1",
        "model": "iPod Touch 6"
      },
      {
        "regex": "(?:Apple-)?iPod9[C,_]?1|iPodTouch7",
        "model": "iPod Touch 7"
      },
      {
        "regex": "(?:Apple-)?iPod",
        "model": "iPod Touch"
      }
    ]
  },
  "Cowon": {
    "regex": "COWON ([^;/]+) Build",
    "device": "portable media player",
    "model": "$1"
  },
  "FiiO": {
    "regex": "FiiO",
    "device": "portable media player",
    "models": [
      {
        "regex": "M11 Plus LTD",
        "model": "M11 Plus LTD"
      },
      {
        "regex": "FiiO M(11S|1[157]|6)",
        "model": "M$1"
      }
    ]
  },
  "Microsoft": {
    "regex": "Microsoft ZuneHD",
    "device": "portable media player",
    "model": "Zune HD"
  },
  "Panasonic": {
    "regex": "(SV-MV100)",
    "device": "portable media player",
    "model": "$1"
  },
  "Samsung": {
    "regex": "YP-(G[SIPB]?1|G[57]0|GB70D)",
    "device": "portable media player",
    "models": [
      {
        "regex": "YP-G[B]?1",
        "model": "Galaxy Player 4.0"
      },
      {
        "regex": "YP-G70",
        "model": "Galaxy Player 5.0"
      },
      {
        "regex": "YP-GS1",
        "model": "Galaxy Player 3.6"
      },
      {
        "regex": "YP-GI1",
        "model": "Galaxy Player 4.2"
      },
      {
        "regex": "YP-GP1",
        "model": "Galaxy Player 5.8"
      },
      {
        "regex": "YP-G50",
        "model": "Galaxy Player 50"
      },
      {
        "regex": "YP-GB70D",
        "model": "Galaxy Player 70 Plus"
      }
    ]
  },
  "Wizz": {
    "regex": "(DV-PTB1080)(?:[);/ ]|$)",
    "device": "portable media player",
    "model": "$1"
  },
  "Shanling": {
    "regex": "Shanling M6",
    "device": "portable media player",
    "models": [
      {
        "regex": "Shanling (M6\\(21\\))",
        "model": "$1"
      }
    ]
  },
  "Sylvania": {
    "regex": "(SLTDVD102[34])",
    "device": "portable media player",
    "model": "$1"
  },
  "KuGou": {
    "regex": "KuGou[_ -](P5)",
    "device": "portable media player",
    "model": "$1"
  },
  "Surfans": {
    "regex": "(Y57A)(?:[);/ ]|$)",
    "device": "portable media player",
    "model": "$1"
  },
  "Oilsky": {
    "regex": "Oilsky (M501|M303)(?:-Pro)?(?:[);/ ]|$)",
    "device": "portable media player",
    "models": [
      {
        "regex": "M303-Pro",
        "model": "M303 Pro"
      },
      {
        "regex": "(M501|M303)",
        "model": "$1"
      }
    ]
  },
  "Diofox": {
    "regex": "Diofox[ _](M8|M10|M508)(?:[);/ ]|$)",
    "device": "portable media player",
    "model": "$1"
  },
  "MECHEN": {
    "regex": "MECHEN",
    "device": "portable media player",
    "models": [
      {
        "regex": "MECHEN[- _]([^;/)]+)[- _]Pro(?: Build|[);])",
        "model": "$1 Pro"
      },
      {
        "regex": "MECHEN[- _]([^;/)]+)(?: Build|[);])",
        "model": "$1"
      }
    ]
  }
};

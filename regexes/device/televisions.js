module.exports = {
  "Airties": {
    "regex": "Airties",
    "device": "tv",
    "models": [
      {
        "regex": "Airties; ?([^);/]+)",
        "model": "$1"
      }
    ]
  },
  "ALDI NORD": {
    "regex": "ALDINORD[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "ALDI SÜD": {
    "regex": "ALDISUED[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "ALDISUED, ([a-z0-9_ -]+), (?:wired|wireless)",
        "model": ""
      },
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Altech UEC": {
    "regex": "Altech UEC",
    "device": "tv",
    "models": [
      {
        "regex": "Altech UEC; ?([^);/]+)",
        "model": "$1"
      }
    ]
  },
  "Altimo": {
    "regex": "ALTIMO[;,]",
    "device": "tv",
    "model": ""
  },
  "Altus": {
    "regex": "Altus[;,)]",
    "device": "tv",
    "model": ""
  },
  "Amazon": {
    "regex": "Amazon.+AMZ",
    "device": "tv",
    "models": [
      {
        "regex": "Amazon.+AMZ-([a-z0-9_ -]+)_Build_",
        "model": "$1"
      }
    ]
  },
  "andersson": {
    "regex": "ANDERSSON[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "AOC": {
    "regex": "AOC",
    "device": "tv",
    "models": [
      {
        "regex": "(LE(?:32|43)S5970(?:s)?-(?:20|28|30)|LE55U7970-30|LE43S5977-20|U60856|S50856)",
        "model": "$1"
      },
      {
        "regex": "AOC;([a-z0-9_ \\-/]+);",
        "model": "$1"
      }
    ]
  },
  "ARRIS": {
    "regex": "ARRIS[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "FS-ARS-01B",
        "model": "FS-ARS-01B"
      }
    ]
  },
  "Atlantic Electrics": {
    "regex": "ATLANTIC[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Atvio": {
    "regex": "ATVIO",
    "device": "tv",
    "models": [
      {
        "regex": "55D1620",
        "model": "55D1620"
      }
    ]
  },
  "AWOX": {
    "regex": "LGE/XianYou/AWOX",
    "device": "tv",
    "models": [
      {
        "regex": "LGE/XianYou/AWOX; ([a-z0-9]+);",
        "model": "$1"
      }
    ]
  },
  "AYA": {
    "regex": "AYA[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "BangOlufsen": {
    "regex": "Bangolufsen",
    "device": "tv",
    "model": "BeoVision"
  },
  "Beko": {
    "regex": "Beko[;,)]",
    "device": "tv",
    "model": ""
  },
  "Blaupunkt": {
    "regex": "Blaupunkt_UMC[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "LC-65CUG8052E",
        "model": "LC-65CUG8052E"
      }
    ]
  },
  "Botech": {
    "regex": "Botech[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "(ATV R[12])",
        "model": "$1"
      }
    ]
  },
  "Bush": {
    "regex": "BUSH[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Cecotec": {
    "regex": "CECOTEC[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Celcus": {
    "regex": "CELCUS[;,)]",
    "device": "tv",
    "model": ""
  },
  "Changhong": {
    "regex": "Changhong",
    "device": "tv",
    "models": [
      {
        "regex": "Changhong; ?([^);/]+)",
        "model": "$1"
      }
    ]
  },
  "CLAYTON": {
    "regex": "CLAYTON[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Continental Edison": {
    "regex": "CONTINENTAL_EDI[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "coocaa": {
    "regex": "coocaa[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "coocaa; ([a-z0-9]+);",
        "model": "$1"
      }
    ]
  },
  "CreNova": {
    "regex": "CreNova",
    "device": "tv",
    "model": "CNV001"
  },
  "Crown": {
    "regex": "CROWN[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Cultraview": {
    "regex": "Cultraview690[;,]",
    "device": "tv",
    "models": [
      {
        "regex": "LaTivu_(?:\\d+[.\\d]+)_([0-9]{4})",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Daewoo": {
    "regex": "Daewoo[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Digihome": {
    "regex": "DIGIHOME[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "DIKOM": {
    "regex": "DIKOM[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "DIORA": {
    "regex": "DIORA[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "DMM": {
    "regex": "DMM",
    "device": "tv",
    "model": "Dreambox"
  },
  "Elektroland": {
    "regex": "ELEKTROLAND[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "ELECTRONIA": {
    "regex": "ELECTRONIA[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Essentielb": {
    "regex": "ESSENTIELB[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Express LUCK": {
    "regex": "Expressluck[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "([24]K)TV",
        "model": "$1 TV"
      }
    ]
  },
  "FINIX": {
    "regex": "FINIX[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Finlux": {
    "regex": "FINLUX[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "FITCO": {
    "regex": "FITCO, ([a-z0-9_ -]+), (?:wired|wireless)",
    "device": "tv",
    "model": ""
  },
  "F&U": {
    "regex": "FU[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Fuego": {
    "regex": "FUEGO[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "FUJICOM": {
    "regex": "FUJICOM[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "GN Electronics": {
    "regex": "GN_ELECTRONICS[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "GoGEN": {
    "regex": "GOGEN[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Graetz": {
    "regex": "GRAETZ[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Grundig": {
    "regex": "(OWB|(?:Amazon.+)?Grundig)",
    "device": "tv",
    "models": [
      {
        "regex": "G7",
        "model": "G7"
      },
      {
        "regex": "Amazon.+Grundig-([a-z0-9_ -]+)_Build_",
        "model": "$1"
      }
    ]
  },
  "Haier": {
    "regex": "(?:HHW_)?HAIER",
    "device": "tv",
    "models": [
      {
        "regex": "LE55X7000U",
        "model": "LE55X7000U"
      }
    ]
  },
  "Hanseatic": {
    "regex": "HANSEATIC[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Hi-Level": {
    "regex": "HI-LEVEL[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Hisense": {
    "regex": "Hisense|Eurofins_Digital_Testing",
    "device": "tv",
    "models": [
      {
        "regex": "32A35EEVS",
        "model": "32A35EEVS"
      },
      {
        "regex": "40A35EEVS",
        "model": "40A35EEVS"
      },
      {
        "regex": "50ADEVTOOL",
        "model": "50ADEVTOOL"
      },
      {
        "regex": "50A53FEVS",
        "model": "50A53FEVS"
      },
      {
        "regex": "50A6101EX",
        "model": "50A6101EX"
      },
      {
        "regex": "50A683FEVS",
        "model": "50A683FEVS"
      },
      {
        "regex": "55A6100EE",
        "model": "55A6100EE"
      },
      {
        "regex": "55A69FEVS",
        "model": "55A69FEVS"
      },
      {
        "regex": "55U62QGAVT",
        "model": "55U62QGAVT"
      },
      {
        "regex": "50A6502EA",
        "model": "50A6502EA"
      },
      {
        "regex": "50A60GEVS",
        "model": "50A60GEVS"
      },
      {
        "regex": "75U9KAAT",
        "model": "75U9KAAT"
      },
      {
        "regex": "MICALIDVB6886",
        "model": "MICALIDVB6886"
      },
      {
        "regex": "(L[A-Z]{2,3}[0-9]{2}[A-Z][0-9]{3,4}[A-Z]{0,6}[0-9]?[A-Z]?)",
        "model": "$1"
      },
      {
        "regex": "(H[A-Z]?[0-9]{2}[A-Z][0-9]{3,4}[A-Z]{0,4})",
        "model": "$1"
      },
      {
        "regex": "SmartTV_([0-9]{4})_",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Hitachi": {
    "regex": "Hitachi[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "49D2900",
        "model": "49D2900"
      },
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "HOFER": {
    "regex": "HOFER[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Horizon": {
    "regex": "HORIZON[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Hotel": {
    "regex": "HOTEL[;,)]",
    "device": "tv",
    "model": ""
  },
  "Humax": {
    "regex": "Humax|hdr1000s",
    "device": "tv",
    "models": [
      {
        "regex": "(HD-FOX C|HD (FOX\\+|NANO)|iCord (HD\\+|MINI|Cable)|(CX|IR)HD-5100(C|S)|HM9503HD)",
        "model": "$1"
      },
      {
        "regex": "HMS1000S",
        "model": "HMS-1000S"
      },
      {
        "regex": "FVP4000T",
        "model": "FVP-4000T"
      },
      {
        "regex": "HGS1000S",
        "model": "HGS-1000S"
      },
      {
        "regex": "HDR1000S",
        "model": "HDR-1000S"
      },
      {
        "regex": "HDR4000T",
        "model": "HDR-4000T"
      },
      {
        "regex": "Humax; ([^);/]+)",
        "model": "$1"
      }
    ]
  },
  "HUMElab": {
    "regex": "HUMELAB[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Hyundai": {
    "regex": "HYUNDAI[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Ikea": {
    "regex": "Ikea",
    "device": "tv",
    "model": ""
  },
  "Intek": {
    "regex": "Intek",
    "device": "tv",
    "models": [
      {
        "regex": "(Vantage|VT-100|VT-1)",
        "model": "$1"
      }
    ]
  },
  "Inverto": {
    "regex": "Inverto",
    "device": "tv",
    "models": [
      {
        "regex": "inverto; ([^);/]+)",
        "model": "$1"
      },
      {
        "regex": "(Volksbox Web Edition|Volksbox Essential|Volksbox II|Volksbox)",
        "model": "$1"
      }
    ]
  },
  "JVC": {
    "regex": "AFTSO001|JVC[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "AFTSO001",
        "model": "4K (2019)"
      },
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Kalley": {
    "regex": "KALLEY[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "32D1620",
        "model": "32D1620"
      }
    ]
  },
  "Kendo": {
    "regex": "KENDO[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "KUBO": {
    "regex": "KUBO[;,)]",
    "device": "tv",
    "model": ""
  },
  "Laurus": {
    "regex": "LAURUS[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Lenco": {
    "regex": "LENCO[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Aiwa": {
    "regex": "LGE/SQY/RCA",
    "device": "tv",
    "models": [
      {
        "regex": "LGE/SQY/RCA; ([a-z0-9]+);",
        "model": "$1"
      }
    ]
  },
  "AXEN": {
    "regex": "LGE/ATMACA/AXEN",
    "device": "tv",
    "models": [
      {
        "regex": "LGE/ATMACA/AXEN; ([a-z0-9]+)-",
        "model": "$1"
      }
    ]
  },
  "Dyon": {
    "regex": "LGE/KONKA/DYON",
    "device": "tv",
    "models": [
      {
        "regex": "SMART-32-X-EOS",
        "model": "Smart 32 X-EOS"
      }
    ]
  },
  "EAS Electric": {
    "regex": "EAS_ELECTRIC[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Edenwood": {
    "regex": "EDENWOOD[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "ONVO": {
    "regex": "(?:SILICONPLAYER|XianYou)/ONVO",
    "device": "tv",
    "models": [
      {
        "regex": "(?:SILICONPLAYER|XianYou)/ONVO; ([a-z0-9]+);",
        "model": "$1"
      }
    ]
  },
  "DIJITSU": {
    "regex": "LGE/SILICONPLAYER/DIJITSU",
    "device": "tv",
    "models": [
      {
        "regex": "LGE/SILICONPLAYER/DIJITSU; ([a-z0-9]+);",
        "model": "$1"
      }
    ]
  },
  "simfer": {
    "regex": "LGE/WALTON/SIMFER",
    "device": "tv",
    "models": [
      {
        "regex": "LGE/WALTON/SIMFER; ([a-z0-9]+);",
        "model": "$1"
      }
    ]
  },
  "Sunny": {
    "regex": "(?:ATMACA|XianYou)/SUNNY",
    "device": "tv",
    "models": [
      {
        "regex": "(?:ATMACA|XianYou)/SUNNY; ([a-z0-9]+)-",
        "model": "$1"
      },
      {
        "regex": "(?:ATMACA|XianYou)/SUNNY.+(2018)\\)",
        "model": "Smart TV ($1)"
      },
      {
        "regex": "(?:ATMACA|XianYou)/SUNNY;",
        "model": "Smart TV"
      }
    ]
  },
  "Kydos": {
    "regex": "KYDOS[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Skytech": {
    "regex": "LGE/WALTON/SKYTECH",
    "device": "tv",
    "models": [
      {
        "regex": "LGE/WALTON/SKYTECH; ([a-z0-9-]+);",
        "model": "$1"
      }
    ]
  },
  "LG": {
    "regex": "LGE ?;",
    "device": "tv",
    "models": [
      {
        "regex": "XU43WT180N",
        "model": "XU43WT180N"
      },
      {
        "regex": "43LJ614V-ZA",
        "model": "43LJ614V-ZA"
      },
      {
        "regex": "55SK850V-ZA",
        "model": "55SK850V-ZA"
      },
      {
        "regex": "KEY0000213F1z",
        "model": "KEY0000213F1z"
      },
      {
        "regex": "KEY0000213F",
        "model": "KEY0000213F"
      },
      {
        "regex": "KEY000000(2E|2F|3B|3F)",
        "model": "KEY000000$1"
      },
      {
        "regex": "(NetCast [0-9]{1}\\.[0-9]{1}|GLOBAL_PLAT3)",
        "model": "$1"
      },
      {
        "regex": "(OLED[0-9]{2}[A-Z0-9]{3}[A-Z]{2})",
        "model": "$1"
      },
      {
        "regex": "(OLED[0-9]{2}[A-Z][0-9][A-Z](?:-Z)?)",
        "model": "$1"
      },
      {
        "regex": "(OLED[0-9]{2}[A-Z0-9]{2})",
        "model": "$1"
      },
      {
        "regex": "([0-9]{2}[A-Z]{2}[0-9]{4}[A-Z0-9]{1}[A-Z]{2})",
        "model": "$1"
      },
      {
        "regex": "([0-9]{2}NANO[0-9]{3}[A-Z]{2})",
        "model": "$1"
      },
      {
        "regex": "([0-9]{2}NANO[0-9]{2})",
        "model": "$1"
      },
      {
        "regex": "LGE;? (?:HOTEL\\-TV; )?([0-9]{2}[a-z0-9]{4,9}(?:\\-[a-z]{2,3})?)",
        "model": "$1"
      },
      {
        "regex": "LGE;? ?([0-9]{2}[A-Z]{2}[0-9]{2,4}[A-Z]?)",
        "model": "$1"
      },
      {
        "regex": "LGE;? ?([0-9]{2}QNED[0-9]{3}[A-Z]{2})",
        "model": "$1"
      },
      {
        "regex": "LM21U",
        "model": "LM21U"
      },
      {
        "regex": "32LM",
        "model": "32LM"
      }
    ]
  },
  "Lifemaxx": {
    "regex": "Lifemaxx[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Linsar": {
    "regex": "LINSAR[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Loewe": {
    "regex": "Loewe",
    "device": "tv",
    "models": [
      {
        "regex": "40A35EEVS",
        "model": "40A35EEVS"
      },
      {
        "regex": "50A683FEVS",
        "model": "50A683FEVS"
      },
      {
        "regex": "([A-Z]{2}[0-9]{3})",
        "model": "$1"
      }
    ]
  },
  "Logik": {
    "regex": "DIXONS-LOGIK[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Luxor": {
    "regex": "LUXOR[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Manhattan": {
    "regex": "Manhattan",
    "device": "tv",
    "models": [
      {
        "regex": "T3",
        "model": "T3"
      }
    ]
  },
  "Medion": {
    "regex": "Medion",
    "device": "tv",
    "models": [
      {
        "regex": "MEDION, ([a-z0-9_ -]+), (?:wired|wireless)",
        "model": ""
      },
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "MEGA VISION": {
    "regex": "MEGA_VISION[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Miray": {
    "regex": "MIRAY",
    "device": "tv",
    "models": [
      {
        "regex": "LEDM-322NIP",
        "model": "LEDM-322NIP"
      }
    ]
  },
  "Mitchell & Brown": {
    "regex": "MITCHELL_BROWN[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "MStar": {
    "regex": "MStar[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "([24])KTV18",
        "model": "$1KTV18"
      }
    ]
  },
  "MTC": {
    "regex": "MTC[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "([24])K_Android_TV_V01",
        "model": "$1K Android TV"
      }
    ]
  },
  "NABO": {
    "regex": "NABO[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Neo": {
    "regex": "NEO, ([a-z0-9_ -]+), (?:wired|wireless)",
    "device": "tv",
    "model": ""
  },
  "NEXON": {
    "regex": "NEXON[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "NEXT": {
    "regex": "NEXT[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Nokia": {
    "regex": "NOKIA[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Nordmende": {
    "regex": "NORDMENDE[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Metz": {
    "regex": "Metz",
    "device": "tv",
    "models": [
      {
        "regex": "Metz; ([a-z0-9]+);",
        "model": "$1"
      }
    ]
  },
  "NORMANDE": {
    "regex": "NORMANDE[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "OCEANIC": {
    "regex": "OCEANIC[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "ok.": {
    "regex": "OK[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Orava": {
    "regex": "ORAVA[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Panasonic": {
    "regex": "Panasonic",
    "device": "tv",
    "models": [
      {
        "regex": "TX-50JX700E",
        "model": "TX-50JX700E"
      },
      {
        "regex": "VIERA (201[1-9])",
        "model": "VIERA ($1)"
      },
      {
        "regex": "(DIGA [A-Z]{1}[0-9]{4})",
        "model": "$1"
      },
      {
        "regex": "DIGA Webkit ([A-Z]{1}[0-9]{4})",
        "model": "DIGA $1"
      },
      {
        "regex": "SmartTV(201[89]|202[0-2])",
        "model": "Smart TV ($1)"
      },
      {
        "regex": "Panasonic\\..+\\.([0-9]{4})(?:[);/ ]|$)",
        "model": "Smart TV ($1)"
      },
      {
        "regex": "Panasonic;Viera([0-9]{4});",
        "model": "Smart TV ($1)"
      },
      {
        "regex": "_TV_[A-Z0-9_]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "PEAQ": {
    "regex": "PEAQ",
    "device": "tv",
    "model": ""
  },
  "TCL SCBC": {
    "regex": "SCBC[;,)]|_TV_[A-Z0-9_]+_TCL_SCBC",
    "device": "tv",
    "models": [
      {
        "regex": "SCBC586",
        "model": "SCBC586"
      },
      {
        "regex": "43D1850",
        "model": "43D1850"
      },
      {
        "regex": "_TV_[A-Z0-9]+_TCL_SCBC_Tbrowser_2k20",
        "model": "Smart TV (2020)"
      }
    ]
  },
  "Philips": {
    "regex": "Philips|NETTV/",
    "device": "tv",
    "models": [
      {
        "regex": "(?:Philips|TPVision)[,;](?: |Philips;)?((?! )[^),;]+)",
        "model": "$1"
      },
      {
        "regex": "NETTV/[0-9.]{5}",
        "model": "NetTV Series"
      }
    ]
  },
  "Polaroid": {
    "regex": "POLAROID[;,)]",
    "device": "tv",
    "model": ""
  },
  "PROFiLO": {
    "regex": "PROFILO[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "Profilo[,;] ?((?! |HbbTV|MB130)[^),;/]+)",
        "model": "$1"
      },
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "PROSONIC": {
    "regex": "PROSONIC[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Qilive": {
    "regex": "QILIVE[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "RCA Tablets": {
    "regex": "RCA;",
    "device": "tv",
    "models": [
      {
        "regex": "RCA; ([a-z0-9]+);",
        "model": "$1"
      }
    ]
  },
  "REGAL": {
    "regex": "REGAL[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Saba": {
    "regex": "Saba[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Salora": {
    "regex": "Salora(?:_cx)?[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Samsung": {
    "regex": "Samsung|Maple_2011",
    "device": "tv",
    "models": [
      {
        "regex": "SmartTV(201[2-9]|202[0-4]):([^);/]+)",
        "model": "$2"
      },
      {
        "regex": "SmartTV(201[2-9]|202[0-4])",
        "model": "Smart TV ($1)"
      },
      {
        "regex": "Maple_2011",
        "model": "Smart TV (2011)"
      }
    ]
  },
  "SEG": {
    "regex": "SEG[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "SEHMAX": {
    "regex": "SEHMAX[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Selevision": {
    "regex": "Selevision",
    "device": "tv",
    "models": [
      {
        "regex": "Selevision; (?:Selevision )?([^);/]+)",
        "model": "$1"
      },
      {
        "regex": "(EMC1000i)",
        "model": "$1"
      }
    ]
  },
  "Sharp": {
    "regex": "(?:UMC-)?Sharp",
    "device": "tv",
    "models": [
      {
        "regex": "SHARP, ([a-z0-9_ -]+), (?:wired|wireless)",
        "model": ""
      },
      {
        "regex": "Sharp[,;] ?((?! |HbbTV|MB130)[^),;/]+)",
        "model": "$1"
      },
      {
        "regex": "(LE[0-9]{3}[A-Z]{0,3})",
        "model": "$1"
      },
      {
        "regex": "LC-([^);/,]+)",
        "model": "LC-$1"
      },
      {
        "regex": "BLA-43",
        "model": "BLA-43"
      },
      {
        "regex": "UMC_2KAndroidTV_2019",
        "model": "2K Android TV"
      },
      {
        "regex": "UMC_AndroidTV_2021",
        "model": "Android TV"
      },
      {
        "regex": "UMC_GoogleTV_2019",
        "model": "Google TV"
      }
    ]
  },
  "Silva Schneider": {
    "regex": "SILVA_SCHNEIDER[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Skyworth": {
    "regex": "Sky_?worth|SKW690|SWTV[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "SKWE20E21",
        "model": "SKWE20E21"
      },
      {
        "regex": "Sky_worth;([^);/]+)",
        "model": "$1"
      },
      {
        "regex": "LaTivu_(?:\\d+[.\\d]+)_([0-9]{4})",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Smart Electronic": {
    "regex": "Smart[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "Smart; ([^);/]+)",
        "model": "$1"
      },
      {
        "regex": "([A-Z]{2}[0-9]{2}|ZAPPIX)",
        "model": "$1"
      }
    ]
  },
  "Solas": {
    "regex": "SOLAS[;,]",
    "device": "tv",
    "model": ""
  },
  "Sony": {
    "regex": "Sony",
    "device": "tv",
    "models": [
      {
        "regex": "(KDL-GR[12])",
        "model": "$1"
      },
      {
        "regex": "KDL-GN([56])",
        "model": "KDL-GN$1"
      },
      {
        "regex": "BRAVIA (VH1|4K VH2)",
        "model": "BRAVIA $1"
      },
      {
        "regex": "(K[DM]L?-?[0-9]{2}[A-Z]{1}[0-9]{4}[A-Z]{1})",
        "model": "$1"
      },
      {
        "regex": "(K[DM]L?-?[0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]{1})",
        "model": "$1"
      },
      {
        "regex": "(K[DM]L?-?[0-9]{2}[A-Z]{1,2}[0-9]{1,5})",
        "model": "$1"
      }
    ]
  },
  "TD Systems": {
    "regex": "TDSystems[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "SmartTV(2019|2020)",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Technicolor": {
    "regex": "Technicolor",
    "device": "tv",
    "models": [
      {
        "regex": "uzw4054ttg",
        "model": "UZW4054TTG"
      }
    ]
  },
  "Technika": {
    "regex": "TECHNIKA[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "TechniSat": {
    "regex": "TechniSat",
    "device": "tv",
    "models": [
      {
        "regex": "((DigiCorder|MultyVision|Digit) (ISIO S|ISIO C|ISIO))",
        "model": "$1"
      },
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "TechnoTrend": {
    "regex": "TechnoTrend",
    "device": "tv",
    "models": [
      {
        "regex": "([A-Z]{1}-[0-9]{3})",
        "model": "$1"
      }
    ]
  },
  "Techwood": {
    "regex": "Techwood[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Telefunken": {
    "regex": "Telefunken",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "TCL": {
    "regex": "(?:Amazon.+)?TCL",
    "device": "tv",
    "models": [
      {
        "regex": "(32D1820|(?:39|55)D2900|32D2930|(?:32|43)S4900)",
        "model": "$1"
      },
      {
        "regex": "TCL[,;] ?((?! |HbbTV|MB130)[^),;/]+)",
        "model": "$1"
      },
      {
        "regex": "Amazon.+TCL-([a-z0-9_ -]+)_Build_",
        "model": "$1"
      }
    ]
  },
  "Thomson": {
    "regex": "THOMSON[,]?|THOM",
    "device": "tv",
    "models": [
      {
        "regex": "(TB28D19DHS-01|T28D18SFS-01B)",
        "model": "$1 28.0\""
      },
      {
        "regex": "(T32RTM5040|T32D18SFS-01B)",
        "model": "$1 32.0\""
      },
      {
        "regex": "(T43FSL5031|T43D18SFS-01B)",
        "model": "$1 43.0\""
      },
      {
        "regex": "(T40D18SFS-01B)",
        "model": "$1 40.0\""
      },
      {
        "regex": "(T49D18SFS-01B)",
        "model": "$1 49.0\""
      },
      {
        "regex": "(T55D18[SD]FS-01B)",
        "model": "$1 55.0\""
      },
      {
        "regex": "40FB5426",
        "model": "40FB5426"
      }
    ]
  },
  "TOKYO": {
    "regex": "TOKYO[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "TOKTCLED32S",
        "model": "TOKTCLED32S"
      }
    ]
  },
  "TUCSON": {
    "regex": "TUCSON[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Turbo-X": {
    "regex": "TURBO-X[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Top-Tech": {
    "regex": "Toptech690[;,]",
    "device": "tv",
    "models": [
      {
        "regex": "LaTivu_(?:\\d+[.\\d]+)_([0-9]{4})",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Toshiba": {
    "regex": "(?:Amazon.+)?Toshiba",
    "device": "tv",
    "models": [
      {
        "regex": "40L2600",
        "model": "40L2600"
      },
      {
        "regex": "(([0-9]{2}|DTV_)[A-Z]{2}[0-9]{1,3})",
        "model": "$1"
      },
      {
        "regex": "Amazon.+Toshiba-([a-z0-9_ -]+)_Build_",
        "model": "$1"
      },
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Tsinghua Tongfang": {
    "regex": "THTF_CVTE[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "LE40GY15",
        "model": "LE40GY15"
      }
    ]
  },
  "UNITED": {
    "regex": "UNITED[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "VANGUARD": {
    "regex": "VANGUARD[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Videoweb": {
    "regex": "videoweb|tv2n",
    "device": "tv",
    "models": [
      {
        "regex": "(tv2n)",
        "model": "$1"
      },
      {
        "regex": "(videowebtv)",
        "model": "VideoWeb TV"
      }
    ]
  },
  "VOX": {
    "regex": "VOX[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Walker": {
    "regex": "WALKER[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "We. by Loewe.": {
    "regex": "WeByLoewe[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "40A35EEVS",
        "model": "40A35EEVS"
      },
      {
        "regex": "43A71FEVS",
        "model": "43A71FEVS"
      },
      {
        "regex": "50A683FEVS",
        "model": "50A683FEVS"
      }
    ]
  },
  "WELLINGTON": {
    "regex": "WELLINGTON[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "WONDER": {
    "regex": "WONDER[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "X.Vision": {
    "regex": "X-VISION[;,)]",
    "device": "tv",
    "model": ""
  },
  "Vestel": {
    "regex": "(?:Vestel.+VESTEL|(?:BBC_CUSTOMERS|VESTEL)[;,)])",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      }
    ]
  },
  "Arçelik": {
    "regex": "Arcelik",
    "device": "tv",
    "model": ""
  },
  "XGEM": {
    "regex": "XGEM[;,)]",
    "device": "tv",
    "models": [
      {
        "regex": "XGEM[;,)] ?([a-z0-9]+)(?:[);/ ]|$)",
        "model": "$1"
      }
    ]
  },
  "Xiaomi": {
    "regex": "Amazon.+Xiaomi",
    "device": "tv",
    "models": [
      {
        "regex": "AFTANNA0",
        "model": "F2 4K (2022)"
      },
      {
        "regex": "Amazon.+Xiaomi-([a-z0-9_ -]+)_Build_",
        "model": "$1"
      }
    ]
  },
  "Unknown": {
    "regex": "OEM, ([a-z0-9_ -]+), (?:wired|wireless)|_TV_[A-Z0-9]+_([0-9]{4});|LaTivu_(?:\\d+[.\\d]+)_([0-9]{4})",
    "device": "tv",
    "models": [
      {
        "regex": "_TV_[A-Z0-9]+_([0-9]{4});",
        "model": "Smart TV ($1)"
      },
      {
        "regex": "LaTivu_(?:\\d+[.\\d]+)_([0-9]{4})",
        "model": "Smart TV ($1)"
      }
    ]
  }
};

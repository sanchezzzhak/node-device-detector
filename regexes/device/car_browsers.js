module.exports = {
  "BMW": {
    "regex": "AFTLBT962E2(?:[);/ ]|$)",
    "device": "car browser",
    "models": [
      {
        "regex": "AFTLBT962E2(?:[);/ ]|$)",
        "model": "Car (2022)"
      }
    ]
  },
  "Jeep": {
    "regex": "AFTLFT962X3(?:[);/ ]|$)",
    "device": "car browser",
    "models": [
      {
        "regex": "AFTLFT962X3(?:[);/ ]|$)",
        "model": "Wagoneer"
      }
    ]
  },
  "Tesla": {
    "regex": "(?:Tesla/(?:(?:develop|feature|terminal-das-fsd-eap)-)?[0-9.]+|QtCarBrowser)",
    "device": "car browser",
    "models": [
      {
        "regex": "QtCarBrowser",
        "model": "Model S"
      },
      {
        "regex": "Tesla/[0-9.]+",
        "model": ""
      }
    ]
  },
  "MAC AUDIO": {
    "regex": "Mac Audio Spro",
    "device": "car browser",
    "models": [
      {
        "regex": "Spro",
        "model": "S Pro"
      }
    ]
  },
  "Topway": {
    "regex": "sp9853i_1h10_vmm",
    "device": "car browser",
    "models": [
      {
        "regex": "sp9853i_1h10_vmm",
        "model": "TS9"
      }
    ]
  }
};

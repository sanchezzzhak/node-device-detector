module.exports = {
  "Nikon": {
    "regex": "Coolpix S800c",
    "device": "camera",
    "model": "Coolpix S800c"
  },
  "Samsung": {
    "regex": "EK-G[CN][0-9]{3}",
    "device": "camera",
    "models": [
      {
        "regex": "EK-GN120",
        "model": "Galaxy NX"
      },
      {
        "regex": "EK-GC100",
        "model": "Galaxy Camera"
      },
      {
        "regex": "EK-GC110",
        "model": "Galaxy Camera WiFi only"
      },
      {
        "regex": "EK-GC200",
        "model": "Galaxy Camera 2"
      },
      {
        "regex": "EK-GC([0-9]{3})",
        "model": "Galaxy Camera $1"
      }
    ]
  }
};

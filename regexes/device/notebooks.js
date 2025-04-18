module.exports = {
  "Acer": {
    "regex": "FBMD/(?:Aspire E5-421G|Z5WAL|One S1003);",
    "device": "desktop",
    "models": [
      {
        "regex": "FBMD/Aspire E5-421G;",
        "model": "Aspire E5-421G"
      },
      {
        "regex": "FBMD/Z5WAL;",
        "model": "Aspire E5-511"
      },
      {
        "regex": "FBMD/One S1003;",
        "model": "One 10"
      }
    ]
  },
  "Asus": {
    "regex": "FBMD/(?:K50IN|K54L|T100HAN|T103HAF|UX360CAK|X550LB|X553MA|X555LN|X556UQK);",
    "device": "desktop",
    "models": [
      {
        "regex": "FBMD/K50IN;",
        "model": "K50IN"
      },
      {
        "regex": "FBMD/K54L;",
        "model": "K54L"
      },
      {
        "regex": "FBMD/T100HAN;",
        "model": "Transformer Book"
      },
      {
        "regex": "FBMD/T103HAF;",
        "model": "Transformer Mini"
      },
      {
        "regex": "FBMD/UX360CAK;",
        "model": "ZenBook Flip"
      },
      {
        "regex": "FBMD/X550LB;",
        "model": "X550LB"
      },
      {
        "regex": "FBMD/X553MA;",
        "model": "X553MA"
      },
      {
        "regex": "FBMD/X555LN;",
        "model": "X555LN"
      },
      {
        "regex": "FBMD/X556UQK;",
        "model": "X556UQK"
      }
    ]
  },
  "Alienware": {
    "regex": "FBMD/(?:Alienware [0-9]{2,3}R[0-9]{1,2}|Area-51m|R3|R4|Alienware Aurora R[0-9]+(:? [0-9]+)?);",
    "device": "desktop",
    "models": [
      {
        "regex": "Alienware 15R3;",
        "model": "Alienware 15 R3"
      },
      {
        "regex": "Alienware 17R4;",
        "model": "Alienware 17 R4"
      },
      {
        "regex": "Area-51m;",
        "model": "Area-51m"
      },
      {
        "regex": "Aurora (R[0-9]+)",
        "model": "Aurora $1"
      }
    ]
  },
  "Dell": {
    "regex": "FBMD/(?:Latitude E4300|Inspiron 3541|XPS 15 95[35]0);",
    "device": "desktop",
    "models": [
      {
        "regex": "Latitude E4300",
        "model": "Latitude E4300"
      },
      {
        "regex": "Inspiron 3541",
        "model": "Inspiron 3541"
      },
      {
        "regex": "XPS 15 9530",
        "model": "XPS 15 9530"
      },
      {
        "regex": "XPS 15 9550",
        "model": "XPS 15 9550"
      }
    ]
  },
  "HP": {
    "regex": "FBMD/((?:Compaq|HP) |23-f364)",
    "device": "desktop",
    "models": [
      {
        "regex": "Compaq Presario CQ61 Notebook PC",
        "model": "Compaq Presario CQ61"
      },
      {
        "regex": "HP Pavilion x2 Detachable",
        "model": "Pavilion x2"
      },
      {
        "regex": "HP Laptop 15-bs0xx",
        "model": "15 Laptop PC"
      },
      {
        "regex": "HP ENVY x360 Convertible 15-bp0xx",
        "model": "ENVY x360 Convertible PC"
      },
      {
        "regex": "HP EliteBook (25[67]0p)",
        "model": "EliteBook $1"
      },
      {
        "regex": "HP ProBook (440 G5|6[35]60b)",
        "model": "ProBook $1"
      },
      {
        "regex": "HP Pavilion dv6 Notebook PC",
        "model": "Pavilion dv6"
      },
      {
        "regex": "HP Pavilion Notebook",
        "model": "Pavilion"
      },
      {
        "regex": "HP Spectre x360 Convertible",
        "model": "Spectre x360"
      },
      {
        "regex": "HP Pavilion All-in-One 24-r0xx",
        "model": "Pavilion 24-r0xx All-in-One Desktop PC",
        "device": "desktop"
      },
      {
        "regex": "23-f364",
        "model": "Pavilion TouchSmart 23-f364 All-in-One Desktop PC",
        "device": "desktop"
      }
    ]
  },
  "Lenovo": {
    "regex": "FBMD/(?:37021C5|80E5|80SM|80VR);",
    "device": "desktop",
    "models": [
      {
        "regex": "FBMD/37021C5;",
        "model": "ThinkPad Helix 3702"
      },
      {
        "regex": "FBMD/80E5;",
        "model": "G50-80"
      },
      {
        "regex": "FBMD/80SM;",
        "model": "Ideapad 310-15ISK"
      },
      {
        "regex": "FBMD/80VR;",
        "model": "Legion Y720"
      }
    ]
  },
  "Schneider": {
    "regex": "FBMD/SCL141CTP;",
    "device": "desktop",
    "model": "Notebook 14\" Cherry Trail"
  },
  "Thomson": {
    "regex": "FBMD/TH360R12\\.32CTW;",
    "device": "desktop",
    "model": "Prestige TH-360R12.32CTW"
  },
  "Toshiba": {
    "regex": "FBMD/Satellite ",
    "device": "desktop",
    "models": [
      {
        "regex": "Satellite (A[25]00|C650|C855|L650|S855)",
        "model": "Satellite $1"
      },
      {
        "regex": "Satellite ([^;\\)]+);",
        "model": "Satellite $1"
      }
    ]
  }
};


module.exports = {
  DS: 'display.size',
  DP: 'display.dpi',              // int: display densities
  // DT: 'display.type',          // string: display type IPS, LCD, OLED, SLED etc.
  // TS: 'display.touch',         // boolean: touch support
  RS: 'display.resolution',       // string|obj: 1080x1920
  SZ: 'size',                     // string|obj: 155.4x75.2x7.7
  WT: 'weight',                   // int: weight
  RE: 'release',                  // string:year release
  RM: 'hardware.ram',             // int: RAM in MB
  CP: 'hardware.cpu_id',          // int: CPU ID <id>
  GP: 'hardware.gpu_id',          // int: GPU ID <id>
  // UI: 'ui_id',                 // int: OS UI <id>
  OS: 'os',                       // string: Android 4.4
  OI: 'os_id',                    // int: OS ID <id>
  OV: 'os_version',               // int: OS ID <id>
  SM: 'sim',                      // int: count SIM
  TT: 'performance.antutu',       // int: antutu score
  TG: 'performance.geekbench'     // int: geekbench score
}
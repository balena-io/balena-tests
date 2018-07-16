/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const utils = require('../lib/utils')

module.exports = {
  title: 'Enable serial port on UART0/ttyAMA0',
  interactive: true,
  deviceType: {
    type: 'object',
    required: [ 'slug' ],
    properties: {
      slug: {
        type: 'string',
        anyOf: [
          {
            const: 'raspberrypi3'
          },
          {
            const: 'raspberrypi-pi'
          }
        ]
      }
    }
  },
  run: async (test, context, options) => {
    test.resolveMatch(utils.runManualTestCase({
      prepare: [
        'Logging into the device (ssh to the host OS)',
        'Set "console=serial0,115200" in "/mnt/boot/cmdline.txt" so that the kernel outputs logs to serial',
        'Plug in the USB serial cable into device, like this "https://elinux.org/RPi_Serial_Connection"',
        'Make sure there are no "Device Configuration" variables configured'
      ],
      do: [
        `Run "minicom -b 115200 -o -D ${options.serialConnection}"`,
        'Add custom variable "RESIN_HOST_CONFIG_dtoverlay = pi3-miniuart-bt" as a "Device Configuration" variable'
      ],
      assert: [
        'The device should reboot',
        'You should see booting messages on serial',
        '"getty" should be advertised as spawned on "ttyAMA0" with a login message like: "Resin OS X.X raspberrypi3 ttyAMA0"'
      ],
      cleanup: [
        'Remove variable "RESIN_HOST_CONFIG_dtoverlay" from "Device Configuration"',
        'Exit from minicom',
        'Close the Web HostOS Terminal'
      ]
    }), true)
    test.end()
  }
}

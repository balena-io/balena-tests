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
  title: 'Boot/Shutdown splash screen',
  interactive: true,
  deviceType: {
    type: 'object',
    required: [ 'hdmi' ],
    properties: {
      hdmi: {
        type: 'boolean',
        const: true
      }
    }
  },
  run: async (test, context, options) => {
    return utils.runManualTestCase(test, {
      prepare: [ 'Plug a monitor in the device\'s HDMI output' ],
      do: [
        'Shutdown the device',
        'Power back on the device'
      ],
      assert: [
        'The Resin.io logo splash screen should be visible when the board initiates shutdown',
        'The Resin.io logo splash screen should be visible during boot-up'
      ]
    })
  }
}

/*
 * Copyright 2018 balena
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
  title: 'Reboot device multiple times',
  run: async (test, context, options, components) => {
    for (let i = 0; i < 550; i++) {
      const lastTimeOnline = await components.balena.getLastConnectedTime(context.uuid)

      console.log(`[Reboot no. ${i+1}]`)
      await components.balena.rebootDevice(context.uuid)

      await utils.waitUntil(async () => {
        return await components.balena.getLastConnectedTime(context.uuid) > lastTimeOnline
      })

      await utils.waitUntil(() => {
        return components.balena.isDeviceOnline(context.uuid)
      })
    }
  }
}

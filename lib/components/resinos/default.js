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

const Bluebird = require('bluebird')
const imagefs = require('resin-image-fs')

const utils = require('../../utils')

exports.sshHostOS = async (command, uuid, privateKeyPath) => {
  const options = [ '-p 22222', `root@${uuid}` ]
  return utils.ssh(command, privateKeyPath, options)
}

// TODO: This function should be implemented using Reconfix
exports.injectResinConfiguration = (image, configuration) => {
  return imagefs.writeFile({
    image,
    partition: 1,
    path: '/config.json'
  }, JSON.stringify(configuration))
}

// TODO: This function should be implemented using Reconfix
exports.injectNetworkConfiguration = (configuration, writer) => {
  if (configuration.network === 'ethernet') {
    return Bluebird.resolve()
  }

  if (configuration.network === 'wifi') {
    const wifiConfiguration = [
      '[connection]',
      'id=resin-wifi',
      'type=wifi',
      '[wifi]',
      'hidden=true',
      'mode=infrastructure',
      `ssid=${configuration.wifiSsid}`,
      '[ipv4]',
      'method=auto',
      '[ipv6]',
      'addr-gen-mode=stable-privacy',
      'method=auto'
    ]

    if (configuration.wifiKey) {
      Reflect.apply(wifiConfiguration.push, wifiConfiguration, [
        '[wifi-security]',
        'auth-alg=open',
        'key-mgmt=wpa-psk',
        `psk=${configuration.wifiKey}`
      ])
    }

    return writer(wifiConfiguration.join('\n'), {
      partition: 1,
      path: '/system-connections/resin-wifi'
    })
  }

  if (configuration.network === 'cellular') {
    const cellularConfiguration = [
      '[connection]',
      'id=resin-gsm',
      'type=gsm',
      `autoconnect=${configuration.autoconnect || 'yes'}`,
      '[gsm]',
      `apn=${configuration.apn}`,
      `number=${configuration.number}`,
      'password-flags=1',
      '[ipv4]',
      'dns-search=',
      'method=auto',
      '[ipv6]',
      'addr-gen-mode=stable-privacy',
      'dns-search=',
      'method=auto'
    ]

    return writer(cellularConfiguration.join('\n'), {
      partition: 1,
      path: '/system-connections/resin-gsm'
    })
  }

  return Bluebird.reject('Unrecofnized network configuration')
}

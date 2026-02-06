import { resolve } from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from '@rsbuild/core'
import { getRsbuildConfig } from 'rsbuild-config-cozy-app'

const __dirname = resolve(fileURLToPath(import.meta.url), '..')

const config = getRsbuildConfig({
  title: 'Learning Assistant'
})

config.source = config.source || {}
config.source.alias = config.source.alias || {}
Object.assign(config.source.alias, {
  react: resolve(__dirname, './node_modules/react'),
  'react-dom': resolve(__dirname, './node_modules/react-dom'),
  'cozy-ui': resolve(__dirname, './node_modules/cozy-ui'),
  'cozy-ui-plus': resolve(__dirname, './node_modules/cozy-ui-plus'),
  'cozy-client': resolve(__dirname, './node_modules/cozy-client'),
  'cozy-device-helper': resolve(__dirname, './node_modules/cozy-device-helper'),
  'cozy-intent': resolve(__dirname, './node_modules/cozy-intent')
})

export default defineConfig(config)

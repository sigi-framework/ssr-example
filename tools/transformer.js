const tsImportPluginProvider = require('ts-import-plugin')
const { createEmotionPlugin } = require('emotion-ts-plugin')
const { SigiTransformer } = require('@sigi/ts-plugin')

const { isSSR } = require('./envs')

const tsImportPlugin = tsImportPluginProvider([
  {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  },
  {
    style: false,
    libraryName: 'lodash',
    libraryDirectory: null,
    camel2DashComponentName: false,
  },
])

const isTest = process.env.NODE_ENV === 'test'
const emotionPlugin = createEmotionPlugin({ sourcemap: !isTest, autoInject: false })
const plugins =
  process.env.NODE_ENV === 'production' && !isSSR() ? [emotionPlugin, tsImportPlugin, SigiTransformer] : [emotionPlugin]

module.exports = () => ({ before: plugins })

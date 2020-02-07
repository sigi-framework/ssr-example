const { resolve } = require('path')
const mergeWebpack = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')

const commonWebpackConfig = require('./webpack.config')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = mergeWebpack(commonWebpackConfig, {
  target: 'node',
  devtool: '#@source-map',
  node: false,
  entry: resolve(__dirname, './packages/server/src/index.ts'),
  resolve: {
    alias: {
      '@c': resolve(__dirname, './packages/client/src'),
    },
  },

  externals: nodeExternals({
    modulesDir: resolve(__dirname, 'node_modules'),
    whitelist: [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|less|styl)$/,
    ],
  }),
  output: {
    path: resolve(__dirname, './dist/server'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    libraryTarget: 'commonjs2',
  },
})

const os = require('os')
const { join, resolve } = require('path')
const HappyPack = require('happypack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const { isProduction } = require('./tools/envs')
const OutputPlugin = require('./tools/webpack-output-plugin')
const IgnoreNotFoundExportPlugin = require('./tools/ignore-not-found-export-plugin')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: resolve(__dirname, './packages/client/src/app.tsx'),
  mode: isProduction ? 'production' : 'development',
  output: {
    path: resolve(__dirname, './dist/client'),
    publicPath: '/',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'happypack/loader?id=ts',
        exclude: /node_modules/,
      },
      {
        include: resolve('node_modules', 'md5'),
        sideEffects: false,
      },
    ],
  },

  plugins: [
    new OutputPlugin(),
    new IgnoreNotFoundExportPlugin(),
    isProduction ? new BundleAnalyzerPlugin() : null,
    new HappyPack({
      id: 'ts',
      loaders: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: true,
            configFile: join(__dirname, 'tsconfig.json'),
            experimentalWatchApi: true,
            getCustomTransformers: join(__dirname, 'tools', 'transformer.js'),
          },
        },
      ],
      threads: os.cpus().length - 1,
    }),
  ].filter(Boolean),
}

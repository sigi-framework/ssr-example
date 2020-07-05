const os = require('os')
const { join, resolve } = require('path')
const HappyPack = require('happypack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const { isProduction } = require('./tools/envs')
const OutputPlugin = require('./tools/webpack-output-plugin')
const IgnoreNotFoundExportPlugin = require('./tools/ignore-not-found-export-plugin')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: resolve(__dirname, './packages/client/src/app.tsx'),
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'hidden-nosource-sourcemap' : '#cheap-eval-source-map',
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
        enforce: 'pre',
        test: /\.(t|j)sx?$/,
        loader: 'happypack/loader?id=sourcemap',
        include: [resolve(__dirname, './packages/client/src')],
      },
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
    new CleanWebpackPlugin(),
    new IgnoreNotFoundExportPlugin(),
    process.env.ANA && new BundleAnalyzerPlugin(),
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
    new HappyPack({
      id: 'sourcemap',
      loaders: ['source-map-loader'],
      threads: os.cpus().length - 1,
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './index.html'),
    }),
  ].filter(Boolean),
  optimization: {
    providedExports: true,
    usedExports: true,
    sideEffects: isProduction,
    minimize: isProduction,
    splitChunks: {
      minChunks: 1,
      minSize: 1,
      chunks: 'all',
      cacheGroups: {
        sigi: {
          minSize: 1,
          minChunks: 1,
          name: 'sigi',
          test: /@sigi/,
          priority: 100,
          enforce: true,
        },
      },
    },
  },
}

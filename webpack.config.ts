import webpack from 'webpack'
import os from 'os'
import { join } from 'path'

const HappyPack = require('happypack')

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 })

export default {
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
    ],
  },

  plugins: [
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
          },
        },
      ],
      threadPool: happyThreadPool,
    }),
  ],
} as webpack.Configuration

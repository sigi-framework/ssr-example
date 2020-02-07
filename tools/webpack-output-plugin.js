module.exports = class OutputPlugin {
  constructor({ filename = 'output-stats.json', outputAsset = true } = {}) {
    this.opts = { filename, outputAsset }
  }

  handleEmit(hookCompiler, callback) {
    const stats = hookCompiler.getStats().toJson({
      hash: true,
      publicPath: true,
      assets: true,
      chunks: false,
      modules: false,
      source: false,
      errorDetails: false,
      timings: false,
      warnings: false,
    })
    const result = JSON.stringify(stats, null, 2)

    if (this.opts.outputAsset) {
      hookCompiler.assets[this.opts.filename] = {
        source() {
          return result
        },
        size() {
          return result.length
        },
      }
    }

    callback()
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('output-webpack-plugin', this.handleEmit.bind(this))
  }
}

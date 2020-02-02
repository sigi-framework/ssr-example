module.exports.isDevelopment = process.env.NODE_ENV === 'development'
module.exports.isProduction = process.env.NODE_ENV === 'production'

module.exports.isSSR = () => {
  if (typeof process.env.ssr === 'boolean') {
    return process.env.ssr
  }
  return process.env.ssr && process.env.ssr.toString().toLocaleLowerCase() === 'true'
}

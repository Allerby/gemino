const { environment } = require('@rails/webpacker')
const erb = require('./loaders/erb')
const { VueLoaderPlugin } = require('vue-loader')

// Get the actual sass-loader config
const sassLoader = environment.loaders.get('sass')
const vue = require('./loaders/vue')
const sassLoaderConfig = sassLoader.use.find(function (element) {
return element.loader == 'sass-loader'
})
var webpack = require('webpack');

// Use Dart-implementation of Sass (default is node-sass)
const options = sassLoaderConfig.options
options.implementation = require('sass')

function hotfixPostcssLoaderConfig(subloader) {
  const subloaderName = subloader.loader
  if (subloaderName === 'postcss-loader') {
    subloader.options.postcssOptions = subloader.options.config
    delete subloader.options.config
  }
}

environment.plugins.prepend('VueLoaderPlugin', new VueLoaderPlugin())
environment.loaders.prepend('vue', vue)

environment.loaders.keys().forEach(loaderName => {
const loader = environment.loaders.get(loaderName)
loader.use.forEach(hotfixPostcssLoaderConfig)
})

environment.loaders.prepend('erb', erb)
module.exports = environment

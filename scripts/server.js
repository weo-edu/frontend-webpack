/**
 * Imports
 */

import render, {replace} from './render'
import dev from 'webpack-dev-middleware'
import hot from 'webpack-hot-middleware'
import config from '../webpack.config'
import express from 'express'
import webpack from 'webpack'

/**
 * Constants
 */

const app = express()
const compiler = webpack(config)

/**
 * Setup
 */

app.use(dev(compiler, {
  publicPath: config.output.publicPath
}))

app.use(hot(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

/**
 * App
 */

app.use(render)

/**
 * Setup server-side hmr
 */

let first = true
compiler.plugin('done', stats => {
  stats = stats.toJson()
  if (first) first = false
  else replace(stats.modules)
})

/**
 * Listen
 */

app.listen(3000)

/**
 * Imports
 */

import express from 'express'
import webpack from 'webpack'
import dev from 'webpack-dev-middleware'
import hot from 'webpack-hot-middleware'
import config from '../webpack.config'
import render from './render'

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
 * Listen
 */

app.listen(3000)

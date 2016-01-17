/**
 * Imports
 */

import path from 'path'
import Isomorphic from 'webpack-isomorphic-tools'
import config from '../webpack.config.isomorphic'

/**
 * Constants
 */

const basePath = path.resolve(process.cwd(), './src')

/**
 * Setup isomorphic tools instance
 */

const isomorphic = new Isomorphic(config)
  .development()
  .server(basePath, function () {
    require('./server')
  })

/**
 * Make the isomorphic tools global
 */

global.isomorphic = isomorphic

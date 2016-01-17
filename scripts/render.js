/**
 * Imports
 */

import invalidate from 'require-invalidate'
import _main from '../src/server'
import page from './page'
import path from 'path'

/**
 * Vars
 */

let main = _main

/**
 * Render
 */

function render (req, res) {
  main(req).then(params => {
    const html = page(params, isomorphic.assets())
    res.send(html)
  })
}

function replace (modules) {
  modules.filter(mod => mod.built).forEach(mod => invalidate(path.resolve(process.cwd(), mod.name)))//, '.', console.log('invalidating', mod.name)))
  main = require('../src/server').default
}

/**
 * Exports
 */

export default render
export {
  replace
}


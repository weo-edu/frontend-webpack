/**
 * Imports
 */

import main from '../src/server'
import page from './page'

/**
 * Render
 */

function render (req, res) {
  main(req).then(params => {
    const html = page(params, isomorphic.assets())
    res.send(html)
  })
}

/**
 * Exports
 */

export default render

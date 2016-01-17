/**
 * Imports
 */

import multi from 'redux-multi'
import effects from 'redux-effects'

/**
 * Middleware
 */

function middleware (req) {
  return [
    multi,
    effects
  ]
}

/**
 * Exports
 */

export default middleware

/**
 * Imports
 */

import middleware from './middleware/server'
import App from './components/app'
import element from 'vdux/element'
import reducer from './reducer'
import vdux from 'vdux/string'

/**
 * initialState
 */

const initialState = {}

/**
 * Render to string
 */

function render (request) {
  return vdux({
    middleware: middleware(request),
    initialState,
    reducer,
    app: state => <App state={state} />
  })
}

/**
 * Exports
 */

export default render

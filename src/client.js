/**
 * Imports
 */

import middleware from './middleware/client'
import domready from '@f/domready'
import element from 'vdux/element'
import App from './components/app'
import reducer from './reducer'
import vdux from 'vdux/dom'

/**
 * Initialize app
 */

let hmr
domready(() => hmr = vdux({
  middleware,
  reducer,
  initialState: window.__initialState__,
  app: state => <App state={state} />
}))

/**
 * Hot module replacement
 */

if (module.hot) {
  module.hot.decline()
  module.hot.accept(['./components/app', './reducer'], () => {
    hmr.replace(require('./components/app').default, require('./reducer').default)
  })
}

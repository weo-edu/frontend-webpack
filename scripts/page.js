/**
 * Render a page
 */

function page ({html, vtree, state}, assets) {
  return `
    <html>
      <head>
        <script type='text/javascript' src='${assets.javascript.main}'></script>
        <script type='text/javascript'>
          window.__initialState__ = ${JSON.stringify(state)}
        </script>
      </head>
      <body>${html}</body>
    </html>
  `
}

/**
 * Exports
 */

export default page

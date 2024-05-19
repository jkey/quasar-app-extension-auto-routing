const template = require('lodash.template')
const fs = require('fs')
const path = require('path')

/**
 * This template is used to create an index.js file that
 * will be imported and used inside routes.js
 */
const indexTemplate = `import { createRouterLayout } from 'vue-router-layout'
import generatedRoutes from './generated-routes'

const RouterLayout = createRouterLayout(layout => {
  switch (layout) {
    <% for (const [layout, layoutPath] of layouts) { %>case '<%= layout %>':
      return import('<%= layoutPath %>')<% } %>
    default:
      return import('<%= layouts.get('default') %>')
  }
})

export default [
  {
    path: '<%= routePrefix %>',
    component: RouterLayout,
    children: generatedRoutes
  }
]
`

const compile = template(indexTemplate)

/**
 *
 * @param {String} routePrefix prefix before pages (e.g. 'admin')
 * @param {String} layoutsDir directory where layouts are located
 * @param {String} outFile file to write to
 * @returns void
 */
module.exports = function createIndexTemplate(
  routePrefix,
  layoutsDir,
  outFile
) {
  // Fetch all layouts from the layoutsDir
  const foundLayouts = fs
    .readdirSync(layoutsDir)
    .filter((file) => file.endsWith('.vue'))

  const layouts = new Map()
  foundLayouts.forEach((file) => {
    const layoutName = file.replace('.vue', '')
    const layoutPath = path.relative(
      path.dirname(outFile),
      path.join(layoutsDir, file)
    )
    layouts.set(layoutName, layoutPath)
  })

  // Fill the template
  let code = compile({ routePrefix, layouts, outFile })
  code = '/* eslint-disable */\n' + code

  /**
   * The following ensures the destination exists
   * then writes the files
   */
  if (!fs.existsSync(outFile)) {
    fs.writeFileSync(outFile, '')
  }

  if (
    fs.existsSync(outFile) &&
    fs.readFileSync(outFile, 'utf8').trim() === code.trim() // don't write if nothing changed
  ) {
    return
  }

  fs.writeFileSync(outFile, code)
}

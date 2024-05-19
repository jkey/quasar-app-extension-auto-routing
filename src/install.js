module.exports = function (api) {
  /**
   * This supplies a default "layout" and
   * sets up the auto-routing folder
   */
  api.render('templates')

  /**
   * Almost all users will likely want the same setup for
   * auto-routing, so we simply setup the
   * defaults without prompting.
   */
  api.extendJsonFile('quasar.extensions.json', {
    'auto-routing': {
      pagesDir: 'src/pages',
      routePrefix: '',
      layoutsDir: 'src/layouts',
      ignorePattern: '/(^|[/\\])../',
      outDir: 'src/router/auto-routing',
      pagesImportPrefix: 'pages/',
      generatorConfig: {
        nested: true,
      },
    },
  })
}

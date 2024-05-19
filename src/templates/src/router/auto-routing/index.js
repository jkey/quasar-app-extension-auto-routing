/* eslint-disable */
import { createRouterLayout } from 'vue-router-layout'
import generatedRoutes from './generated-routes'

const RouterLayout = createRouterLayout((layout) => {
  switch (layout) {
    case 'default':
      return import('../../layouts/default.vue')
    default:
      return import('../../layouts/default.vue')
  }
})

export default [
  {
    path: '/',
    component: RouterLayout,
    children: generatedRoutes,
  },
]

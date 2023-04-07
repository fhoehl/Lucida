import { Router } from '@vaadin/router'
import './how-to'
import './camera'

function initRouter () {
  const router = new Router(document.querySelector('main'))
  router.setRoutes([
    {
      path: '/',
      component: 'app-lucida-welcome'
    },
    {
      path: '/how-to',
      component: 'app-lucida-how-to'
    },
    {
      path: '/camera',
      component: 'app-lucida-camera'
    }
  ])
}

window.addEventListener('load', () => {
  initRouter()
})

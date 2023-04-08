import { Router } from '@vaadin/router'
import './home'
import './how-to'
import './camera'

async function initRouter (): Promise<void> {
  const router = new Router(document.querySelector('main'))
  await router.setRoutes([
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

window.addEventListener('load', async () => {
  await initRouter()
})

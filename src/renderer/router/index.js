// import _ from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'
import { ipcRenderer } from 'electron'

import DashboardPage from '../pages/DashboardPage'
import BalancePage from '../pages/BalancePage'
import ReceivePage from '../pages/ReceivePage'
import BroadcastPage from '../pages/BroadcastPage'
import SendPage from '../pages/SendPage'

Vue.use(Router)

const resizeWindow = (expandWindow) => {
  if (expandWindow) {
    return ipcRenderer.send('resizeWindow', { width: 950, height: 520 })
  }
  ipcRenderer.send('resizeWindow', { width: 950, height: 520 })
}

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard-page',
      component: DashboardPage,
      beforeEnter: (to, from, next) => {
        resizeWindow(false)
        next()
      }
    },
    {
      path: '/balance',
      name: 'balance-page',
      component: BalancePage,
      beforeEnter: (to, from, next) => {
        resizeWindow(true)
        next()
      }
    },
    {
      path: '/send',
      name: 'send-page',
      component: SendPage,
      beforeEnter: (to, from, next) => {
        resizeWindow(true)
        next()
      }
    },
    {
      path: '/receive',
      name: 'receive-page',
      component: ReceivePage,
      beforeEnter: (to, from, next) => {
        resizeWindow(true)
        next()
      }
    },
    {
      path: '/broadcast',
      name: 'broadcast-page',
      component: BroadcastPage,
      beforeEnter: (to, from, next) => {
        resizeWindow(true)
        next()
      }
    },
    {
      path: '*',
      redirect: '/dashboard'
    }
  ]
})

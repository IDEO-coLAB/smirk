import _ from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'
import { ipcRenderer } from 'electron'

import DashboardPage from '../pages/DashboardPage'
import BalancePage from '../pages/BalancePage'
import ReceivePage from '../pages/ReceivePage'
import BroadcastPage from '../pages/BroadcastPage'
import SendPage from '../pages/SendPage'

import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

Vue.use(Router)

const resizeWindow = (expandWindow) => {
  if (expandWindow) {
    return ipcRenderer.send('resizeWindow', { width: 1250, height: 820 })
    // return ipcRenderer.send('resizeWindow', { width: 550, height: 520 })
  }
  ipcRenderer.send('resizeWindow', { width: 1250, height: 820 })
  // ipcRenderer.send('resizeWindow', { width: 550, height: 220 })
}

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard-page',
      component: DashboardPage,
      beforeEnter: (to, from, next) => {
        // Always reset state when entering the dashboard
        // 1) resize the window to its passive size
        resizeWindow(false)

        // 2) remove uploadedTransaction if it exists
        const $store = this.a.app.$store
        if (!_.isNil($store)) {
          $store.commit(APP_STATE_MUTATIONS.SET_UPLOADED_TX, null)
        }

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

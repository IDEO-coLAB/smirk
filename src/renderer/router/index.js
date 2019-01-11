import _ from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'

import DashboardPage from '../pages/DashboardPage'
// import BalancePage from '../pages/BalancePage'
import ReceivePage from '../pages/ReceivePage'
import BroadcastPage from '../pages/BroadcastPage'
import SendPage from '../pages/SendPage'
import { resizeWindow } from '../utils/layout'

import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

Vue.use(Router)

const PATHS = {
  SEND: '/send',
  RECEIVE: '/receive',
  BROADCAST: '/broadcast',
  DASHBOARD: '/dashboard'
}

const handleAppSizing = ($store, path) => {
  if (_.isNil($store)) {
    return
  }
  switch (path) {
    case PATHS.SEND:
    case PATHS.RECEIVE:
    case PATHS.BROADCAST:
      if (!$store.getters.appIsExpanded) {
        resizeWindow($store)
      }
      break
    case PATHS.DASHBOARD:
      resizeWindow($store)
      break
  }
}

export default new Router({
  routes: [
    {
      path: PATHS.DASHBOARD,
      name: 'dashboard-page',
      component: DashboardPage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        if (!_.isNil($store)) {
          // Shrink the app when entering the dashboard
          handleAppSizing($store, to.path)
          // Clear any uploadedTransactions
          $store.commit(APP_STATE_MUTATIONS.SET_UPLOADED_TX, null)
        }
        next()
      }
    },
    // {
    //   path: '/balance',
    //   name: 'balance-page',
    //   component: BalancePage,
    //   beforeEnter: (to, from, next) => {
    //     const $store = this.a.app.$store
    //     resizeWindow($store)
    //     next()
    //   }
    // },
    {
      path: PATHS.SEND,
      name: 'send-page',
      component: SendPage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        handleAppSizing($store, to.path)
        next()
      }
    },
    {
      path: PATHS.RECEIVE,
      name: 'receive-page',
      component: ReceivePage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        handleAppSizing($store, to.path)
        next()
      }
    },
    {
      path: PATHS.RECEIVE,
      name: 'broadcast-page',
      component: BroadcastPage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        handleAppSizing($store, to.path)
        next()
      }
    },
    {
      path: '*',
      redirect: PATHS.DASHBOARD
    }
  ]
})

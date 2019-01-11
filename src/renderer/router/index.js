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

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard-page',
      component: DashboardPage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        if (!_.isNil($store)) {
          // Always reset state when entering the dashboard
          // Resize the window to its passive size
          resizeWindow($store)
          // Remove uploadedTransaction if it exists
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
      path: '/send',
      name: 'send-page',
      component: SendPage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        resizeWindow($store)
        next()
      }
    },
    {
      path: '/receive',
      name: 'receive-page',
      component: ReceivePage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        resizeWindow($store)
        next()
      }
    },
    {
      path: '/broadcast',
      name: 'broadcast-page',
      component: BroadcastPage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        resizeWindow($store)
        next()
      }
    },
    {
      path: '*',
      redirect: '/dashboard'
    }
  ]
})

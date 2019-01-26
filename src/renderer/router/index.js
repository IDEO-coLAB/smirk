import _ from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'

import DashboardPage from '../pages/DashboardPage'
import ReceivePage from '../pages/ReceivePage'
import FinalizePage from '../pages/FinalizePage'
import SendPage from '../pages/SendPage'
import TransactionsPage from '../pages/TransactionsPage'
import OutputsPage from '../pages/OutputsPage'
import SettingsPage from '../pages/SettingsPage'

import { resizeWindow, shrinkWindow } from '../utils/app-layout'
import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

Vue.use(Router)

const PATHS = {
  SEND: '/send',
  RECEIVE: '/receive',
  FINALIZE: '/finalize',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  OUTPUTS: '/outputs',
  SETTINGS: '/settings'
}

const handleAppSizing = ($store, path) => {
  if (_.isNil($store)) {
    return
  }
  switch (path) {
    case PATHS.SEND:
    case PATHS.RECEIVE:
    case PATHS.FINALIZE:
    case PATHS.TRANSACTIONS:
    case PATHS.OUTPUTS:
    case PATHS.SETTINGS:
      if (!$store.getters.appIsExpanded) {
        resizeWindow($store)
      }
      break
    case PATHS.DASHBOARD:
      shrinkWindow($store)
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
      path: PATHS.FINALIZE,
      name: 'finalize-page',
      component: FinalizePage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        handleAppSizing($store, to.path)
        next()
      }
    },
    {
      path: PATHS.TRANSACTIONS,
      name: 'transactions-page',
      component: TransactionsPage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        handleAppSizing($store, to.path)
        next()
      }
    },
    {
      path: PATHS.OUTPUTS,
      name: 'outputs-page',
      component: OutputsPage,
      beforeEnter: (to, from, next) => {
        const $store = this.a.app.$store
        handleAppSizing($store, to.path)
        next()
      }
    },
    {
      path: PATHS.SETTINGS,
      name: 'settings-page',
      component: SettingsPage,
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

import _ from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'

import TransactionsPage from '../pages/TransactionsPage'
import TransactionPage from '../pages/TransactionPage'

import { WALLET_SERVICE_MUTATIONS } from '../store/modules/AppState'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/transactions',
      name: 'transactions-page',
      component: TransactionsPage,
      beforeEnter: (to, from, next) => {
        // appState housekeeping:
        // clear out the app's currentTransaction when arriving here
        const $store = this.a.app.$store
        if (_.isNil($store)) {
          return next()
        }
        $store.commit(WALLET_SERVICE_MUTATIONS.SET_CURRENT_TX, null)
        next()
      }
    },
    {
      path: '/transaction/:id',
      name: 'transaction-page',
      component: TransactionPage
    },
    {
      path: '*',
      redirect: '/transactions'
    }
  ]
})

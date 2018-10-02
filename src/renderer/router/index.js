import _ from 'lodash'
import Vue from 'vue'
import Router from 'vue-router'

import TransactionsPage from '../pages/TransactionsPage'
import TransactionPage from '../pages/TransactionPage'

import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/transactions',
      name: 'transactions-page',
      component: TransactionsPage,
      beforeEnter: (to, from, next) => {
        // Always remove an exsiting currentTransaction when entering this route
        const $store = this.a.app.$store
        if (_.isNil($store)) {
          return next()
        }
        $store.commit(APP_STATE_MUTATIONS.SET_CURRENT_TX_ID, null)
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

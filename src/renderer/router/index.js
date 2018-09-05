import Vue from 'vue'
import Router from 'vue-router'

import TransactionsPage from '@/pages/TransactionsPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'transactions-page',
      component: TransactionsPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

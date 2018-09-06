/*

ON BOOT
http://localhost:13420/v1/wallet/owner/retrieve_summary_info
http://localhost:13420/v1/wallet/owner/retrieve_txs

http://localhost:13420/v1/wallet/owner/retrieve_outputs

> when nav to a single tx page, fetch this
http://localhost:13420/v1/wallet/owner/retrieve_outputs?tx_id=1&show_spent=true

if summary info? => http://localhost:13420/v1/wallet/owner/retrieve_txs?id=1

http://localhost:13420/v1/wallet/owner/node_height
regular ping: http://localhost:13420/v1/wallet/owner/node_height

*/

import axios from 'axios'
// import assert from 'assert'
import _ from 'lodash'

const GRIN_DAEMON_URL = 'http://localhost:13420/v1/wallet/owner'

export const GRIN_WALLET_MUTATIONS = {
  SET_SUMMARY: 'SET_SUMMARY',
  SET_OUTPUTS: 'SET_OUTPUTS',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS'
}

export const GRIN_WALLET_ACTIONS = {
  GET_SUMMARY: 'GET_SUMMARY',
  GET_OUTPUTS: 'GET_OUTPUTS',
  GET_TRANSACTIONS: 'GET_TRANSACTIONS'
}

const state = {
  summary: null,
  outputs: [],
  transactions: []
}

const getters = {
  wallet: (state) => state,
  transactions: (state) => state.transactions,
  spendable: (state) => {
    if (_.isNil(state.summary)) return 0
    return state.summary.amount_currently_spendable
  }
}

const mutations = {
  [GRIN_WALLET_MUTATIONS.SET_SUMMARY] (state, data) {
    state.summary = data
  },
  [GRIN_WALLET_MUTATIONS.SET_OUTPUTS] (state, data) {
    state.outputs = data
  },
  [GRIN_WALLET_MUTATIONS.SET_TRANSACTIONS] (state, data) {
    state.transactions = data
  }
}

const actions = {
  [GRIN_WALLET_ACTIONS.GET_SUMMARY] ({ commit }) {
    axios.get(`${GRIN_DAEMON_URL}/retrieve_summary_info`)
      .then((payload) => {
        const data = payload.data[1]
        commit(GRIN_WALLET_MUTATIONS.SET_SUMMARY, data)
      })
  },
  [GRIN_WALLET_ACTIONS.GET_TRANSACTIONS] ({ commit }) {
    axios.get(`${GRIN_DAEMON_URL}/retrieve_txs`)
      .then((payload) => {
        const data = payload.data[1]
        commit(GRIN_WALLET_MUTATIONS.SET_TRANSACTIONS, data)
      })
  },
  [GRIN_WALLET_ACTIONS.GET_OUTPUTS] ({ commit }, id) {
    // TODO: Add intelligent data fetch for outputs (currently load on app boot)
    // TODO: Add data caching layer
    // e.g.: axios.get(`${GRIN_DAEMON_URL}/retrieve_outputs?tx_id=${id}&show_spent=true`)
    axios.get(`${GRIN_DAEMON_URL}/retrieve_outputs?show_spent=true`)
      .then((payload) => {
        const data = payload.data[1]
        commit(GRIN_WALLET_MUTATIONS.SET_OUTPUTS, data)
      })
  }
}

export const GrinWallet = {
  state,
  mutations,
  actions,
  getters
}

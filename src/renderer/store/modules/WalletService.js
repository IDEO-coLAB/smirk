/*

ON BOOT
http://localhost:13420/v1/wallet/owner/retrieve_summary_info
http://localhost:13420/v1/wallet/owner/retrieve_txs

http://localhost:13420/v1/wallet/owner/retrieve_outputs
http://localhost:13420/v1/wallet/owner/retrieve_outputs?tx_id=1&show_spent=true

if summary info? => http://localhost:13420/v1/wallet/owner/retrieve_txs?id=1

http://localhost:13420/v1/wallet/owner/node_height
regular ping: http://localhost:13420/v1/wallet/owner/node_height

*/

import axios from 'axios'
import _ from 'lodash'

const WALLET_LISTENER_URL = 'http://localhost:13420/v1/wallet/owner'

export const WALLET_SERVICE_MUTATIONS = {
  SET_SUMMARY: 'SET_SUMMARY',
  SET_TXS: 'SET_TXS'
}

export const WALLET_SERVICE_ACTIONS = {
  GET_SUMMARY: 'GET_SUMMARY',
  GET_TXS: 'GET_TXS'
}

const state = {
  summary: null,
  transactions: []
}

const getters = {
  wallet: (state) => state,
  spendable: (state) => {
    if (_.isNil(state.summary)) return 0
    return state.summary.amount_currently_spendable
  }
}

const mutations = {
  [WALLET_SERVICE_MUTATIONS.SET_SUMMARY] (state, data) {
    state.summary = data
  },
  [WALLET_SERVICE_MUTATIONS.SET_TXS] (state, data) {
    state.transactions = data
  }
}

const actions = {
  [WALLET_SERVICE_ACTIONS.GET_SUMMARY] ({ commit }) {
    axios.get(`${WALLET_LISTENER_URL}/retrieve_summary_info`)
      .then((payload) => {
        const parsed = payload.data[1]
        commit(WALLET_SERVICE_MUTATIONS.SET_SUMMARY, parsed)
      })
  },
  [WALLET_SERVICE_ACTIONS.GET_TXS] ({ commit }) {
    axios.get(`${WALLET_LISTENER_URL}/retrieve_txs`)
      .then((payload) => {
        commit(WALLET_SERVICE_MUTATIONS.SET_TXS, payload.data)
      })
  }
}

export const WalletService = {
  state,
  mutations,
  actions,
  getters
}

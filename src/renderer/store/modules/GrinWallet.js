/*
TODO:
regular ping: http://localhost:13420/v1/wallet/owner/node_height
*/

import axios from 'axios'
import _ from 'lodash'

const GRIN_DAEMON_URL = 'http://localhost:13420/v1/wallet/owner'

export const GRIN_WALLET_MUTATIONS = {
  SET_SUMMARY: 'SET_SUMMARY',
  SET_OUTPUTS: 'SET_OUTPUTS',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS'
}

export const GRIN_WALLET_ACTIONS = {
  GET_SUMMARY: 'GET_SUMMARY',
  GET_OUTPUTS_FOR_TRANSACTION: 'GET_OUTPUTS_FOR_TRANSACTION',
  GET_TRANSACTIONS: 'GET_TRANSACTIONS'
}

const state = {
  summary: null,
  outputs: [],
  transactions: []
}

const getters = {
  wallet: (state) => state,
  spendable: (state) => {
    if (_.isNil(state.summary)) return 0
    return state.summary.amount_currently_spendable
  },
  outputs: (state) => state.outputs,
  outputByTransactionId: (state) => {
    return (id) => {
      // Use _.filter because we can have multiple outputs with one tx id
      return _.filter(state.outputs, (output) => {
        const outputTxId = output[0].tx_log_entry
        if (outputTxId === id) {
          return output
        }
        return false
      })
    }
  },
  transactions: (state) => state.transactions,
  transactionById: (state) => {
    return (id) => {
      // Use _.find because we should only have one tx with this id
      return _.find(state.transactions, (tx) => {
        if (tx.id === id) {
          return tx
        }
        return false
      })
    }
  }
}

const mutations = {
  [GRIN_WALLET_MUTATIONS.SET_SUMMARY] (state, data) {
    state.summary = data
  },
  [GRIN_WALLET_MUTATIONS.SET_OUTPUTS] (state, data) {
    // 1) If there are no outputs in the store, add the first set
    if (_.isEmpty(state.outputs)) {
      state.outputs = state.outputs.concat(data)
      return
    }

    // 2) Otherwise swap out stale outputs based on the tx_log_entry (tx.id)
    const pruneIdx = data[0][0].tx_log_entry
    state.outputs = _.filter(state.outputs, (output) => {
      if (output[0].tx_log_entry !== pruneIdx) {
        return output
      }
      return false
    }).concat(data)
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
  [GRIN_WALLET_ACTIONS.GET_OUTPUTS_FOR_TRANSACTION] ({ commit }, id) {
    // TODO: Add data caching layer
    axios.get(`${GRIN_DAEMON_URL}/retrieve_outputs?tx_id=${id}&show_spent=true`)
      .then((payload) => {
        const data = payload.data[1]
        // exit if there are no outputs for the transaction
        if (_.isEmpty(data)) {
          return
        }
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

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
import assert from 'assert'
import _ from 'lodash'

const WALLET_DAEMON_LISTENER_URL = 'http://localhost:13420/v1/wallet/owner'

export const WALLET_DAEMON_MUTATIONS = {
  SET_SUMMARY: 'SET_SUMMARY',
  SET_TX_OUTPUTS: 'SET_TX_OUTPUTS',
  SET_TXS_LOG: 'SET_TXS_LOG'
}

export const WALLET_DAEMON_ACTIONS = {
  GET_SUMMARY: 'GET_SUMMARY',
  GET_TX_OUTPUTS: 'GET_TX_OUTPUTS',
  GET_TXS_LOG: 'GET_TXS_LOG'
}

const state = {
  summary: null,
  transactions: {
    log: [],
    outputs: []
  }
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
  [WALLET_DAEMON_MUTATIONS.SET_SUMMARY] (state, data) {
    state.summary = data
  },
  [WALLET_DAEMON_MUTATIONS.SET_TX_OUTPUTS] (state, { id, data }) {
    const filtered = _.filter(state.transactions.outputs, (output) => {
      return id !== output[0].tx_log_entry
    })
    const newOutputs = _.sortBy(_.concat(filtered, data), (output) => {
      return output[0].tx_log_entry
    })
    state.transactions.outputs = newOutputs
  },
  [WALLET_DAEMON_MUTATIONS.SET_TXS_LOG] (state, data) {
    state.transactions.log = data
  }
}

const actions = {
  [WALLET_DAEMON_ACTIONS.GET_SUMMARY] ({ commit }) {
    axios.get(`${WALLET_DAEMON_LISTENER_URL}/retrieve_summary_info`)
      .then((payload) => {
        const data = payload.data[1]
        commit(WALLET_DAEMON_MUTATIONS.SET_SUMMARY, data)
      })
  },
  [WALLET_DAEMON_ACTIONS.GET_TXS_LOG] ({ commit }) {
    axios.get(`${WALLET_DAEMON_LISTENER_URL}/retrieve_txs`)
      .then((payload) => {
        const data = payload.data[1]
        commit(WALLET_DAEMON_MUTATIONS.SET_TXS_LOG, data)
      })
  },
  [WALLET_DAEMON_ACTIONS.GET_TX_OUTPUTS] ({ commit }, id) {
    axios.get(`${WALLET_DAEMON_LISTENER_URL}/retrieve_outputs?tx_id=${id}&show_spent=true`)
      .then((payload) => {
        const data = payload.data[1]
        // TODO: there may be multiple outputs, we may need to ensure
        // that they all have the same tx_log_entry
        const outputTxId = data[0][0].tx_log_entry
        assert.equal(id, outputTxId)
        commit(WALLET_DAEMON_MUTATIONS.SET_TX_OUTPUTS, { id, data })
      })
  }
}

export const WalletDaemonService = {
  state,
  mutations,
  actions,
  getters
}

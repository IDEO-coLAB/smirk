/*
TODO:
- Add a heartbeat ping to sync (http://localhost:13420/v1/wallet/owner/node_height)
- Add data caching layer
*/

import axios from 'axios'
import _ from 'lodash'

import models from '../../models'

const GRIN_HOST = 'http://localhost'
const GRIN_OWNER_URL = `${GRIN_HOST}:13420/v1/wallet/owner`
const GRIN_FOREIGN_URL = `${GRIN_HOST}:13415/v1/wallet/foreign`

export const GRIN_WALLET_MUTATIONS = {
  SET_SUMMARY: 'SET_SUMMARY',
  SET_OUTPUTS: 'SET_OUTPUTS',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS'
}

export const GRIN_WALLET_ACTIONS = {
  GET_SUMMARY: 'GET_SUMMARY',
  GET_OUTPUTS_FOR_TRANSACTION: 'GET_OUTPUTS_FOR_TRANSACTION',
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  ISSUE_SEND_TRANSACTION: 'ISSUE_SEND_TRANSACTION',
  RECEIVE_TRANSACTION: 'RECEIVE_TRANSACTION',
  CANCEL_TRANSACTION: 'CANCEL_TRANSACTION',
  FINALIZE_TRANSACTION: 'FINALIZE_TRANSACTION'
}

const axiosData = {
  // TODO: dynamically pull these in from the main proc
  headers: { 'Authorization': 'Basic Z3JpbjppMExTU0FqWUhmWE5RMlVIeDlkbg==' }
}
const axiosInstance = axios.create(axiosData)

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
    state.summary = new models.WalletSummary(data)
  },
  [GRIN_WALLET_MUTATIONS.SET_OUTPUTS] (state, data) {
    const buildOutputs = (outputs) => _.map(outputs, (output) => {
      const outputObj = new models.Output(output[0])
      const outputSig = output[1]
      return [outputObj, outputSig]
    })

    // 1) If there are no outputs in the store, add the first set
    if (_.isEmpty(state.outputs)) {
      state.outputs = buildOutputs(state.outputs.concat(data))
      return
    }

    // 2) Otherwise swap out stale outputs based on the tx_log_entry (tx.id)
    const pruneIdx = data[0][0].tx_log_entry
    const freshOutputs = _.filter(state.outputs, (output) => {
      if (output[0].tx_log_entry !== pruneIdx) {
        return output
      }
      return false
    }).concat(data)
    state.outputs = buildOutputs(freshOutputs)
  },
  [GRIN_WALLET_MUTATIONS.SET_TRANSACTIONS] (state, data) {
    state.transactions = _.map(data, tx => new models.TransactionLogEntry(tx))
  }
}

const getFormattedAxiosPost = (url, data = null) => {
  return {
    method: 'POST',
    headers: { 'content-type': 'text/plain' }, // talk to Grin core about this
    data,
    url
  }
}

// NOTES ON HANDLING
// WHEN NO SERVER IS RUNNING => :400 CODE
// IF LISTENER is off: 500 error, net::ERR_CONNECTION_REFUSED
// IF HEADER is missing: Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.

const actions = {
  [GRIN_WALLET_ACTIONS.GET_SUMMARY] ({ commit }) {
    return axiosInstance.get(`${GRIN_OWNER_URL}/retrieve_summary_info`)
      .then((payload) => {
        const data = payload.data[1]
        commit(GRIN_WALLET_MUTATIONS.SET_SUMMARY, data)
        return data
      })
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.GET_SUMMARY
        throw error
      })
  },

  [GRIN_WALLET_ACTIONS.GET_TRANSACTIONS] ({ commit }) {
    axiosInstance.get(`${GRIN_OWNER_URL}/retrieve_txs`)
      .then((payload) => {
        const data = payload.data[1]
        commit(GRIN_WALLET_MUTATIONS.SET_TRANSACTIONS, data)
        return data
      })
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.GET_TRANSACTIONS
        throw error
      })
  },

  [GRIN_WALLET_ACTIONS.GET_OUTPUTS_FOR_TRANSACTION] ({ commit }, id) {
    axiosInstance.get(`${GRIN_OWNER_URL}/retrieve_outputs?tx_id=${id}&show_spent=true`)
      .then((payload) => {
        // payload.data[0] validated_against_node: boolean
        // payload.data[1] outputs: Output[]
        const data = payload.data[1]
        if (_.isEmpty(data)) {
          return null
        }
        commit(GRIN_WALLET_MUTATIONS.SET_OUTPUTS, data)
        return data
      })
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.GET_OUTPUTS_FOR_TRANSACTION
        throw error
      })
  },

  [GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION] ({ commit }, data) {
    const post = getFormattedAxiosPost(`${GRIN_OWNER_URL}/issue_send_tx`, data)
    return axios(post)
      .then(payload => payload.data)
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION
        throw error
      })
  },
  [GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION] ({ commit }, data) {
    const post = getFormattedAxiosPost(`${GRIN_FOREIGN_URL}/receive_tx`, data)
    axios(post)
      .then(payload => payload.data)
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION
        throw error
      })
  },
  [GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION] ({ commit }, data) {
    const post = getFormattedAxiosPost(`${GRIN_OWNER_URL}/finalize_tx`, data)
    axios(post)
      .then(payload => payload.data)
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION
        throw error
      })
  },
  [GRIN_WALLET_ACTIONS.CANCEL_TRANSACTION] ({ commit }, data) {
    const post = getFormattedAxiosPost(`${GRIN_OWNER_URL}/cancel_tx?id=${data}`)
    return axios(post)
      .then(payload => payload.data)
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.CANCEL_TRANSACTION
        throw error
      })
  }
}

export const GrinWallet = {
  state,
  mutations,
  actions,
  getters
}

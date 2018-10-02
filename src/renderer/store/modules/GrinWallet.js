/*
TODO:
regular ping: http://localhost:13420/v1/wallet/owner/node_height
*/

import axios from 'axios'
// import qs from 'qs'
import _ from 'lodash'

import models from '../../models'

const GRIN_HOST = 'http://localhost'
const GRIN_DAEMON_OWNER_URL = `${GRIN_HOST}:13420/v1/wallet/owner`
const GRIN_DAEMON_FOREIGN_URL = `${GRIN_HOST}:13415/v1/wallet/foreign`

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
  FINALIZE_TRANSACTION: 'FINALIZE_TRANSACTION'
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

// WHEN NO SERVER IS RUNNING => :400 CODE
const actions = {
  [GRIN_WALLET_ACTIONS.GET_SUMMARY] ({ commit }) {
    axios.get(`${GRIN_DAEMON_OWNER_URL}/retrieve_summary_info`)
      .then((payload) => {
        const data = payload.data[1]
        commit(GRIN_WALLET_MUTATIONS.SET_SUMMARY, data)
      })
      // TODO: UNIFIED ERROR HANDLING
      .catch((error) => console.error(error))
  },
  [GRIN_WALLET_ACTIONS.GET_TRANSACTIONS] ({ commit }) {
    axios.get(`${GRIN_DAEMON_OWNER_URL}/retrieve_txs`)
      .then((payload) => {
        const data = payload.data[1]
        commit(GRIN_WALLET_MUTATIONS.SET_TRANSACTIONS, data)
      })
      // TODO: UNIFIED ERROR HANDLING
      .catch((error) => console.error(error))
  },
  [GRIN_WALLET_ACTIONS.GET_OUTPUTS_FOR_TRANSACTION] ({ commit }, id) {
    // TODO: Add data caching layer
    axios.get(`${GRIN_DAEMON_OWNER_URL}/retrieve_outputs?tx_id=${id}&show_spent=true`)
      .then((payload) => {
        //  TODO: fix up
        // validated_against_node: boolean;
        // outputs: Output[];
        const data = payload.data[1]

        // exit if there are no outputs for the transaction
        if (_.isEmpty(data)) {
          return
        }
        commit(GRIN_WALLET_MUTATIONS.SET_OUTPUTS, data)
      })
      // TODO: UNIFIED ERROR HANDLING
      .catch((error) => console.error(error))
  },
  [GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION] ({ commit }, data) {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'text/plain'
      },
      data: data,
      url: `${GRIN_DAEMON_OWNER_URL}/issue_send_tx`
    }
    console.log('POSTING to issue_send_tx ', options)
    // IF LISTENER is off: 500 error, net::ERR_CONNECTION_REFUSED
    // IF HEADER is missing: Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.
    return axios(options)
      .then((payload) => {
        console.log('SUCCESSFULLY POSTED TO ISSUE_SEND_TX')
        console.log(JSON.stringify(payload.data))
        return payload.data
      })
      // TODO: UNIFIED ERROR HANDLING
      .catch((error) => {
        console.error(error)
        throw new Error(error)
      })
  },
  [GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION] ({ commit }, data) {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'text/plain'
      },
      data: data,
      url: `${GRIN_DAEMON_FOREIGN_URL}/receive_tx`
    }
    console.log('POSTING to receive_tx ', options)
    // IF LISTENER is off: 500 error, net::ERR_CONNECTION_REFUSED
    // IF HEADER is missing: Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.
    axios(options)
      .then((payload) => {
        console.log('SUCCESSFULLY POSTED TO RECEIVE_TX')
        console.log(JSON.stringify(payload.data))
        return payload.data
      })
      // TODO: UNIFIED ERROR HANDLING
      .catch((error) => {
        console.error(error)
        throw new Error(error)
      })
  },
  [GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION] ({ commit }, data) {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'text/plain'
      },
      data: data,
      url: `${GRIN_DAEMON_OWNER_URL}/finalize_tx`
    }
    console.log('POSTING to finalize_tx ', options)
    // IF LISTENER is off: 500 error, net::ERR_CONNECTION_REFUSED
    // IF HEADER is missing: Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.
    return axios(options)
      .then((payload) => {
        console.log('SUCCESSFULLY POSTED TO FINALIZE_TRANSACTION')
        console.log(JSON.stringify(payload.data))
        return payload.data
      })
      // TODO: UNIFIED ERROR HANDLING
      .catch((error) => {
        console.error(error)
        throw new Error(error)
      })
  }
}

export const GrinWallet = {
  state,
  mutations,
  actions,
  getters
}

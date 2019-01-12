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
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_NODE_HEIGHT: 'SET_NODE_HEIGHT'
}

export const GRIN_WALLET_ACTIONS = {
  GET_NODE_HEIGHT: 'GET_NODE_HEIGHT',
  GET_SUMMARY: 'GET_SUMMARY',
  GET_OUTPUTS: 'GET_OUTPUTS',
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
  transactions: [],
  nodeHeight: null
}

const getters = {
  wallet: (state) => state,
  spendable: (state) => {
    if (_.isNil(state.summary)) return 0
    return state.summary.amount_currently_spendable
  },
  locked: (state) => {
    if (_.isNil(state.summary)) return 0
    return state.summary.amount_awaiting_confirmation
  },
  outputs: (state) => state.outputs,
  transactions: (state) => state.transactions,
  nodeHeight: (state) => state.nodeHeight
}

const mutations = {
  [GRIN_WALLET_MUTATIONS.SET_SUMMARY] (state, data) {
    state.summary = new models.WalletSummary(data)
  },
  [GRIN_WALLET_MUTATIONS.SET_OUTPUTS] (state, data) {
    // TODO: convert bytes into hex here - remove from OutputTile
    // const commitmentBytes = this.commitment
    // return Array.prototype.map.call(commitmentBytes, (byte) => {
    //   return ('0' + (byte & 0xFF).toString(16)).slice(-2)
    // }).join('')
    const buildOutputs = (outputs) => _.map(outputs, (output) => {
      const outputObj = new models.Output(output[0])
      const outputSig = output[1]
      return [outputObj, outputSig]
    })
    state.outputs = buildOutputs(data)
  },
  [GRIN_WALLET_MUTATIONS.SET_TRANSACTIONS] (state, data) {
    state.transactions = _.map(data, tx => new models.TransactionLogEntry(tx))
  },
  [GRIN_WALLET_MUTATIONS.SET_NODE_HEIGHT] (state, data) {
    state.nodeHeight = data
  }
}

// const getFormattedAxiosPost = (url, data = null) => {
//   return {
//     method: 'POST',
//     // headers: { 'content-type': 'text/plain' }, // talk to Grin core about this
//     // headers: { 'content-type': 'application/json' }, // talk to Grin core about this
//     data,
//     url
//   }
// }

// NOTES ON HANDLING
// WHEN NO SERVER IS RUNNING => :400 CODE
// IF LISTENER is off: 500 error, net::ERR_CONNECTION_REFUSED
// IF HEADER is missing: Request header field Content-Type is not allowed by Access-Control-Allow-Headers in preflight response.
const throwNodeOfflineError = () => { throw new Error('Grin node is unreachable') }

const actions = {
  [GRIN_WALLET_ACTIONS.GET_NODE_HEIGHT] ({ commit }) {
    return axiosInstance.get(`${GRIN_OWNER_URL}/node_height`)
      .then((payload) => {
        const height = payload.data[0]
        const nodeIsOnline = payload.data[1]
        if (!nodeIsOnline) {
          throwNodeOfflineError()
        }
        commit(GRIN_WALLET_MUTATIONS.SET_NODE_HEIGHT, height)
        return height
      })
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.GET_NODE_HEIGHT
        throw error
      })
  },

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
    return axiosInstance.get(`${GRIN_OWNER_URL}/retrieve_txs`)
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

  [GRIN_WALLET_ACTIONS.GET_OUTPUTS] ({ commit }, id) {
    return axiosInstance.get(`${GRIN_OWNER_URL}/retrieve_outputs?refresh=true&show_spent=true`)
      .then((payload) => {
        const data = payload.data[1]
        if (_.isEmpty(data)) {
          return []
        }
        commit(GRIN_WALLET_MUTATIONS.SET_OUTPUTS, data)
        return data
      })
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.GET_OUTPUTS
        throw error
      })
  },

  //
  //
  // POSTS!
  //
  //
  [GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION] ({ commit }, data) {
    return axiosInstance.post(`${GRIN_OWNER_URL}/issue_send_tx`, data)
      .then(payload => payload.data)
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION
        throw error
      })
  },

  [GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION] ({ commit }, data) {
    // const post = getFormattedAxiosPost(`${GRIN_FOREIGN_URL}/receive_tx`, data)
    // axios(post)
    return axiosInstance.post(`${GRIN_FOREIGN_URL}/receive_tx`, data)
      .then(payload => payload.data)
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION
        throw error
      })
  },
  [GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION] ({ commit }, data) {
    // const post = getFormattedAxiosPost(`${GRIN_OWNER_URL}/finalize_tx`, data)
    // axios(post)
    return axiosInstance.post(`${GRIN_OWNER_URL}/finalize_tx`, data)
      .then(payload => payload.data)
      .catch((error) => {
        error.type = GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION
        throw error
      })
  },
  [GRIN_WALLET_ACTIONS.CANCEL_TRANSACTION] ({ commit }, data) {
    return axiosInstance.post(`${GRIN_OWNER_URL}/cancel_tx?id=${data}`)
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

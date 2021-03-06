import axios from 'axios'
import _ from 'lodash'
// import { remote } from 'electron'
import models from '../../models'
import { expandWindow } from '../../utils/app-layout'
import {
  NOTIFICATION_MUTATIONS,
  createLargeErrorNotification
} from './Notifications'

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

// TODO: clean up the interface now that usage is understood
const state = {
  summary: null,
  outputs: [],
  transactions: [],
  nodeHeight: null
}

// TODO: clean up the interface now that usage is understood
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
    const buildOutputs = (outputs) => _.map(outputs, (output) => {
      const outputObj = new models.Output(output[0])
      // TODO: convert bytes into hex; utils/grin
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

const handleForeignListenerNetworkError = ({ commit, store }) => {
  return (error) => {
    if (error.message === 'Network Error') {
      expandWindow(store)
      const notification = createLargeErrorNotification({
        title: 'Listener offline error',
        message: `
          <p>Your wallet listener doesn't appear to be running.
            Turn on the listener by running:<br>
            <code>$ grin wallet listen</code>
          </p>
        `
      })
      commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
    }
    throw error
  }
}

const handleOwnerListenerNetworkError = ({ commit, store }) => {
  return (error) => {
    if (error.message === 'Network Error') {
      expandWindow(store)
      const notification = createLargeErrorNotification({
        title: 'Network error',
        message: `
          <p>There is an issue connecting to your Grin node.</p>
          <p>1. Ensure the Grin server is running:<br>
            <code>$ grin</code>
          </p>
          <p>2. Ensure the owner_api is running:<br>
            <code>$ grin wallet owner_api</code>
          </p>
        `
      })
      commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
    }
    throw error
  }
}

const handleGrinApiError = ({ commit }, title) => {
  return (error) => {
    // Network errors are handled last
    if (error.message === 'Network Error') {
      throw error
    }
    let notification = createLargeErrorNotification({
      title,
      message: error.response.data
    })
    commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
    throw error
  }
}

// const grinConfig = remote.getGlobal('GLOBAL_GRIN_CONFIG')
// // TODO: handle the case when grinConfig || apiSecret is missing
// const axiosData = {
//   headers: {
//     // 'Authorization': grinConfig.api.secrets.floonet
//     'Authorization': grinConfig.secrets.floonet
//   }
// }
// const FOO_FETCH_OLD = axios.create(axiosData)

// TODO: handle the case when the secret is missing
const getAxiosInstance = (store) => {
  if (_.isNil(store.getters.grinConfig)) {
    return null
  }

  const isFloonet = store.getters.grinConfig.node.isFloonet
  const auth = isFloonet
    ? store.getters.grinConfig.secrets.floonet
    : store.getters.grinConfig.secrets.mainnet

  return axios.create({
    headers: { 'Authorization': auth }
  })
}

const actions = {
  // GETS
  [GRIN_WALLET_ACTIONS.GET_NODE_HEIGHT] ({ commit, store }) {
    const instance = getAxiosInstance(this)
    if (!instance) return

    return instance.get(`${GRIN_OWNER_URL}/node_height`)
      .then((payload) => {
        const height = payload.data[0]
        const nodeIsOnline = payload.data[1]
        if (!nodeIsOnline) {
          throw new Error('Network Error')
        }
        commit(GRIN_WALLET_MUTATIONS.SET_NODE_HEIGHT, height)
        return height
      })
      .catch(handleGrinApiError({ commit }, 'Error getting node height'))
      .catch(handleOwnerListenerNetworkError({ commit, store: this }))
  },

  [GRIN_WALLET_ACTIONS.GET_SUMMARY] ({ commit }) {
    const instance = getAxiosInstance(this)
    if (!instance) return

    return instance.get(`${GRIN_OWNER_URL}/retrieve_summary_info`)
      .then((payload) => {
        const data = payload.data[1]
        commit(GRIN_WALLET_MUTATIONS.SET_SUMMARY, data)
        return data
      })
      .catch(handleGrinApiError({ commit }, 'Error getting wallet summary'))
      .catch(handleOwnerListenerNetworkError({ commit, store: this }))
  },

  [GRIN_WALLET_ACTIONS.GET_TRANSACTIONS] ({ commit }) {
    const instance = getAxiosInstance(this)
    if (!instance) return

    return instance.get(`${GRIN_OWNER_URL}/retrieve_txs`)
      .then((payload) => {
        const data = payload.data[1]
        commit(GRIN_WALLET_MUTATIONS.SET_TRANSACTIONS, data)
        return data
      })
      .catch(handleGrinApiError({ commit }, 'Error getting transactions'))
      .catch(handleOwnerListenerNetworkError({ commit, store: this }))
  },

  [GRIN_WALLET_ACTIONS.GET_OUTPUTS] ({ commit }) {
    const instance = getAxiosInstance(this)
    if (!instance) return

    return instance.get(`${GRIN_OWNER_URL}/retrieve_outputs?refresh=true&show_spent=true`)
      .then((payload) => {
        const data = payload.data[1]
        if (_.isEmpty(data)) {
          return []
        }
        commit(GRIN_WALLET_MUTATIONS.SET_OUTPUTS, data)
        return data
      })
      .catch(handleGrinApiError({ commit }, 'Error getting outputs'))
      .catch(handleOwnerListenerNetworkError({ commit, store: this }))
  },

  // POSTS
  [GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION] ({ commit }, data) {
    const instance = getAxiosInstance(this)
    if (!instance) return

    return instance.post(`${GRIN_OWNER_URL}/issue_send_tx`, data)
      .then(payload => payload.data)
      .catch(handleGrinApiError({ commit }, 'Error sending transaction'))
      .catch(handleOwnerListenerNetworkError({ commit, store: this }))
  },

  [GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION] ({ commit }, data) {
    const instance = getAxiosInstance(this)
    if (!instance) return

    return instance.post(`${GRIN_FOREIGN_URL}/receive_tx`, data)
      .then(payload => payload.data)
      .catch(handleGrinApiError({ commit }, 'Error receiving transaction'))
      .catch(handleForeignListenerNetworkError({ commit, store: this }))
  },
  [GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION] ({ commit }, data) {
    const instance = getAxiosInstance(this)
    if (!instance) return

    return instance.post(`${GRIN_OWNER_URL}/finalize_tx`, data)
      .then(payload => payload.data)
      .catch(handleGrinApiError({ commit }, 'Error finalizing transaction'))
      .catch(handleOwnerListenerNetworkError({ commit, store: this }))
  },
  [GRIN_WALLET_ACTIONS.CANCEL_TRANSACTION] ({ commit }, data) {
    const instance = getAxiosInstance(this)
    if (!instance) return

    return instance.post(`${GRIN_OWNER_URL}/cancel_tx?id=${data}`)
      .then(payload => payload.data)
      .catch(handleGrinApiError({ commit }, 'Error canceling transaction'))
      .catch(handleOwnerListenerNetworkError({ commit, store: this }))
  }
}

export const GrinWallet = {
  state,
  mutations,
  actions,
  getters
}

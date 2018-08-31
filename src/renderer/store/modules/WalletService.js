/*

http://localhost:13420/v1/wallet/owner/retrieve_summary_info
http://localhost:13420/v1/wallet/owner/node_height
http://localhost:13420/v1/wallet/owner/retrieve_outputs
http://localhost:13420/v1/wallet/owner/node_height

*/

import axios from 'axios'

const WALLET_LISTENER_URL = 'http://localhost:13420/v1/wallet/owner'

export const WALLET_SERVICE_MUTATIONS = {
  SET_WALLET_SUMMARY: 'SET_WALLET_SUMMARY'
}

export const WALLET_SERVICE_ACTIONS = {
  FETCH_WALLET_SUMMARY: 'FETCH_WALLET_SUMMARY'
}

const state = {
  summary: null
}

const mutations = {
  [WALLET_SERVICE_MUTATIONS.SET_WALLET_SUMMARY] (state, data) {
    state.summary = data
  }
}

const actions = {
  [WALLET_SERVICE_ACTIONS.FETCH_WALLET_SUMMARY] ({ commit }) {
    axios.get(`${WALLET_LISTENER_URL}/retrieve_summary_info`)
      .then((payload) => {
        commit(WALLET_SERVICE_MUTATIONS.SET_WALLET_SUMMARY, payload.data)
      })
  }
}

export const WalletService = {
  state,
  mutations,
  actions
}

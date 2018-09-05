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

export const WALLET_SERVICE_MUTATIONS = {
  SET_CURRENT_TX: 'SET_CURRENT_TX'
}

const state = {
  currentTransaction: null
}

const getters = {
  appState: (state) => state
}

const mutations = {
  [WALLET_SERVICE_MUTATIONS.SET_CURRENT_TX] (state, data) {
    console.log('setting the cur tx', data)
    state.currentTransaction = data
  }
}

export const AppState = {
  state,
  mutations,
  getters
}

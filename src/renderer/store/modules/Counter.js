/*

http://localhost:13420/v1/wallet/owner/retrieve_summary_info
http://localhost:13420/v1/wallet/owner/node_height
http://localhost:13420/v1/wallet/owner/retrieve_outputs
http://localhost:13420/v1/wallet/owner/node_height

*/

import axios from 'axios'

const state = {
  main: 0
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}

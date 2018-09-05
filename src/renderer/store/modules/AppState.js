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

import _ from 'lodash'
import assert from 'assert'

export const APP_STATE_MUTATIONS = {
  SET_CURRENT_TX: 'SET_CURRENT_TX',
  SET_MODAL: 'SET_MODAL'
}

export const MODAL_TYPES = {
  RECEIVE: 'RECEIVE',
  SEND: 'SEND'
}

const state = {
  currentTransaction: null,
  modal: {
    isActive: false,
    type: null
  }
}

const getters = {
  appState: (state) => state
}

const mutations = {
  [APP_STATE_MUTATIONS.SET_CURRENT_TX] (state, data) {
    state.currentTransaction = data
  },
  [APP_STATE_MUTATIONS.SET_MODAL] (state, data) {
    const { isActive, type } = data
    assert(_.isBoolean(isActive))
    if (isActive) {
      assert(_.has(MODAL_TYPES, type))
    } else {
      assert(_.isNil(type))
    }
    state.modal = { isActive, type }
  }
}

export const AppState = {
  state,
  mutations,
  getters
}

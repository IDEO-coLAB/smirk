import _ from 'lodash'
import assert from 'assert'
import ls from 'local-storage'

export const APP_STATE_LOCAL_STORAGE = {
  CURRENT_TX_ID: 'CURRENT_TX_ID'
}

export const APP_STATE_MUTATIONS = {
  SET_CURRENT_TX_ID: 'SET_CURRENT_TX_ID',
  SET_MODAL: 'SET_MODAL'
}

export const APP_STATE_MODAL_TYPES = {
  RECEIVE: 'RECEIVE',
  // SEND: 'SEND',
  TRANSACTION_ITEM: 'TRANSACTION_ITEM'
}

const state = {
  currentTransactionId: null,
  modal: {
    isActive: false,
    type: null
  }
}

const getters = {
  appState: (state) => state
}

const mutations = {
  [APP_STATE_MUTATIONS.SET_CURRENT_TX_ID] (state, data) {
    state.currentTransactionId = data
    ls.set(APP_STATE_LOCAL_STORAGE.CURRENT_TX_ID, data)
  },
  [APP_STATE_MUTATIONS.SET_MODAL] (state, data) {
    const { isActive, type } = data
    assert(_.isBoolean(isActive))
    if (isActive) {
      assert(_.has(APP_STATE_MODAL_TYPES, type))
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

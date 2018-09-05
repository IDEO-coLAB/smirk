import _ from 'lodash'
import assert from 'assert'

export const APP_STATE_MUTATIONS = {
  SET_CURRENT_TX_ID: 'SET_CURRENT_TX_ID',
  SET_MODAL: 'SET_MODAL'
}

export const MODAL_TYPES = {
  RECEIVE: 'RECEIVE',
  SEND: 'SEND'
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

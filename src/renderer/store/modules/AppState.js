import _ from 'lodash'
import assert from 'assert'
// import ls from 'local-storage'

export const APP_STATE_LOCAL_STORAGE = {
  // CURRENT_TX_ID: 'CURRENT_TX_ID'
}

export const APP_STATE_MUTATIONS = {
  // SET_CURRENT_TX_ID: 'SET_CURRENT_TX_ID',
  SET_MODAL: 'SET_MODAL',
  SET_UPLOADED_TX: 'SET_UPLOADED_TX',
  SET_APP_IS_EXPANDED: 'SET_APP_IS_EXPANDED',
  SET_APP_NOTIFICATION: 'SET_APP_NOTIFICATION'
}

export const NOTIFICATION_TYPES = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
}

export const APP_STATE_MODAL_TYPES = {
  // RECEIVE: 'RECEIVE',
  // SEND: 'SEND',
  TRANSACTION_ITEM: 'TRANSACTION_ITEM'
}

const state = {
  appIsExpanded: false,
  notification: null,
  uploadedTransaction: null,
  modal: {
    isActive: false,
    type: null
  }
}

const getters = {
  appState: (state) => state,
  appIsExpanded: (state) => state.appIsExpanded,
  notification: (state) => state.notification,
  uploadedTransaction: (state) => state.uploadedTransaction
}

const mutations = {
  [APP_STATE_MUTATIONS.SET_APP_IS_EXPANDED] (state, data) {
    // todo: enforce bool
    state.appIsExpanded = data
  },
  [APP_STATE_MUTATIONS.SET_APP_NOTIFICATION] (state, data) {
    if (_.isNil(data)) {
      state.notification = null
      return
    }
    // todo: enforce notification types
    state.notification = data
  },
  [APP_STATE_MUTATIONS.SET_UPLOADED_TX] (state, data) {
    // Expects a raw valid transaction string
    state.uploadedTransaction = data
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

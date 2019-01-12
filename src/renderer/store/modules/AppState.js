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
  SUCCESS: 'SUCCESS',
  INFO: 'INFO'
}

export const createNotification = (data) => {
  const { type, message, title, isFullscreen } = data
  if (!_.includes(NOTIFICATION_TYPES, type)) {
    throw new Error('invalid notification type', data)
  }
  if (_.isNil(title) || _.isNil(message)) {
    throw new Error('notifications require a message and title', data)
  }
  if (!_.isBoolean(isFullscreen)) {
    throw new Error('notifications require "isFullscreen" to be a boolean', data)
  }
  return {
    type,
    title,
    message,
    isFullscreen
  }
}

export const createNetworkErrorNotification = () => {
  return createNotification({
    isFullscreen: true,
    title: 'Network Error',
    type: NOTIFICATION_TYPES.INFO,
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

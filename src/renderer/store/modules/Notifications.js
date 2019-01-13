import _ from 'lodash'

export const NOTIFICATION_MUTATIONS = {
  SET_NOTIFICATION: 'SET_NOTIFICATION'
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

export const createLargeSuccessNotification = (args) => {
  let { title = 'Success!', message = 'Your action was successful.' } = args
  return createNotification({
    title,
    message,
    isFullscreen: true,
    type: NOTIFICATION_TYPES.SUCCESS
  })
}

export const createSmallSuccessNotification = (args) => {
  let { title = 'Success!', message = '' } = args
  return createNotification({
    title,
    message,
    isFullscreen: false,
    type: NOTIFICATION_TYPES.SUCCESS
  })
}

export const createLargeErrorNotification = (args) => {
  let { title = 'An error occurred', message = 'An error occurred with your last action.' } = args
  return createNotification({
    title,
    message,
    isFullscreen: true,
    type: NOTIFICATION_TYPES.ERROR
  })
}

export const createSmallErrorNotification = (args) => {
  let { title = 'An error occurred', message = '' } = args
  return createNotification({
    title,
    message,
    isFullscreen: false,
    type: NOTIFICATION_TYPES.ERROR
  })
}

const state = {
  notification: null
}

const getters = {
  notification: (state) => state.notification
}

const mutations = {
  [NOTIFICATION_MUTATIONS.SET_NOTIFICATION] (state, data) {
    // todo: enforce notification types
    state.notification = data || null
  }
}

export const Notifications = {
  state,
  mutations,
  getters
}

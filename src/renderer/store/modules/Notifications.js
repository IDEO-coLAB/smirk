import _ from 'lodash'

export const NOTIFICATION_MUTATIONS = {
  SET_NOTIFICATION: 'SET_NOTIFICATION'
}

export const NOTIFICATION_STYLES = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  INFO: 'INFO'
}

export const NOTIFICATION_TYPES = {
  NETWORK: 'NETWORK',
  GRIN_API: 'GRIN_API',
  ELECTRON_PROC: 'ELECTRON_PROC'
}

export const createNotification = (data) => {
  const { style, type, message, title, isFullscreen } = data
  if (!_.includes(NOTIFICATION_STYLES, style)) {
    throw new Error('invalid notification style', data)
  }
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
    style,
    message,
    isFullscreen
  }
}

// TODO: abstract now that we know what notifications are
export const createLargeSuccessNotification = (args) => {
  let {
    title = 'Success!',
    type = NOTIFICATION_TYPES.GRIN_API,
    message = 'Your action was successful.'
  } = args
  return createNotification({
    type,
    title,
    message,
    isFullscreen: true,
    style: NOTIFICATION_STYLES.SUCCESS
  })
}

export const createSmallSuccessNotification = (args) => {
  let {
    title = 'Success!',
    type = NOTIFICATION_TYPES.GRIN_API
  } = args
  return createNotification({
    type,
    title,
    message: '',
    isFullscreen: false,
    style: NOTIFICATION_STYLES.SUCCESS
  })
}

export const createLargeErrorNotification = (args) => {
  let {
    title = 'An error occurred',
    type = NOTIFICATION_TYPES.GRIN_API,
    message = 'An error occurred with your last action.'
  } = args
  return createNotification({
    type,
    title,
    message,
    isFullscreen: true,
    style: NOTIFICATION_STYLES.ERROR
  })
}

export const createSmallErrorNotification = (args) => {
  let {
    title = 'An error occurred',
    type = NOTIFICATION_TYPES.GRIN_API
  } = args
  return createNotification({
    type,
    title,
    message: '',
    isFullscreen: false,
    style: NOTIFICATION_STYLES.ERROR
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

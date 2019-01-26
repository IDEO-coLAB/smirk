import { ipcRenderer, remote } from 'electron'
import axios from 'axios'
import {
  NOTIFICATION_MUTATIONS,
  createLargeErrorNotification
} from './Notifications'

const axiosInstance = axios.create()

export const APP_STATE_MUTATIONS = {
  SET_UPLOADED_TX: 'SET_UPLOADED_TX',
  SET_APP_IS_EXPANDED: 'SET_APP_IS_EXPANDED',
  SET_APP_IP_ADDRESS: 'SET_APP_IP_ADDRESS',
  SET_GRIN_CONFIG: 'SET_GRIN_CONFIG'
}

export const APP_STATE_ACTIONS = {
  GET_APP_IP_ADDRESS: 'GET_APP_IP_ADDRESS',
  UPDATE_GLOBAL_GRIN_CONFIG: 'UPDATE_GLOBAL_GRIN_CONFIG',
  GET_GLOBAL_GRIN_CONFIG: 'GET_GLOBAL_GRIN_CONFIG'
}

const state = {
  ipAddress: null,
  grinConfig: null,
  appIsExpanded: false,
  uploadedTransaction: null
}

const getters = {
  appState: (state) => state,
  ipAddress: (state) => state.ipAddress,
  grinConfig: (state) => state.grinConfig,
  appIsExpanded: (state) => state.appIsExpanded,
  uploadedTransaction: (state) => state.uploadedTransaction
}

const mutations = {
  // TODO: Port scan to check if the user is reachable
  [APP_STATE_MUTATIONS.SET_APP_IP_ADDRESS] (state, data) {
    state.ipAddress = data
  },
  [APP_STATE_MUTATIONS.SET_GRIN_CONFIG] (state, data) {
    // todo: enforce bool
    state.grinConfig = data
  },
  [APP_STATE_MUTATIONS.SET_APP_IS_EXPANDED] (state, data) {
    // todo: enforce bool
    state.appIsExpanded = data
  },
  [APP_STATE_MUTATIONS.SET_UPLOADED_TX] (state, data) {
    // Expects a raw valid transaction string
    state.uploadedTransaction = data
  }
}

const actions = {
  [APP_STATE_ACTIONS.UPDATE_GLOBAL_GRIN_CONFIG] ({ commit }, data) {
    ipcRenderer.send('UPDATE_GLOBAL_GRIN_CONFIG', data)
  },
  [APP_STATE_ACTIONS.GET_GLOBAL_GRIN_CONFIG] ({ commit }, data) {
    const config = remote.getGlobal('GLOBAL_GRIN_CONFIG')
    commit(APP_STATE_MUTATIONS.SET_GRIN_CONFIG, config)
  },
  [APP_STATE_ACTIONS.GET_APP_IP_ADDRESS] ({ commit }) {
    // Find an option closer to `http://ifconfig.co/port/8080`? We want port availability...
    return axiosInstance.get(`https://api.ipify.org?format=json`)
      .then((payload) => {
        commit(APP_STATE_MUTATIONS.SET_APP_IP_ADDRESS, payload.data.ip)
        return payload
      })
      .catch((error) => {
        let notification = createLargeErrorNotification({
          title: 'Error getting IP address',
          message: `
            <p>
              There was an error getting your external IP address
              from <code>https://api.ipify.org</code>.
            </p>
          `
        })
        commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
        throw error
      })
  }
}

export const AppState = {
  state,
  mutations,
  actions,
  getters
}

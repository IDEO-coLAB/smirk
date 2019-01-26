import { ipcRenderer } from 'electron'
import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'
import { APP_STATE_ACTIONS } from '../store/modules/AppState'

const getStateFromGrin = ($store) => {
  $store.dispatch(GRIN_WALLET_ACTIONS.GET_SUMMARY)
  $store.dispatch(GRIN_WALLET_ACTIONS.GET_TRANSACTIONS)
  $store.dispatch(APP_STATE_ACTIONS.GET_APP_IP_ADDRESS)
}

// TODO: pull the constants used in MAIN and RENDERER into a shared file
const getStateFromMainProcess = ($store) => {
  ipcRenderer.send('GET_GLOBAL_GRIN_CONFIG')
  $store.dispatch(APP_STATE_ACTIONS.GET_GLOBAL_GRIN_CONFIG)
}

export const refreshAppState = ($store) => {
  // Always load data in from the main process first
  // This pulls in the configs and secrets required for http requests
  // TODO: improve
  getStateFromMainProcess($store)
  getStateFromGrin($store)
}

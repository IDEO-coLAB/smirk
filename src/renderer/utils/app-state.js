import { ipcRenderer } from 'electron'
import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'
import { APP_STATE_ACTIONS } from '../store/modules/AppState'

const getStateFromGrin = ($store) => {
  $store.dispatch(GRIN_WALLET_ACTIONS.GET_SUMMARY)
  $store.dispatch(GRIN_WALLET_ACTIONS.GET_TRANSACTIONS)
  $store.dispatch(APP_STATE_ACTIONS.GET_APP_IP_ADDRESS)
}

const getStateFromMainProcess = ($store) => {
  ipcRenderer.send('GET_APP_CONFIG_FROM_MAIN')
}

export const refreshAppState = ($store) => {
  getStateFromGrin($store)
  getStateFromMainProcess($store)
}

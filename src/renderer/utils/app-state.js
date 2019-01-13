import { ipcRenderer } from 'electron'
import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

const getStateFromGrin = ($store) => {
  $store.dispatch(GRIN_WALLET_ACTIONS.GET_SUMMARY)
  $store.dispatch(GRIN_WALLET_ACTIONS.GET_TRANSACTIONS)
}

const getStateFromMainProcess = ($store) => {
  ipcRenderer.send('GET_APP_CONFIG_FROM_MAIN')
}

export const refreshAppState = ($store) => {
  getStateFromGrin($store)
  getStateFromMainProcess($store)
}

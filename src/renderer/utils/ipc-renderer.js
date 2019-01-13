import { ipcRenderer } from 'electron'
import { APP_STATE_MUTATIONS } from '../store/modules/AppState'
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_MUTATIONS,
  createSmallSuccessNotification,
  createSmallErrorNotification
} from '../store/modules/Notifications'

// TODO: Pull events constants into own file to dedupe main and renderer
export const registerIPCRendererListeners = ($store, $router) => {
  ipcRenderer.on('FILE_DOWNLOAD_SUCCESS', (event, data) => {
    // TODO: dynamic download path
    const notification = createSmallSuccessNotification({
      type: NOTIFICATION_TYPES.ELECTRON_PROC,
      title: 'Download successful'
    })
    $store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
  })

  ipcRenderer.on('FILE_DOWNLOAD_ERROR', (event, data) => {
    const notification = createSmallErrorNotification({
      type: NOTIFICATION_TYPES.ELECTRON_PROC,
      title: 'Download error'
    })
    $store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
  })

  ipcRenderer.on('MAIN_MENU_NAV_TRIGGERED', (event, data) => {
    $router.push({ path: data.path })
  })

  ipcRenderer.on('MAIN_APP_CONFIG_READY', (event, data) => {
    // TODO: rename to app config
    $store.commit(APP_STATE_MUTATIONS.SET_SETTINGS, data)
  })
}

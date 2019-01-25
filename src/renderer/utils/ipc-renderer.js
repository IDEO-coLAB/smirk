import { ipcRenderer } from 'electron'
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
      title: 'File downloaded'
    })
    $store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
  })

  ipcRenderer.on('FILE_DOWNLOAD_ERROR', (event, data) => {
    const notification = createSmallErrorNotification({
      type: NOTIFICATION_TYPES.ELECTRON_PROC,
      title: 'File download error'
    })
    $store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
  })

  ipcRenderer.on('MAIN_MENU_NAV_TRIGGERED', (event, data) => {
    $router.push({ path: data.path })
  })
}

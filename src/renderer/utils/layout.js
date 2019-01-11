import _ from 'lodash'
import { ipcRenderer } from 'electron'
import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

export const resizeWindow = ($store) => {
  // return if the app's data store isnt set yet
  if (_.isNil($store)) {
    return
  }
  if (!$store.getters.appIsExpanded) {
    expandWindow($store)
  } else {
    shrinkWindow($store)
  }
}

export const shrinkWindow = ($store) => {
  ipcRenderer.send('resizeWindow', { width: 460, height: 142 })
  $store.commit(APP_STATE_MUTATIONS.SET_APP_IS_EXPANDED, false)
}

export const expandWindow = ($store) => {
  ipcRenderer.send('resizeWindow', { width: 460, height: 385 })
  $store.commit(APP_STATE_MUTATIONS.SET_APP_IS_EXPANDED, true)
}

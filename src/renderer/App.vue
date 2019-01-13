<template>
  <!-- This is the place for styling expansion -->
  <div
    id="app"
    class="content"
    v-bind:class="{
      'is-expanded' :  appIsExpanded,
      'is-minimized' : !appIsExpanded
    }">
    <Notifications />
    <router-view></router-view>
  </div>
</template>

<script>
  // import { ipcRenderer } from 'electron'
  import Notifications from './components/Notifications'
  import { GRIN_WALLET_ACTIONS } from './store/modules/GrinWallet'
  import { expandWindow } from './utils/layout'
  import {
    APP_STATE_ACTIONS
    // APP_STATE_MUTATIONS
  } from './store/modules/AppState'
  // TODO: Move notifications like this into the store actions!!
  import {
    NOTIFICATION_TYPES,
    NOTIFICATION_MUTATIONS,
    createNetworkErrorNotification
  } from './store/modules/Notifications'

  import { registerIPCRendererListeners } from './utils/ipc-renderer'
  import { refreshAppState } from './utils/app-state'

  // Prevent global drag/drop events because we only want certain
  // areas of the application to register file upload events
  const preventGlobalDragDropEvents = (event) => event.preventDefault()
  const EVENTS_TO_PREVENT = ['dragover', 'drop']
  EVENTS_TO_PREVENT.forEach(event => window.addEventListener(event, preventGlobalDragDropEvents))

  export default {
    name: 'smirk',
    components: {
      Notifications
    },
    mounted () {
      // register handlers on the IPCRenderer so that the client
      // can receive messages from the main process
      registerIPCRendererListeners(this.$store, this.$router)

      // TODO: this is hacky; improve the network ping when have more time
      let cachedNodeHeight = null
      setInterval(() => {
        this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_NODE_HEIGHT)
          .then((height) => {
            let currentNodeHeight = this.$store.getters.nodeHeight
            if (currentNodeHeight !== cachedNodeHeight) {
              // set this locally for a comparison
              cachedNodeHeight = height
              // if node height changes, refresh the app state
              refreshAppState(this.$store)
            }
            //
            if (this.$store.getters.notification.type === NOTIFICATION_TYPES.NETWORK) {
              this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, null)
            }
          })
          .catch((error) => {
            // TODO: have network errors set themselves and unset
            // themselves when things come back online
            if (error.message === 'Network Error') {
              console.log(error.response)
              expandWindow(this.$store)
              const notification = createNetworkErrorNotification()
              this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
            }
          })
      }, 2000)
      //
      this.$store.dispatch(APP_STATE_ACTIONS.GET_APP_IP_ADDRESS)
    },
    computed: {
      appIsExpanded () {
        return this.$store.getters.appIsExpanded
      }
    }
  }
</script>

<style lang="sass">
  @import '~@/styles/app.sass'
</style>

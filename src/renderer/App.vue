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
    {{ notification }}
    <router-view></router-view>
  </div>
</template>

<script>
  import Notifications from './components/Notifications'
  import { GRIN_WALLET_ACTIONS } from './store/modules/GrinWallet'
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
      // First thing is that we need to register handlers
      // on the IPCRenderer so that the client can receive
      // messages from the main process when we call refreshAppState()
      registerIPCRendererListeners(this.$store, this.$router)

      // initialize all app data
      refreshAppState(this.$store)

      // TODO: this is hacky; improve the network ping when you have more time
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
          })
      }, 2000)
    },
    computed: {
      appIsExpanded () {
        return this.$store.getters.appIsExpanded
      },
      notification () {
        return this.$store.getters.notification
      }
    }
  }
</script>

<style lang="sass">
  @import '~@/styles/app.sass'
</style>

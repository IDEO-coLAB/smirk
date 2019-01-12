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
  import { ipcRenderer } from 'electron'
  import Notifications from './components/Notifications'
  import { GRIN_WALLET_ACTIONS } from './store/modules/GrinWallet'
  import { APP_STATE_ACTIONS, APP_STATE_MUTATIONS, createNetworkErrorNotification } from './store/modules/AppState'
  import { expandWindow } from './utils/layout'

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
      // TODO: Abstract out these global actions + constants
      ipcRenderer.on('MAIN_MENU_NAV', (event, data) => {
        this.$router.push({ path: data.path })
      })

      // TODO: Abstract out these global actions + constants
      ipcRenderer.on('LOAD_SETTINGS', (event, data) => {
        this.$store.commit(APP_STATE_MUTATIONS.SET_SETTINGS, data)
      })

      this.$store.dispatch(APP_STATE_ACTIONS.GET_APP_IP_ADDRESS)

      // akjsd
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_SUMMARY)
        // ATTACH THIS TO THE NODE HEIGHT PINGER - makes the most sense
        .catch((error) => {
          if (error.message === 'Network Error') {
            expandWindow(this.$store)
            const notification = createNetworkErrorNotification()
            this.$store.commit(APP_STATE_MUTATIONS.SET_APP_NOTIFICATION, notification)
          }
        })

      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_TRANSACTIONS)
    },
    methods: {},
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

<template>
  <div id="app" class="content">
    <ModalContainer />
    <router-view></router-view>
  </div>
</template>

<script>
  import ModalContainer from './components/ModalContainer'
  import { WALLET_DAEMON_ACTIONS } from './store/modules/WalletDaemonService'

  export default {
    name: 'smirk',
    components: {
      ModalContainer
    },
    mounted () {
      // TODO: decide how to store app state variables (e.g.: localstorage)
      // TODO: Handle app state on boot based on the route
      // e.g.: refresh the page when on a specific transaction
      this.$store.dispatch(WALLET_DAEMON_ACTIONS.GET_SUMMARY)
      this.$store.dispatch(WALLET_DAEMON_ACTIONS.GET_TXS_LOG)
    }
  }
</script>

<style>
  @import '~@/styles/app.sass'
</style>

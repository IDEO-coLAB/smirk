<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { WALLET_DAEMON_ACTIONS } from './store/modules/WalletDaemonService'

  export default {
    name: 'smirk',
    mounted () {
      this.$store.dispatch(WALLET_DAEMON_ACTIONS.GET_SUMMARY)
      this.$store.dispatch(WALLET_DAEMON_ACTIONS.GET_TXS)
    }
  }
</script>

<style>
  @import '~@/styles/app.sass'
</style>

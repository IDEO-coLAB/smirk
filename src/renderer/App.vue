<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { WALLET_SERVICE_ACTIONS } from './store/modules/WalletService'

  export default {
    name: 'smirk',
    mounted () {
      this.$store.dispatch(WALLET_SERVICE_ACTIONS.GET_SUMMARY)
      this.$store.dispatch(WALLET_SERVICE_ACTIONS.GET_TXS)
    }
  }
</script>

<style>
  @import '~@/styles/app.sass'
</style>

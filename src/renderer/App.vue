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
      console.log(WALLET_SERVICE_ACTIONS)
      this.$store.dispatch(WALLET_SERVICE_ACTIONS.FETCH_WALLET_SUMMARY)
    }
  }
</script>

<style>
  @import '~@/styles/app.sass'
</style>

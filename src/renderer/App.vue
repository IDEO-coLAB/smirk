<template>
  <div id="app" class="content app-container">
    <router-view></router-view>
  </div>
</template>

<script>
  // import { GRIN_WALLET_ACTIONS } from './store/modules/GrinWallet'

  export default {
    name: 'smirk',
    mounted () {
      // this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_SUMMARY)
      // this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_TRANSACTIONS)
    },
    methods: {}
  }
</script>

<style lang="sass">
  @import '~@/styles/app.sass'
</style>

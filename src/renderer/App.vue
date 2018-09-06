<template>
  <div id="app" class="content">
    <ModalContainer />
    <router-view></router-view>
  </div>
</template>

<script>
  import ModalContainer from './components/ModalContainer'
  import { GRIN_WALLET_ACTIONS } from './store/modules/GrinWallet'

  export default {
    name: 'smirk',
    components: {
      ModalContainer
    },
    mounted () {
      // TODO: decide how to store app state variables (e.g.: localstorage)
      // TODO: Handle app state on boot based on the route
      // e.g.: refresh the page when on a specific transaction
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_SUMMARY)
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_TRANSACTIONS)
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_OUTPUTS)
    }
  }
</script>

<style>
  @import '~@/styles/app.sass'
</style>

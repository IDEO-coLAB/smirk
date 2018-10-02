<template>
  <div id="app" class="content app-container">
    <ModalContainer />
    <div class="app-sidebar">
      <!-- TODO: make this into a component -->
      <router-link to="/dashboard">Dash</router-link>
      <br>
      <br>
      <router-link to="/transactions">Txs</router-link>
    </div>
    <div class="app-content">
      <router-view></router-view>
    </div>
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
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_SUMMARY)
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_TRANSACTIONS)
    }
  }
</script>

<style lang="sass">
  @import '~@/styles/app.sass'
</style>

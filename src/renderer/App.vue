<template>
  <div id="app" class="content">
    <ModalContainer />
    <router-view></router-view>
  </div>
</template>

<script>
  import _ from 'lodash'
  import ls from 'local-storage'

  import ModalContainer from './components/ModalContainer'
  import { GRIN_WALLET_ACTIONS } from './store/modules/GrinWallet'
  import { APP_STATE_LOCAL_STORAGE, APP_STATE_MUTATIONS } from './store/modules/AppState'

  export default {
    name: 'smirk',
    components: {
      ModalContainer
    },
    mounted () {
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_SUMMARY)
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_TRANSACTIONS)

      // Check if there is an existing tx id in local storage.
      const curTxId = ls.get(APP_STATE_LOCAL_STORAGE.CURRENT_TX_ID)
      if (!_.isNil(curTxId)) {
        // If tx id exists in local storage:
        // 1) fetch relevant associated info from the Grin Wallet daemon
        this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_OUTPUTS_FOR_TRANSACTION, curTxId)
        // 2) set up relevant app state based on the tx id
        this.$store.commit(APP_STATE_MUTATIONS.SET_CURRENT_TX_ID, curTxId)
      }
    }
  }
</script>

<style>
  @import '~@/styles/app.sass'
</style>

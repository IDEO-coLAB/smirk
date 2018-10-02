<template>
  <div>
    <router-link :to="{ path: '/transactions' }">
      <button
        class="button">
        Back to All Transactions
      </button>
    </router-link>
    <hr>
    <h2>Transaction Id: {{this.transactionId}}</h2>
    <h3>tx Synopsis</h3>
    {{this.transactionSummary}}
    <hr>
    <h3>tx Outputs</h3>
    {{this.transactionOutputs}}
    <hr>
    <button
      @click="cancelTransaction"
      class="button">
      Cancel Transaction
    </button>
  </div>
</template>

<script>
  // import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  export default {
    name: 'transaction-page',
    computed: {
      transactionId () {
        return this.$store.getters.appState.currentTransactionId
      },
      transactionSummary () {
        return this.$store.getters.transactionById(this.transactionId)
      },
      transactionOutputs () {
        return this.$store.getters.outputByTransactionId(this.transactionId)
      }
    },
    methods: {
      cancelTransaction () {
        // this.$store.dispatch(GRIN_WALLET_ACTIONS.CANCEL_TRANSACTION, this.transactionId)
      }
    }
  }
</script>

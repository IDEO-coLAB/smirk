<template>
  <div>
    <router-link :to="{ path: '/transactions' }">
      <button>
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
  </div>
</template>

<script>
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
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

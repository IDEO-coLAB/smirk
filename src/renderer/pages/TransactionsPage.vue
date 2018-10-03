<template>
  <main>
    <h2>Unconfirmed Txs</h2>
    <div v-for="tx in unconfirmedTransactions">
      <TransactionTile v-bind:transaction="tx" />
    </div>

    <h2>Confirmed Txs</h2>
    <div v-for="tx in confirmedTransactions">
      <TransactionTile v-bind:transaction="tx" />
    </div>
  </main>
</template>

<script>
  import TransactionTile from '../components/TransactionTile'

  export default {
    name: 'transactions-page',
    components: {
      TransactionTile
    },
    computed: {
      transactions () {
        return this.$store.getters.wallet.transactions.slice().reverse()
      },
      unconfirmedTransactions () {
        return this.transactions.filter(tx => tx.confirmation_ts === null)
      },
      confirmedTransactions () {
        return this.transactions.filter(tx => tx.confirmation_ts)
      }
    }
  }
</script>

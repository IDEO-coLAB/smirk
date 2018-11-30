<template>
  <main>
    <h2>BALANCE PAGE</h2>
    <router-link to="/dashboard">Dashboard</router-link> |
  </main>
</template>

<script>
  export default {
    name: 'balance-page',
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

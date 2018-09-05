<template>
  <div>
    <router-link :to="{ path: '/transactions' }">
      <button>
        Back to All Transactions
      </button>
    </router-link>
    <hr>
    <h2>Current Transaction</h2>
    {{this.currentTransaction}}
  </div>
</template>

<script>
  export default {
    name: 'transaction-page',
    computed: {
      currentTransaction () {
        return this.$store.getters.appState.currentTransaction
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

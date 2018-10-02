<template>
  <main>
    <div v-for="tx in reversedTransactions">
      <TransactionTile v-bind:transaction="tx" />
    </div>
  </main>
</template>

<script>
  import TransactionTile from '../components/TransactionTile'
  // import { APP_STATE_MODAL_TYPES, APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'transactions-page',
    components: {
      TransactionTile
    },
    // data () {
    //   return {
    //     APP_STATE_MODAL_TYPES
    //   }
    // },
    computed: {
      transactions () {
        return this.$store.getters.wallet.transactions
      },
      reversedTransactions () {
        return this.transactions.slice().reverse()
      }
    },
    methods: {
      // TODO: convert txs to a modal
      // openModal (type) {
      //   this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: true, type })
      // }
    }
  }
</script>

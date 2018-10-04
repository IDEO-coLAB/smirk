<template>
  <div>
    <ModalTransactionItemReceived
      v-if="transaction.tx_type.includes(types.TxReceived)" />

    <ModalTransactionItemSent
      v-if="transaction.tx_type.includes(types.TxSent)" />

    <ModalTransactionItemCoinbase
      v-if="transaction.tx_type.includes(types.ConfirmedCoinbase)" />
  </div>
</template>

<script>
  import models from '../models'
  import ModalTransactionItemCoinbase from './ModalTransactionItemCoinbase'
  import ModalTransactionItemReceived from './ModalTransactionItemReceived'
  import ModalTransactionItemSent from './ModalTransactionItemSent'

  export default {
    name: 'modal-transaction-item',
    components: {
      ModalTransactionItemCoinbase,
      ModalTransactionItemReceived,
      ModalTransactionItemSent
    },
    data () {
      return {
        types: models.TransactionTypes
      }
    },
    computed: {
      transaction () {
        const id = this.$store.getters.appState.currentTransactionId
        return this.$store.getters.transactionById(id)
      }
    }
  }
</script>

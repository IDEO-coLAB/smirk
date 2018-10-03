<template>
  <div>
    <ModalTransactionItemReceived
      v-if="transactionSummary.tx_type.includes(types.TxReceived)" />

    <ModalTransactionItemSent
      v-if="transactionSummary.tx_type.includes(types.TxSent)" />

    <ModalTransactionItemCoinbase
      v-if="transactionSummary.tx_type.includes(types.ConfirmedCoinbase)" />
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
      transactionId () {
        return this.$store.getters.appState.currentTransactionId
      },
      transactionSummary () {
        return this.$store.getters.transactionById(this.transactionId)
      }
    }
  }
</script>

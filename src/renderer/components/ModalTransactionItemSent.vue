<template>
  <div>

    <header class="modal-card-head">
      <p class="modal-card-title">
        Sent {{(transaction.amount_debited - transaction.amount_credited) | grinBaseNumToPrettyNum}}
      </p>
      <button class="delete" @click="closeModal"></button>
    </header>

    <section class="modal-card-body">
      <p>fees: {{this.transaction.fee | grinBaseNumToPrettyNum}}</p>
      <p>initiated: {{this.transaction.creation_ts | dateFormatLong}}</p>
      <p>confirmed: {{this.transaction.confirmation_ts | dateFormatLong}}</p>
    </section>

    <footer class="modal-card-foot">
      <button
        class="button"
        @click="cancelTransaction">
        Cancel Transaction {{transactionId}}
      </button>
    </footer>

  </div>
</template>

<script>
  import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'modal-transaction-item-sent',
    computed: {
      modal () {
        return this.$store.getters.appState.modal
      },
      transactionId () {
        return this.$store.getters.appState.currentTransactionId
      },
      transaction () {
        console.log('from sent item:', this.$store.getters.transactionById(this.transactionId))
        return this.$store.getters.transactionById(this.transactionId)
      }
    },
    methods: {
      closeModal () {
        this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: false, type: null })
      },
      cancelTransaction () {
        this.$store.dispatch(GRIN_WALLET_ACTIONS.CANCEL_TRANSACTION, this.transactionId)
          .then(d => console.log('SUCCESSFUL CANCEL', d))
          .catch(e => console.log(e.type, e.response.data)) // last part is the message
      }
    }
  }
</script>

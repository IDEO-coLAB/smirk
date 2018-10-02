<template>
  <div>
    <header class="modal-card-head">
      <p class="modal-card-title">Transaction Modal</p>
      <button class="delete" @click="closeModal"></button>
    </header>
    <section class="modal-card-body">

      <h2>Transaction Id: {{this.transactionId}}</h2>
      <h3>tx Synopsis</h3>
      {{this.transactionSummary}}
      <hr>
      <h3>tx Outputs</h3>
      {{this.transactionOutputs}}
      <hr>

    </section>
    <footer class="modal-card-foot">
      <button
        class="button"
        @click="closeModal">
        Cancel
      </button>
    </footer>
  </div>
</template>

<script>
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'transaction-modal',
    computed: {
      modal () {
        return this.$store.getters.appState.modal
      },
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
      closeModal () {
        this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: false, type: null })
      }
    }
  }
</script>

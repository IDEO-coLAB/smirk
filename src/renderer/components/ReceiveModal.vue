<template>
  <div>
    <header class="modal-card-head">
      <p class="modal-card-title">Receive Modal</p>
      <button class="delete" @click="closeModal"></button>
    </header>
    <section class="modal-card-body">
      RECEIVE MODAL IS WORKING
    </section>
    <footer class="modal-card-foot">
      <button
        class="button is-success">
        Save changes
      </button>

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
    name: 'receive-modal',
    computed: {
      modal () {
        return this.$store.getters.appState.modal
      }
    },
    methods: {
      closeModal () {
        this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: false, type: null })
      }
    }
  }
</script>

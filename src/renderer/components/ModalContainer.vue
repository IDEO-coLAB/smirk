<template>
  <div class="modal" v-bind:class="{ 'is-active': modal.isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
        <button class="delete" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        some content in here :)
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save changes</button>
        <button class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'modal-container',
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

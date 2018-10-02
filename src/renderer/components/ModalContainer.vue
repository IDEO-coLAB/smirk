<template>
  <div class="modal" v-bind:class="{ 'is-active': modal.isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card">
      <ReceiveModal v-if="modal.type === APP_STATE_MODAL_TYPES.RECEIVE" />
      <SendModal v-if="modal.type === APP_STATE_MODAL_TYPES.SEND" />
    </div>
  </div>
</template>

<script>
  import ReceiveModal from './ReceiveModal'
  import SendModal from './SendModal'
  import { APP_STATE_MUTATIONS, APP_STATE_MODAL_TYPES } from '../store/modules/AppState'

  export default {
    name: 'modal-container',
    components: {
      ReceiveModal,
      SendModal
    },
    data () {
      return {
        APP_STATE_MODAL_TYPES
      }
    },
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

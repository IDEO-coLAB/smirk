<template>
  <div class="modal" v-bind:class="{ 'is-active': modal.isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card">
      <!-- <ModalReceive v-if="modal.type === APP_STATE_MODAL_TYPES.RECEIVE" /> -->
      <!-- <ModalSend v-if="modal.type === APP_STATE_MODAL_TYPES.SEND" /> -->
      <ModalTransactionItem v-if="modal.type === APP_STATE_MODAL_TYPES.TRANSACTION_ITEM" />
    </div>
  </div>
</template>

<script>
  // import ModalReceive from './ModalReceive'
  // import ModalSend from './ModalSend'
  import ModalTransactionItem from './ModalTransactionItem'
  import { APP_STATE_MUTATIONS, APP_STATE_MODAL_TYPES } from '../store/modules/AppState'

  export default {
    name: 'modal-container',
    components: {
      ModalReceive,
      // ModalSend,
      ModalTransactionItem
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

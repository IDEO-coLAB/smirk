<template>
  <main>
  <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <div>
      {{ spendable | grinBaseNumToPrettyNum }} Spendable T3 Grin
      <br>
      {{$store.getters.wallet.summary}}
      <hr>
      <button
        @click="openModal(APP_STATE_MODAL_TYPES.RECEIVE)"
        class="button">
        Receive
      </button>

      <button
        @click="openModal(APP_STATE_MODAL_TYPES.SEND)"
        class="button">
        Send
      </button>
    </div>
  </main>
</template>

<script>
  import { APP_STATE_MODAL_TYPES, APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'dashboard-page',
    data () {
      return {
        APP_STATE_MODAL_TYPES
      }
    },
    computed: {
      spendable () {
        return this.$store.getters.spendable
      }
    },
    methods: {
      openModal (type) {
        this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: true, type })
      }
    }
  }
</script>

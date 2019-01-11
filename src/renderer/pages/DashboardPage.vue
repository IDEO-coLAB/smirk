<template>
  <main>
    <FullscreenFileUpload class-styles="upload is-global" />
    <div class="dashboard-content is-uppercase has-text-centered">
      <span
        class="is-size-6 has-text-weight-semibold"
        @click="showDetails">
        Spendable Balance <i class="fas fa-caret-down"></i>
      </span>
      <h1 class="has-text-white">G {{ spendable | grinBaseNumToPrettyNum }}</h1>
    </div>
    <div class="dashboard-actions">
      <router-link
        to="/send"
        class="button is-dashboard is-success is-uppercase">
        Send
      </router-link>
      <router-link
        to="/receive"
        class="button is-dashboard  is-warning is-uppercase">
        Receive
      </router-link>
    </div>
  <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
  </main>
</template>

<script>
  import FullscreenFileUpload from '../components/FullscreenFileUpload'
  // import { APP_STATE_MODAL_TYPES, APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'dashboard-page',
    components: {
      FullscreenFileUpload
    },
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
      showDetails () {

      }
      // openModal (type) {
      //   this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: true, type })
      // }
    }
  }
</script>

<template>
  <main>
    <FullscreenFileUpload class-styles="upload is-global" />

    <div class="snapshot">
      <div class="content is-uppercase has-text-centered">
        Spendable Balance
        <h1 class="has-text-white">G {{ spendable | grinBaseNumToPrettyNum }}</h1>
      </div>
      <div class="buttons">
        <router-link
          to="/send"
          class="button is-success is-uppercase">
          Send
        </router-link>
        <router-link
          to="/receive"
          class="button is-warning is-uppercase">
          Receive
        </router-link>
      </div>
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
      <div>
        <!-- <router-link class="linker b" to="/balance">Balance</router-link> -->
      </div>
    </div>
  </main>
</template>

<script>
  import FullscreenFileUpload from '../components/FullscreenFileUpload'
  import { APP_STATE_MODAL_TYPES, APP_STATE_MUTATIONS } from '../store/modules/AppState'

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
      openModal (type) {
        this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: true, type })
      }
    }
  }
</script>

<template>
  <main>
    <FullscreenFileUpload />
    <h1>Dashboard</h1>
  <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <div>
      <br>
      <br>
      {{ spendable | grinBaseNumToPrettyNum }} Spendable T3 Grin
      <br>
      <router-link class="linker b" to="/balance">Balance</router-link> |
      <router-link to="/send">Send</router-link> |
      <router-link to="/receive">Receive</router-link>
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

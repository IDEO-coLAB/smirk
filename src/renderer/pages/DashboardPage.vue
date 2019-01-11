<template>
  <main>

    <div class="dashboard">
      <FullscreenFileUpload class-styles="upload is-global" />

      <div
        class="dashboard-content is-uppercase has-text-centered"
        @click="resizeWindow">
        <span class="is-size-6 has-text-weight-semibold">
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
    </div>

    <div
      class="body"
      v-if="appIsExpanded">
      Show the balance here!
      <h1>dskjnsdkj</h1>
      <h1>dskjnsdkj</h1>
      <h1>dskjnsdkj</h1>
      <h1>dskjnsdkj</h1>
      <h1>dskjnsdkj</h1>
      <h1>dskjnsdkj</h1>
      <h1>dskjnsdkj</h1>
      <h1>dskjnsdkj</h1>
      <h1>dskjnsdkj</h1>
    </div>
  <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
  </main>
</template>

<script>
  import FullscreenFileUpload from '../components/FullscreenFileUpload'
  import { resizeWindow } from '../utils/layout'

  export default {
    name: 'dashboard-page',
    components: {
      FullscreenFileUpload
    },
    // data () {
    //   return {
    //     APP_STATE_MODAL_TYPES
    //   }
    // },
    computed: {
      spendable () {
        return this.$store.getters.spendable
      },
      appIsExpanded () {
        return this.$store.getters.appIsExpanded
      }
    },
    methods: {
      resizeWindow () {
        resizeWindow(this.$store)
      }
      // openModal (type) {
      //   this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: true, type })
      // }
    }
  }
</script>

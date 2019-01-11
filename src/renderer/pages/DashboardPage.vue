<template>
  <main>

    <div class="dashboard">
      <FullscreenFileUpload class-styles="upload is-global" />

      <div
        class="dashboard-content is-uppercase has-text-centered"
        @click="toggleWindow">
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

      <!-- Chart for balance -->
      <div class="progress-bars">
        <span
          class="progress-bar is-success"
          :style="{ width: spendableWidth }">
        </span>
        <span
          class="progress-bar is-warning"
          :style="{ width: lockedWidth }">
        </span>
      </div>
      <span class="tag is-success">Spendable</span>
      <span class="tag is-warning">Locked</span>

      <div v-if="">

      </div>

    </div>
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
    computed: {
      spendable () {
        return this.$store.getters.spendable
      },
      appIsExpanded () {
        return this.$store.getters.appIsExpanded
      },
      wallet () {
        return this.$store.getters.wallet
      },
      // TODO: Move this to a getter
      lockedWidth () {
        if (!this.wallet.summary) return
        return `${this.wallet.summary.amount_awaiting_confirmation / this.wallet.summary.total * 100}%`
      },
      // TODO: Move this to a getter
      spendableWidth () {
        if (!this.wallet.summary) return
        return `${this.wallet.summary.amount_currently_spendable / this.wallet.summary.total * 100}%`
      }
    },
    methods: {
      toggleWindow () {
        resizeWindow(this.$store)
      }
    }
  }
</script>

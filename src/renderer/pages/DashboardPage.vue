<template>
  <main>

    <div class="dashboard">
      <FullscreenFileUpload class-styles="upload is-global" />

      <div
        class="dashboard-content is-uppercase has-text-centered"
        @click="toggleWindow">
        <span class="is-size-6 has-text-weight-semibold">
          Spendable Balance
          <i
            class="fas"
            v-bind:class="{
              'fa-caret-down': !appIsExpanded,
              'fa-caret-up': appIsExpanded
            }">
          </i>
        </span>
        <h1 class="has-text-white">{{ spendable | grinBaseNumToPrettyNum }} G</h1>
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
      <h3>Balance breakdown</h3>
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

      <div class="tags">
        <p>
          <span class="tag is-success">{{ spendable | grinBaseNumToPrettyNum }} Grin</span>
          <span class="is-bold">Spendable</span>
        <br>
          <span class="tag is-warning">{{ locked | grinBaseNumToPrettyNum }} Grin</span>
          <span class="is-bold">Awaiting Confirmation</span>
        </p>
      </div>

      <div v-if="pendingReceivedTransactions.length">
        <h3>Pending incoming transactions</h3>
        <div v-for="tx in pendingReceivedTransactions">
          <TransactionTilePending
            :transaction="tx" />
        </div>
      </div>

      <div v-if="pendingSentTransactions.length">
        <hr>
        <h3>Pending outgoing transactions</h3>
        <div v-for="tx in pendingSentTransactions">
          <TransactionTilePending
            :transaction="tx" />
        </div>
      </div>

    </div>
  </main>
</template>

<script>
  import _ from 'lodash'
  import FullscreenFileUpload from '../components/FullscreenFileUpload'
  import TransactionTilePending from '../components/TransactionTilePending'
  import { resizeWindow, shrinkWindow } from '../utils/app-layout'

  export default {
    name: 'dashboard-page',
    components: {
      FullscreenFileUpload,
      TransactionTilePending
    },
    mounted () {
      shrinkWindow(this.$store)
    },
    computed: {
      spendable () {
        return this.$store.getters.spendable
      },
      locked () {
        return this.$store.getters.locked
      },
      appIsExpanded () {
        return this.$store.getters.appIsExpanded
      },
      wallet () {
        return this.$store.getters.wallet
      },
      pendingTransactions () {
        // a tx is not pending if it has:
        // - been cancelled
        // - a confirmation_ts
        return _.filter(this.$store.getters.transactions, (tx) => {
          if (_.includes(tx.tx_type, 'Cancelled')) {
            return false
          }
          return tx.confirmation_ts === null
        })
      },
      pendingSentTransactions () {
        return _.filter(this.pendingTransactions, (tx) => {
          return _.includes(tx.tx_type, 'Sent')
        })
      },
      pendingReceivedTransactions () {
        return _.filter(this.pendingTransactions, (tx) => {
          return _.includes(tx.tx_type, 'Received')
        })
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

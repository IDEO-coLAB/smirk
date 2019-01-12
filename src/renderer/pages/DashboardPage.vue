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
      <h3>Balance breakdown</h3>
      <p>What is spendable relative to what is locked.</p>
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

      <!-- Tear our better abstraction -->
      <h3>Incoming transactions</h3>

      <div v-for="tx in transactions">
        <TransactionTilePending
          :transaction="tx"
          v-if="transactionWasReceived(tx)" />
      </div>

      <hr>
      <h3>Outgoing transactions</h3>

      <div v-for="tx in transactions">
        <TransactionTilePending
          :transaction="tx"
          v-if="transactionWasSent(tx)" />
      </div>

    </div>
  </main>
</template>

<script>
  import _ from 'lodash'
  import format from 'date-fns/format'
  import FullscreenFileUpload from '../components/FullscreenFileUpload'
  import TransactionTilePending from '../components/TransactionTilePending'
  import { resizeWindow, shrinkWindow } from '../utils/layout'

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
      appIsExpanded () {
        return this.$store.getters.appIsExpanded
      },
      wallet () {
        return this.$store.getters.wallet
      },
      transactions () {
        return this.$store.getters.transactions
      },
      actionableTransactions () {
        return _.filter(this.$store.getters.transactions, (tx) => {
          // if (tx.confirmed || _.includes(tx.tx_type, 'Cancelled')) {
          if (tx.confirmed) {
            return false
          }
          return tx
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
      },
      formatDate (dateStr) {
        const dateFmt = 'MMM D, YYY'
        return format(dateStr, dateFmt)
      },
      transactionWasReceived (tx) {
        return tx.tx_type === 'TxReceived' || tx.tx_type === 'TxReceivedCancelled'
      },
      transactionWasSent (tx) {
        return tx.tx_type === 'TxSent' || tx.tx_type === 'TxSentCancelled'
      }
    }
  }
</script>

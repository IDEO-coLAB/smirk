<template>
  <div class="transaction">

    <div class="transaction-header">ID:{{ transaction.id }} - {{ transaction.creation_ts | dateFormatLong }}</div>

    <div class="transaction-body">
      <table class="table is-fullwidth">
        <tbody>
          <tr>
            <td v-if="transactionWasReceived">Incoming</td>
            <td v-else>Outgoing</td>
            <td v-if="transactionWasReceived">G {{ transaction.amount_credited - transaction.amount_debited | grinBaseNumToPrettyNum }}</td>
            <td v-else>G {{ transaction.amount_debited - transaction.amount_credited | grinBaseNumToPrettyNum }}</td>
          </tr>
          <tr v-if="!transactionWasReceived">
            <td>Change</td>
            <td>G {{ transaction.amount_credited | grinBaseNumToPrettyNum }}</td>
          </tr>
          <tr v-if="!transactionWasReceived">
            <td>Locked</td>
            <td>G {{ transaction.amount_debited | grinBaseNumToPrettyNum }}</td>
          </tr>
          <tr>
            <td>Slate ID</td>
            <td>{{ transaction.tx_slate_id }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="currentState === STATES.PASSIVE"
      class="transaction-footer is-clearfix">
      <button
        @click="setState(STATES.ACTIVE)"
        class="button is-small is-danger">Cancel Transaction</button>
    </div>

    <div
      v-if="currentState === STATES.ACTIVE"
      class="transaction-footer is-clearfix">
      <button
        @click="setState(STATES.PASSIVE)"
        class="button is-small">
          <!-- <span class="icon is-small">
            <i class="fas fa-check"></i>
          </span> -->
          <span>Nevermind</span>
        </button>
      <button
        @click="cancel"
        class="button is-small is-danger">Yes, Cancel It</button>
    </div>

  </div>

</template>

<script>
  import format from 'date-fns/format'

  // import { APP_STATE_MUTATIONS, APP_STATE_MODAL_TYPES } from '../store/modules/AppState'
  // import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  const STATES = {
    PASSIVE: 'PASSIVE',
    ACTIVE: 'ACTIVE'
  }

  export default {
    name: 'pending-transaction-receive',
    props: {
      transaction: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        STATES,
        currentState: STATES.PASSIVE
      }
    },
    computed: {
      transactionWasReceived () {
        return this.transaction.tx_type === 'TxReceived' || this.transaction.tx_type === 'TxReceivedCancelled'
      },
      // NOTE: Also need to know if is confirmed yet...
      date () {
        // TODO: turn this into a short date string format filter
        const dateFmt = 'MMM D'
        const dateStr = !this.transaction.confirmation_ts
          ? this.transaction.creation_ts
          : this.transaction.confirmation_ts
        return format(dateStr, dateFmt)
      }
    },
    methods: {
      setState (state) {
        this.currentState = state
      },
      cancel () {
        console.log('cancelling!')
      }
    }
  }
</script>

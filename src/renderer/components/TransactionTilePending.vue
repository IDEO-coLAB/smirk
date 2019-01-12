<template>
  <div class="transaction">

    <!-- <div class="transaction-header">{{ transaction.creation_ts | dateFormatLong }}</div> -->

    <div class="transaction-body">
      <table class="table is-fullwidth">
        <tbody>
          <tr>
            <td>Tx ID</td>
            <td>{{ transaction.id }}</td>
          </tr>
          <tr>
            <td>Initiated</td>
            <td>{{ transaction.creation_ts | dateFormatLong }}</td>
          </tr>
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
        class="button is-small is-danger">Confirm Cancellation</button>
    </div>

  </div>

</template>

<script>
  import _ from 'lodash'
  import format from 'date-fns/format'
  import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  const STATES = {
    PASSIVE: 'PASSIVE',
    ACTIVE: 'ACTIVE'
  }

  export default {
    name: 'transaction-tile-pending',
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
        return _.includes(this.transaction.tx_type, 'Received')
      },
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
      cancel (event) {
        event.stopPropagation()
        this.$store.dispatch(GRIN_WALLET_ACTIONS.CANCEL_TRANSACTION, this.transaction.id)
          .then((payload) => {
            console.log('tx cancel success: ', payload)
          })
          // TODO: uniform error handler for the app
          .catch((error) => console.warn(error))
      }
    }
  }
</script>

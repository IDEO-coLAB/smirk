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
            <td>Amount</td>
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
  import {
    NOTIFICATION_TYPES,
    NOTIFICATION_MUTATIONS,
    createLargeSuccessNotification,
    createLargeErrorNotification
  } from '../store/modules/Notifications'
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
            const notification = createLargeSuccessNotification({
              title: 'Transaction cancelled',
              type: NOTIFICATION_TYPES.GRIN_API,
              message: `Transaction ${this.transaction.id} successfully cancelled. It will take 10 blocks for this to be reflected in your spendable balance.`
            })
            this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
            // TODO: Best way to resync the app state
          })
          .catch((error) => {
            const notification = createLargeErrorNotification({
              title: 'Error during cancellation',
              type: NOTIFICATION_TYPES.GRIN_API,
              message: `${error.response.data}`
            })
            this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
          })
      }
    }
  }
</script>

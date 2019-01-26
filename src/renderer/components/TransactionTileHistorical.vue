<template>
  <div class="transaction">

    <div class="transaction-body is-marginless">
      <table class="table is-fullwidth">
        <tbody>
          <tr>
            <td>Tx ID</td>
            <td>{{ transaction.id }}</td>
          </tr>
          <tr>
            <td v-if="transactionWasCancelled">Cancelled</td>
            <td v-else>Confirmed</td>

            <td v-if="transactionWasCancelled">True</td>
            <td v-else>{{ transaction.confirmation_ts | dateFormatLong }}</td>
          </tr>
          <tr>
            <td v-if="transactionWasReceived">Received</td>
            <td v-else>Sent</td>

            <td v-if="transactionWasReceived">G {{ transaction.amount_credited - transaction.amount_debited | grinBaseNumToPrettyNum }}</td>
            <td v-else>G {{ transaction.amount_debited - transaction.amount_credited | grinBaseNumToPrettyNum }}</td>
          </tr>
          <tr>
            <td>Slate ID</td>
            <td>{{ transaction.tx_slate_id }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
  import _ from 'lodash'
  export default {
    name: 'transaction-tile-historical',
    props: {
      transaction: {
        type: Object,
        required: true
      }
    },
    computed: {
      transactionWasReceived () {
        return _.includes(this.transaction.tx_type, 'Received')
      },
      transactionWasCancelled () {
        return _.includes(this.transaction.tx_type, 'Cancelled')
      }
    }
  }
</script>

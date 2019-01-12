<template>
  <div class="transaction">

    <!-- <div class="transaction-header">Transaction {{ transaction.id }}</div> -->

    <div class="transaction-body is-marginless">
      <table class="table is-fullwidth">
        <tbody>
          <tr>
            <td>Tx ID</td>
            <td>{{ transaction.id }}</td>
          </tr>
          <tr>
            <td>Confirmed</td>
            <td>{{ transaction.confirmation_ts | dateFormatLong }}</td>
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
  import format from 'date-fns/format'

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
    }
  }
</script>

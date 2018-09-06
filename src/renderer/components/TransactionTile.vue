<template>
  <div @click="openTx(transaction)">
    <hr>

    {{ this.isReceived ? 'Received' : 'Sent' }} |

    tx id: {{ this.transaction.tx_slate_id }} |

    Confirmed {{ new Date(this.transaction.confirmation_ts).toDateString() }} |

    <span v-if="this.isReceived">
      {{ this.transaction.amount_credited | toPrettyNumber }}
    </span>
    <span v-else>
      {{ this.transaction.amount_debited | toPrettyNumber }}
    </span>
  </div>
</template>

<script>
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'
  import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  export default {
    name: 'transaction-tile',
    props: {
      transaction: {
        type: Object,
        required: true
      }
    },
    computed: {
      isReceived () {
        return this.transaction.tx_type === 'TxReceived'
      }
    },
    methods: {
      openTx (tx) {
        this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_OUTPUTS, tx.id)
        this.$store.commit(APP_STATE_MUTATIONS.SET_CURRENT_TX_ID, tx.id)
        this.$router.push({ path: '/transaction/:id', params: { id: tx.id } })
      }
    }
  }
</script>

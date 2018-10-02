<template>
  <div @click="openModal">
    <hr>
    tx ID: {{this.transaction.id}} |

    {{ this.transaction.tx_type }} |

    conf on {{ new Date(this.transaction.confirmation_ts).toDateString() }} |

    <!-- TODO: IMPROVE BASED ON ALL STATES -->
    <span v-if="this.isReceived">
      amount: {{ this.transaction.amount_credited | grinBaseNumToPrettyNum }}
    </span>
    <span v-else>
      amount: {{ this.transaction.amount_debited | grinBaseNumToPrettyNum }}
    </span>
  </div>
</template>

<script>
  import { APP_STATE_MUTATIONS, APP_STATE_MODAL_TYPES } from '../store/modules/AppState'
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
      openModal () {
        const type = APP_STATE_MODAL_TYPES.TRANSACTION
        const id = this.transaction.id

        this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_OUTPUTS_FOR_TRANSACTION, id)
        this.$store.commit(APP_STATE_MUTATIONS.SET_CURRENT_TX_ID, id)
        this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: true, type })
      }
    }
  }
</script>

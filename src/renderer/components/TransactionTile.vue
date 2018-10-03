<template>
  <div @click="openModal">
    <hr>
    {{ this.date }} |

    <!-- tx ID: {{this.transaction.id}} | -->

    type: {{ this.transaction.tx_type }} |

    confirmed: {{ this.transaction.confirmation_ts ? true : false }} |

    amount: {{ amount | grinBaseNumToPrettyNum }}
  </div>
</template>

<script>
  import format from 'date-fns/format'

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
      amount () {
        // debugger
        return this.transaction.tx_type === 'TxReceived' || this.transaction.tx_type === 'TxReceivedCancelled'
          ? this.transaction.amount_credited
          : this.transaction.amount_debited
      },
      date () {
        const dateFmt = 'MMM D'
        const dateStr = !this.transaction.confirmation_ts
          ? this.transaction.creation_ts
          : this.transaction.confirmation_ts
        return format(dateStr, dateFmt)
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

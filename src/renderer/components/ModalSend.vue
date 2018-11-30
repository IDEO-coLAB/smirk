<!-- <template>
  <div>
    <h1>SEND PAGE</h1>
    <router-link to="/dashboard">Dashboard</router-link>

    <form v-on:submit.prevent="sendTransaction">
      <section class="modal-card-body">

        {{ this.transactionTemplate }}
        <hr>

        AMOUNT:
        <input
          min="0"
          v-model="transactionTemplate.amount" />

        <br>
        DEST:
        <input
          type="text"
          v-model="transactionTemplate.dest" />

      </section>

      <footer class="modal-card-foot">
        <button
          class="button is-success"
          type="submit">
          Submit Tx
        </button>

        <button
          class="button"
          @click="closeModal">
          Cancel
        </button>
      </footer>

    </form>

  </div>
</template>

<script>
  import models from '../models'
  import { prettyNumToGrinBaseNum } from '../../utils/grin-utils'
  import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'send-page',
    data () {
      return {
        transactionTemplate: new models.TransactionTemplateToSelf()
      }
    },
    computed: {
      modal () {
        return this.$store.getters.appState.modal
      }
    },
    methods: {
      closeModal () {
        this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: false, type: null })
      },
      sendTransaction () {
        // Use a new object for input formatting
        let formattedTx = Object.assign({}, this.transactionTemplate)

        // NOTE: YOU CANNOT DO DECIMALS
        // console.log('formattedTx.amount', formattedTx.amount)
        // console.log('this.transactionTemplate.amount', this.transactionTemplate.amount)

        // Convert tx amount to the Grin base format
        console.log(prettyNumToGrinBaseNum(this.transactionTemplate.amount))
        formattedTx.amount = prettyNumToGrinBaseNum(this.transactionTemplate.amount)

        // the call below are the self send flow
        this.$store.dispatch(GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION, formattedTx)
          .then((payload) => {
            this.$store.dispatch(GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION, payload)
            return payload
          })
          .then((payload) => {
            this.$store.dispatch(GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION, payload)
            return payload
          })
          // TODO: uniform error handler for the app
          .catch((error) => console.warn(error))
      }
    }
  }
</script>
 -->

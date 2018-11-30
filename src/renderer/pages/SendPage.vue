<template>
  <div>
    <h1>SEND PAGE</h1>
    <router-link to="/dashboard">Dashboard</router-link>

    <h3>Send Method</h3>
    <div class="control">
      <label class="radio">
        <input type="radio" value="HTTP" v-model="wayOfSending" :checked="wayOfSending===WAYS_TO_SEND.HTTP" />
        HTTP
      </label>
      <label class="radio">
        <input type="radio" value="FILE" v-model="wayOfSending" :checked="wayOfSending===WAYS_TO_SEND.FILE" />
        FILE
      </label>
      <label class="radio">
        <input type="radio" value="SERVICE" v-model="wayOfSending" :checked="wayOfSending===WAYS_TO_SEND.SERVICE" />
        SERVICE
      </label>
    </div>

    <div v-show="currentStep===SEND_STEPS.CONSTRUCT">
      <form v-on:submit.prevent="confirmTransaction">
        AMOUNT:
        <input
          min="0"
          v-model="transactionTemplate.amount" />

        <br>
        <div v-if="wayOfSending===WAYS_TO_SEND.HTTP">
          DEST:
          <input
            type="text"
            v-model="transactionTemplate.dest" />
        </div>

        <label class="checkbox">
          <input type="checkbox"
            v-model="showAdvancedOptions"
            :checked="showAdvancedOptions" />
          Show Advanced Options
        </label>

        <div v-if="showAdvancedOptions">

          <label class="checkbox">
            <input type="checkbox"
              v-model="transactionTemplate.fluff"
              :checked="transactionTemplate.fluff" />
            Use Dandelion Protocol
          </label>

          <br>
          <label class="checkbox">
            <input type="checkbox"
              v-model="transactionTemplate.selection_strategy_is_use_all"
              :checked="transactionTemplate.selection_strategy_is_use_all" />
            Combine existing outputs for this transaction
          </label>

          <br>
          NUM CHANGE OUTPUTS:
          <input
            min="1"
            step="1"
            type="number"
            v-model="transactionTemplate.num_change_outputs" />

          <br>
          MINIMUM CONFIRMATIONS:
          <input
            min="1"
            step="3"
            type="number"
            v-model="transactionTemplate.minimum_confirmations" />

        </div>

        <br>
        <button
          class="button is-success"
          type="submit">
          Confirm
        </button>
      </form>
    </div>

    <div v-show="currentStep===SEND_STEPS.SEND">
      {{transactionTemplate}}
    </div>

  </div>
</template>

<script>
  import models from '../models'
  // import { prettyNumToGrinBaseNum } from '../../utils/grin-utils'
  // import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  const SEND_STEPS = {
    CONSTRUCT: 'CONSTRUCT',
    SEND: 'SEND'
  }

  const WAYS_TO_SEND = {
    HTTP: 'HTTP',
    FILE: 'FILE',
    SERVICE: 'SERVICE'
  }

  export default {
    name: 'send-page',
    data () {
      return {
        SEND_STEPS: SEND_STEPS,
        currentStep: SEND_STEPS.CONSTRUCT,
        WAYS_TO_SEND: WAYS_TO_SEND,
        wayOfSending: WAYS_TO_SEND.FILE,
        showAdvancedOptions: false,
        transactionTemplate: new models.TransactionTemplateToOther()
      }
    },
    computed: {},
    methods: {
      confirmTransaction () {
        // advance the process
        this.currentStep = SEND_STEPS.SEND

        // Use a new object for input formatting
        // let formattedTx = Object.assign({}, this.transactionTemplate)

        // set the tx.method based on the wayOfSending // http vs file

        // // Convert tx amount to the Grin base format
        // console.log(prettyNumToGrinBaseNum(this.transactionTemplate.amount))
        // formattedTx.amount = prettyNumToGrinBaseNum(this.transactionTemplate.amount)

        // // the call below are the self send flow
        // this.$store.dispatch(GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION, formattedTx)
        //   .then((payload) => {
        //     this.$store.dispatch(GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION, payload)
        //     return payload
        //   })
        //   .then((payload) => {
        //     this.$store.dispatch(GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION, payload)
        //     return payload
        //   })
        //   // TODO: uniform error handler for the app
        //   .catch((error) => console.warn(error))
      }
    }
  }
</script>

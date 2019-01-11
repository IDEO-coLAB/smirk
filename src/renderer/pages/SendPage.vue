<template>
  <div>

    <div class="header">

      <div class="header-anchor">
        <router-link to="/dashboard" tag="button" class="button is-header">
          <span class="icon"><i class="fas fa-times"></i></span>
        </router-link>
      </div>

      <div class="header-dropdown">

        <div
          class="dropdown"
          @click="toggleDropdown"
          v-bind:class="{ 'is-active': dropdownIsActive }">

          <div class="dropdown-trigger is-header">
            <button class="button is-header">
              <span>{{sendMethod.title}}</span>
              <span class="icon is-medium">
                <i class="fas fa-md fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>

          <div class="dropdown-menu is-header" role="menu">
            <div class="dropdown-content">
              <span
                v-for="(data, key) in SEND_METHODS"
                @click="setSendMethod(data)"
                >
                <a class="dropdown-item is-header" v-bind:class="{ 'is-active' : key === sendMethod.key }">
                  <h3>{{data.title}}</h3>
                  <p>{{data.detail}}</p>
                </a>
                <hr v-if="key !== 'FILE'" class="dropdown-divider">
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>


    <form
      v-on:submit.prevent
      v-if="currentStep !== SLATE_SEND_STEPS.SEND_COMPLETE">

      <div class="body">

        <div class="field">
          <label class="label">Amount</label>
          <div class="control">
            <input
              min="0"
              step="1"
              type="number"
              class="input"
              v-bind:disabled="currentStep !== SLATE_SEND_STEPS.INPUT_DATA"
              placeholder="Amount to send"
              v-model="transactionTemplate.amount"/>
          </div>
        </div>

        <!-- TODO: Decide how to do input validation -->
        <div v-if="sendMethod===SEND_METHODS.HTTP" class="field">
          <label class="label">IP Address</label>
          <div class="control">
            <input
              class="input"
              placeholder="http://<IP_ADDR>:<PORT>"
              v-bind:disabled="currentStep !== SLATE_SEND_STEPS.INPUT_DATA"
              v-model="transactionTemplate.dest"/>
          </div>
        </div>

        <div class="field">
          <p
            class="is-clickable"
            @click="showAdvancedOptions = !showAdvancedOptions">
            {{showAdvancedOptions ? 'Hide' : 'Show'}} advanced options
          </p>
        </div>

        <div v-if="showAdvancedOptions">

          <div class="field has-addons">
            <div class="control">
              <span class="select">
                <select
                  class="is-minwidth"
                  v-bind:disabled="currentStep !== SLATE_SEND_STEPS.INPUT_DATA"
                  v-model="transactionTemplate.fluff">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </span>
            </div>
            <div class="control">
              <a class="button is-set-width is-static">
                Use Dandelion
              </a>
            </div>
          </div>

          <div class="field has-addons">
            <div class="control">
              <span class="select">
                <select
                  class="is-minwidth"
                  v-bind:disabled="currentStep !== SLATE_SEND_STEPS.INPUT_DATA"
                  v-model="transactionTemplate.selection_strategy_is_use_all">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </span>
            </div>
            <div class="control">
              <a class="button is-set-width is-static">
                Combine Outputs
              </a>
            </div>
          </div>

          <div class="field has-addons">
            <div class="control">
              <input
                min="1"
                step="1"
                type="number"
                class="input"
                v-bind:disabled="currentStep !== SLATE_SEND_STEPS.INPUT_DATA"
                v-model="transactionTemplate.num_change_outputs"
              />
            </div>
            <div class="control">
              <a class="button is-set-width is-static">
                Change Output{{ transactionTemplate.num_change_outputs > 1 ? 's' : '' }}
              </a>
            </div>
          </div>

          <div class="field has-addons">
            <div class="control">
              <input
                min="1"
                step="1"
                type="number"
                class="input"
                v-bind:disabled="currentStep !== SLATE_SEND_STEPS.INPUT_DATA"
                v-model="transactionTemplate.minimum_confirmations"
              />
            </div>
            <div class="control">
              <a class="button is-set-width is-static">
                Required Confirmation{{ transactionTemplate.minimum_confirmations > 1 ? 's' : '' }}
              </a>
            </div>
          </div>

        </div>
      </div>

      <div
        class="footer columns is-gapless is-mobile"
        v-if="currentStep === SLATE_SEND_STEPS.INPUT_DATA">
        <button
          class="column button is-success is-footer is-fullwidth"
          @click="setStep(SLATE_SEND_STEPS.CONFIRM_DATA)">
          Confirm Before Sending
        </button>
      </div>

      <div
        class="footer columns is-gapless is-mobile"
        v-if="currentStep === SLATE_SEND_STEPS.CONFIRM_DATA">
        <button
          class="column button is-warning is-footer is-fullwidth"
          @click="setStep(SLATE_SEND_STEPS.INPUT_DATA)">
          Edit
        </button>
        <button
          class="column button is-success is-footer is-fullwidth"
          @click="sendTransaction">
          Send
        </button>
      </div>

    </form>




    <div v-if="currentStep===SLATE_SEND_STEPS.SEND_COMPLETE">


      <div class="body without-footer">
        <h3>How to use this slate</h3>
        <p>Copy or download the JSON below, then send it to a recipient over secure chat or email.</p>
        <div class="code-container">
          {"num_participants":2,"id":"0c7192e5-71ae-40db-bf45-4c61746daa41","tx":{"offset":[3,115,37,176,136,137,249,123,83,229,67,226,1,41,233,17,95,237,176,7,232,72,56,23,57,48,52,12,205,7,121,196],"body":{"inputs":[{"features":{"bits":0},"commit":[8,187,70,211,246,25,237,195,46,244,141,71,24,167,248,39,151,103,143,76,212,22,19,206,180,125,152,85,29,166,197,142,186]}],"outputs":[{"features":{"bits":0},"commit":[9,44,164,104,38,179,185,27,250,100,222,36,175,97,185,86,182,32,194,188,216,206,27,135,28,202,65,78,127,209,176,2,34],"proof":[22,194,116,15,170,106,239,27,76,203,253,34,52,253,210,203,67,60,98,167,55,14,176,193,129,170,189,240,115,139,167,167,157,246,2,128,187,53,248,192,160,56,95,129,80,67,192,200,10,55,166,89,226,171,144,95,141,189,199,223,181,44,134,67,8,232,215,175,95,183,191,103,7,40,249,38,80,181,49,228,129,175,1,144,73,33,199,233,59,245,75,95,241,143,49,158,195,230,66,23,71,177,150,195,2,205,7,251,242,238,95,72,88,7,212,38,177,201,147,167,156,18,48,115,205,144,180,126,152,101,83,94,56,168,216,237,9,115,191,32,126,171,56,42,168,94,232,201,31,190,97,134,148,96,55,45,123,184,156,56,116,136,176,91,20,40,13,151,22,238,28,77,176,138,132,242,141,203,22,103,45,239,205,204,71,251,82,113,45,6,250,90,0,247,19,53,44,52,25,126,245,116,205,79,247,93,133,186,182,110,108,151,27,247,235,29,112,194,170,209,243,129,232,59,180,97,99,15,233,129,228,243,7,92,77,108,56,158,149,74,191,205,198,11,166,58,160,22,64,143,183,219,16,148,88,246,58,50,173,35,219,76,48,247,167,234,201,80,196,160,73,78,37,11,157,62,116,137,31,232,143,149,252,138,47,230,86,182,234,71,182,49,251,62,61,56,246,69,118,132,83,216,150,18,140,210,150,90,136,122,158,56,78,42,223,207,191,181,227,217,205,194,136,195,102,78,43,55,118,39,76,148,153,226,41,206,38,223,196,114,12,75,236,75,198,122,252,200,64,13,243,17,63,78,0,202,242,147,61,149,224,132,167,148,156,249,239,29,238,10,245,25,194,33,108,45,89,51,22,134,63,200,73,61,24,60,66,97,225,138,99,83,194,246,146,200,208,219,157,40,87,128,136,190,81,176,97,180,248,195,53,121,202,46,163,13,132,55,212,18,20,67,114,186,235,179,230,14,200,74,149,52,214,203,155,229,153,209,32,6,231,72,8,33,240,117,126,75,106,32,146,111,53,108,242,136,185,188,140,113,69,144,101,7,252,130,208,208,94,30,176,151,180,98,175,207,195,216,95,91,85,155,68,105,232,97,74,192,106,219,177,109,41,239,209,73,191,245,230,83,163,244,131,206,87,226,147,192,228,196,232,121,208,245,133,79,137,126,99,153,186,206,22,128,206,174,153,218,79,0,109,107,220,75,14,64,185,46,67,44,89,178,105,215,2,72,103,232,151,39,246,156,238,91,53,202,135,60,34,227,220,20,209,16,144,206,218,78,3,249,177,249,131,26,126,88,27,148,115,194,232,215,141,143,148,10,221,248,82,243,17,194,147,131,24,82,139,76,251,210,106,15,17,191,191,102,193,192,48,79,40,163,246,67,54,183,112,133,89,43,163,109,78,143,82,47,241,27,137,112,78,148,55,92,29,185,227,172,239,243,129,208,252,32,158,52,60,49,128,220,218,111,19,136,202,24,31,175,130,173,239,202,153,139,61,195,111,218,74,19,153,180,93,153,84]}],"kernels":[{"features":{"bits":2},"fee":8000000,"lock_height":15629,"excess":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"excess_sig":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}]}},"amount":10000000000,"fee":8000000,"height":15629,"lock_height":15629,"participant_data":[{"id":0,"public_blind_excess":[2,138,228,176,75,175,176,69,218,240,173,86,148,85,208,192,40,230,203,22,77,55,19,239,79,5,164,157,13,65,65,70,190],"public_nonce":[3,219,59,228,173,90,238,82,179,110,246,232,203,179,190,45,226,49,120,229,68,2,198,150,201,59,169,19,200,74,188,56,13],"part_sig":null,"message":null,"message_sig":null}]}
        </div>
        <button class="button is-success is-fullwidth">Download to File</button>
      </div>

    </div>

  </div>
</template>

<script>
  import models from '../models'
  import { APP_STATE_MUTATIONS, NOTIFICATION_TYPES } from '../store/modules/AppState'

  // import { prettyNumToGrinBaseNum } from '../../utils/grin-utils'
  // import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  const SLATE_SEND_STEPS = {
    INPUT_DATA: 'INPUT_DATA',
    CONFIRM_DATA: 'CONFIRM_DATA',
    SEND_COMPLETE: 'SEND_COMPLETE'
  }

  const SEND_METHODS = {
    HTTP: {
      key: 'HTTP',
      grinMethod: 'http',
      title: 'Send to an IP address',
      detail: 'some detail text regaring IP addresses is going to go here'
    },
    FILE: {
      key: 'FILE',
      grinMethod: 'file',
      title: 'Send using a slate',
      detail: 'some detail text'
    }
    // ,
    // SERVICE: {
    //   key: 'SERVICE',
    //   grinMethod: 'file',
    //   title: 'Send with Grinbox',
    //   detail: 'some detail text'
    // }
  }

  export default {
    name: 'send-page',
    mounted () {
      this.$store.commit(APP_STATE_MUTATIONS.SET_APP_NOTIFICATION, {
        isFullscreen: false,
        type: NOTIFICATION_TYPES.ERROR,
        title: 'Some error titles',
        message: 'And this will be some descriptive text talking a person down from jumping off the ledge.'
      })
    },
    data () {
      return {
        dropdownIsActive: false,
        showAdvancedOptions: false,

        SLATE_SEND_STEPS: SLATE_SEND_STEPS,
        currentStep: SLATE_SEND_STEPS.INPUT_DATA,
        SEND_METHODS: SEND_METHODS,
        sendMethod: SEND_METHODS.FILE,

        transactionTemplate: new models.TransactionTemplateToOther()
      }
    },
    computed: {},
    methods: {
      toggleDropdown () {
        this.dropdownIsActive = !this.dropdownIsActive
      },
      setSendMethod (method) {
        this.currentStep = this.SLATE_SEND_STEPS.INPUT_DATA
        this.sendMethod = method
      },
      setStep (step) {
        this.currentStep = step
      },
      sendTransaction () {
        // advance the process
        this.setStep(this.SLATE_SEND_STEPS.SEND_COMPLETE)

        // Use a new object for input formatting
        // let formattedTx = Object.assign({}, this.transactionTemplate)

        // set the tx.method based on the sendMethod // http vs file

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

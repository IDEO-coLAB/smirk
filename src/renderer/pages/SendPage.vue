<template>
  <div>
    <!-- Page header -->
    <div class="header">

      <!-- Header anchor nav button -->
      <div class="header-anchor">
        <router-link to="/dashboard" tag="button" class="button is-header">
          <span class="icon"><i class="fas fa-times"></i></span>
        </router-link>
      </div>

      <!-- Header dropdown selector -->
      <div class="header-dropdown">

        <div
          class="dropdown"
          @click="toggleDropdown"
          v-bind:class="{ 'is-active': dropdownIsActive }">

          <!-- Dropdown button (this is the visible text) -->
          <div class="dropdown-trigger is-header">
            <button class="button is-header">
              <span>{{sendMethod.title}}</span>
              <span class="icon is-medium">
                <i class="fas fa-md fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>

          <!-- The dropdown selection menu -->
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

    <div v-if="currentStep !== SLATE_SEND_STEPS.SEND_COMPLETE">

      <div class="body">

        <!-- Tx Amount -->
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

        <!-- IP Address -->
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

        <!-- Option to toggle showing the advanced options -->
        <div class="field">
          <p
            class="is-clickable"
            @click="showAdvancedOptions = !showAdvancedOptions">
            {{showAdvancedOptions ? 'Hide' : 'Show'}} advanced options
          </p>
        </div>

        <!-- Section to show advanced options -->
        <div v-if="showAdvancedOptions">

          <!-- Dandelion -->
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

          <!-- Use all inputs in the transaction -->
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

          <!-- Number of change outputs to create -->
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

          <!-- Minimum number of confirmations -->
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

      <!-- Button for INPUT_DATA Step -->
      <div
        class="footer columns is-gapless is-mobile"
        v-if="currentStep === SLATE_SEND_STEPS.INPUT_DATA">
        <button
          class="column button is-success is-footer is-fullwidth"
          @click="setStep(SLATE_SEND_STEPS.CONFIRM_DATA)">
          Confirm Before Sending
        </button>
      </div>

      <!-- Button for CONFIRM_DATA Step -->
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

    </div>

    <!-- Completion Step -->
    <div v-if="currentStep===SLATE_SEND_STEPS.SEND_COMPLETE">

      <!-- Completion for FILE Send -->
      <div
        v-if="sendMethod===SEND_METHODS.FILE"
        class="body without-footer">
        <h3>How to use this slate</h3>
        <p>Copy or download the JSON below, then send it to a recipient over secure chat or email.</p>
        <p class="json"> Lots of JSON here</p>
        <button class="button is-success is-fullwidth">Download to File</button>
      </div>

      <!-- We do not require explicit confirm screen for HTTP (comments below) -->
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

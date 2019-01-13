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
                @click="setMethod(data)"
                >
                <a
                  class="dropdown-item is-header"
                  v-bind:class="{
                    'is-active' : key === sendMethod.key
                  }">
                  <h4>{{data.title}}</h4>
                  <p>{{data.detail}}</p>
                </a>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Information collecton and confirmation steps -->
    <div v-if="currentStep === SEND_STEPS.SEND_COMPLETE">

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
              v-bind:disabled="currentStep !== SEND_STEPS.INPUT_DATA"
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
              v-bind:disabled="currentStep !== SEND_STEPS.INPUT_DATA"
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
                  v-bind:disabled="currentStep !== SEND_STEPS.INPUT_DATA"
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
                  v-bind:disabled="currentStep !== SEND_STEPS.INPUT_DATA"
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
                v-bind:disabled="currentStep !== SEND_STEPS.INPUT_DATA"
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
                v-bind:disabled="currentStep !== SEND_STEPS.INPUT_DATA"
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
        v-if="currentStep === SEND_STEPS.INPUT_DATA">
        <button
          class="column button is-success is-footer is-fullwidth"
          @click="setStep(SEND_STEPS.CONFIRM_DATA)">
          Next
        </button>
      </div>

      <!-- Button for CONFIRM_DATA Step -->
      <div
        class="footer columns is-gapless is-mobile"
        v-if="currentStep === SEND_STEPS.CONFIRM_DATA">
        <button
          class="column button is-footer is-fullwidth"
          @click="setStep(SEND_STEPS.INPUT_DATA)">
          Back to Edit
        </button>
        <!-- If File -->
        <button
          v-if="sendMethod===SEND_METHODS.FILE"
          class="column button is-success is-footer is-fullwidth"
          @click="createTransactionFile">
          Create Slate
        </button>
        <!-- If Http -->
        <button
          v-if="sendMethod===SEND_METHODS.HTTP"
          class="column button is-success is-footer is-fullwidth"
          @click="createTransactionFile">
          Send Grin
        </button>
      </div>

    </div>

    <!-- Completion Step -->
    <div v-if="currentStep!==SEND_STEPS.SEND_COMPLETE">

      <!-- Completion for FILE Send -->
      <div
        v-if="sendMethod===SEND_METHODS.FILE"
        class="body without-footer">
        <h3>Transaction file created</h3>
        <!-- TODO: specific path messaging -->
        <p>You can find the file in your <code>Downloads</code> folder. You can also copy the JSON below and send it to a recipient over secure chat or email.</p>
        <p class="json">{{ transactionFileJSON }}</p>
        <button
          class="button is-success is-fullwidth"
          @click="downloadTransaction">
          Download Again
        </button>
      </div>

      <!-- We do not require explicit confirm screen for HTTP (comments below) -->
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import models from '../models'
  import {
    NOTIFICATION_MUTATIONS,
    createSmallSuccessNotification,
    createLargeErrorNotification
  } from '../store/modules/Notifications'
  import { prettyNumToGrinBaseNum } from '../utils/grin-utils'
  import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  const SEND_STEPS = {
    INPUT_DATA: 'INPUT_DATA',
    CONFIRM_DATA: 'CONFIRM_DATA',
    SEND_COMPLETE: 'SEND_COMPLETE'
  }

  const SEND_METHODS = {
    HTTP: {
      key: 'HTTP',
      grinMethod: 'http',
      title: 'Send to an online wallet',
      detail: 'This is how you send something by IP address; it is a direct connection.'
    },
    FILE: {
      key: 'FILE',
      grinMethod: 'file',
      title: 'Create a transaction file',
      detail: 'This is how you send things by way of horseless carriage.'
    }
  }

  export default {
    name: 'send-page',
    data () {
      return {
        dropdownIsActive: false,
        showAdvancedOptions: false,
        SEND_STEPS: SEND_STEPS,
        currentStep: SEND_STEPS.INPUT_DATA,
        SEND_METHODS: SEND_METHODS,
        sendMethod: SEND_METHODS.FILE,
        transactionTemplate: new models.TransactionTemplate(),
        transactionFileJSON: null
      }
    },
    methods: {
      toggleDropdown () {
        this.dropdownIsActive = !this.dropdownIsActive
      },
      setMethod (method) {
        this.currentStep = this.SEND_STEPS.INPUT_DATA
        this.sendMethod = method
      },
      setStep (step) {
        this.currentStep = step
      },
      downloadTransaction (tx) {
        // TODO: should we use a dynamic/different name for the file?
        ipcRenderer.send('DOWNLOAD_FILE', {
          filename: `tx_${tx.id}`,
          filedata: JSON.stringify(tx)
        })
      },
      createTransactionFile () {
        // Use a new object for input formatting
        let formattedTx = Object.assign({}, this.transactionTemplate)

        // set the tx.method based on what was set // http vs file
        formattedTx.method = this.sendMethod.grinMethod
        // Convert tx amount to the Grin base format
        formattedTx.amount = prettyNumToGrinBaseNum(this.transactionTemplate.amount)

        // File send
        this.$store.dispatch(GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION, formattedTx)
          .then((payload) => {
            // Alert the user
            const notification = createSmallSuccessNotification({
              title: 'Transaction file created'
            })
            this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)

            // Route to the completion page
            this.setStep(this.SEND_STEPS.SEND_COMPLETE)

            // Set the local variable so a user can copy and past manually
            this.transactionFileJSON = payload

            // Auto-download the content to the filesystem
            this.downloadTransaction(payload)
          })
          .catch((error) => {
            const notification = createLargeErrorNotification({
              title: 'Transaction error',
              message: error.response.data
            })
            this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
          })
      }
    }
  }
</script>

<template>
  <div>

    <!-- Page header -->
    <div class="header">

      <!-- Header anchor nav button -->
      <span class="header-anchor">
        <router-link to="/dashboard" tag="button" class="button is-header">
          <span class="icon"><i class="fas fa-angle-left"></i></span>
        </router-link>
      </span>

      <!-- Header dropdown selector -->
      <div class="header-dropdown">

        <div
          class="dropdown is-header"
          v-bind:class="{ 'is-active': dropdownIsActive }"
          @click="toggleDropdown">

          <!-- Dropdown button (this is the visible text) -->
          <div class="dropdown-trigger is-header">
            <button class="button is-header">
              <span>{{receiveMethod.title}}</span>
              <span class="icon is-medium">
                <i class="fas fa-md fa-angle-down"></i>
              </span>
            </button>
          </div>

          <!-- The dropdown selection menu -->
          <div class="dropdown-menu is-header" role="menu">
            <div class="dropdown-content">
              <span
                v-for="(data, key) in RECEIVE_METHODS"
                @click="setMethod(data)"
                >
                <a
                  class="dropdown-item is-header"
                  v-bind:class="{
                    'is-active' : key === receiveMethod.key
                  }">
                  <h3>{{data.title}}</h3>
                  <p>{{data.detail}}</p>
                </a>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Handle the SELECT_METHOD step -->
    <div v-if="currentStep===RECEIVE_STEPS.SELECT_METHOD">

      <!-- Handle the IP use case -->
      <div v-if="receiveMethod===RECEIVE_METHODS.HTTP">
        <div class="body without-footer">
          <h3>Receive directly</h3>
          <p>Follow the directions below to receive transactions directly from another wallet.</p>

          <section class="section">
            <h4>
              <span class="icon has-text-danger">
                <i class="fas fa-caret-square-right"></i>
              </span>
              &nbsp;Share your IP address
            </h4>
            <p>
              You need to share your IP address with the sender so they can connect to your wallet. Your current IP address is <code>{{ipAddress}}</code>
            </p>
          </section>

          <section class="section">
            <h4>
              <span class="icon has-text-danger">
                <i class="fas fa-caret-square-right"></i>
              </span>
              &nbsp;Listen for transactions
            </h4>
            <p>
              You also need to enable your wallet to listen for incoming transactions. Start the wallet listener using the following command: <br> <code>$ grin wallet listen</code>
            </p>
          </section>
        </div>
      </div>

      <!-- Handle FILE use case -->
      <div v-if="receiveMethod===RECEIVE_METHODS.FILE">
        <div class="body" >
          <h3>Transact by file</h3>
          <p v-if="!uploadedTransaction">Drop a transaction file into the upload area.</p>
          <p v-else>
            <span class="icon has-text-success">
              <i class="fas fa-file-signature"></i>
            </span>
            Sign the transaction before returning it to the sender.
          </p>

          <section class="section">
            <FullscreenFileUpload
              class-styles="upload"
              v-if="!uploadedTransaction"/>
            <div v-else class="json">
              {{uploadedTransaction}}
            </div>
          </section>
        </div>

        <div class="footer columns is-gapless is-mobile">
          <button
            class="column button is-footer is-fullwidth"
            v-bind:disabled="!uploadedTransaction"
            @click="removeTransaction">
            Cancel
          </button>
          <button
            class="column button is-success is-footer is-fullwidth"
            v-bind:disabled="!uploadedTransaction"
            @click="receiveTransaction">
            Sign Transaction
          </button>
        </div>
      </div>

    </div>

    <!-- Handle the RECEIVE_COMPLETE step -->
    <div v-if="currentStep===RECEIVE_STEPS.RECEIVE_COMPLETE">
      <div class="body without-footer">
        <h3>Transaction signed</h3>
        <p>You'll find the signed transaction file in your <code>~/Downloads/</code> folder. You can also copy the JSON below and return it to the sender over secure chat or email.</p>
        <p class="json">{{uploadedTransaction}}</p>
        <button
          class="button is-success is-fullwidth"
          @click="downloadTransaction">
          Download Again
        </button>
      </div>
    </div>

  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import FullscreenFileUpload from '../components/FullscreenFileUpload'
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'
  import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'
  import { refreshAppState } from '../utils/app-state'
  import {
    NOTIFICATION_TYPES,
    NOTIFICATION_MUTATIONS,
    createLargeErrorNotification,
    createSmallSuccessNotification
  } from '../store/modules/Notifications'

  const RECEIVE_STEPS = {
    SELECT_METHOD: 'SELECT_METHOD',
    RECEIVE_COMPLETE: 'RECEIVE_COMPLETE'
  }

  const RECEIVE_METHODS = {
    HTTP: {
      key: 'HTTP',
      grinMethod: 'http',
      title: 'Receive directly from a wallet',
      detail: 'Connect to a recipient directly and receive Grin instantly.'
    },
    FILE: {
      key: 'FILE',
      grinMethod: 'file',
      title: 'Receive a transaction file',
      detail: 'Receive Grin using a transaction file that you already received.'
    }
  }

  export default {
    name: 'receive-page',
    components: {
      FullscreenFileUpload
    },
    mounted () {
      if (this.uploadedTransaction) {
        this.receiveMethod = this.RECEIVE_METHODS.FILE
        this.currentStep = this.RECEIVE_STEPS.SELECT_METHOD
      }
    },
    data () {
      return {
        dropdownIsActive: false,
        RECEIVE_STEPS,
        currentStep: RECEIVE_STEPS.SELECT_METHOD,
        RECEIVE_METHODS,
        receiveMethod: RECEIVE_METHODS.HTTP,
        signedTransactionFile: null
      }
    },
    computed: {
      uploadedTransaction () {
        return this.$store.getters.uploadedTransaction
      },
      ipAddress () {
        return this.$store.getters.ipAddress
      }
    },
    watch: {
      uploadedTransaction (newVal, oldVal) {
        if (newVal) {
          this.receiveMethod = this.RECEIVE_METHODS.FILE
        }
      }
    },
    methods: {
      toggleDropdown () {
        this.dropdownIsActive = !this.dropdownIsActive
      },
      setMethod (method) {
        this.currentStep = this.RECEIVE_STEPS.SELECT_METHOD
        this.receiveMethod = method
      },
      setStep (step) {
        this.currentStep = step
      },
      removeTransaction () {
        this.$store.commit(APP_STATE_MUTATIONS.SET_UPLOADED_TX, null)
      },
      downloadTransaction () {
        // TODO: should we use a dynamic/different name for the file?
        // TODO: check for uploaded tx?
        ipcRenderer.send('DOWNLOAD_FILE', {
          filename: `tx_receive_${this.signedTransactionFile.id}`,
          filedata: JSON.stringify(this.signedTransactionFile)
        })
      },
      receiveTransaction () {
        this.$store.dispatch(GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION, this.uploadedTransaction)
          .then((payload) => {
            // set the signed tx file in memory
            this.signedTransactionFile = payload

            // Notify the user
            const notification = createSmallSuccessNotification({
              title: 'Transaction file received'
            })
            this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)

            // Advance the step
            this.setStep(this.RECEIVE_STEPS.RECEIVE_COMPLETE)

            // Auto-download the signed file
            this.downloadTransaction()

            // Update the app state
            refreshAppState(this.$store)
          })
          .catch((error) => {
            // Notify the user
            const notification = createLargeErrorNotification({
              title: 'Error receiving transaction file',
              type: NOTIFICATION_TYPES.GRIN_API,
              message: `${error.response.data}`
            })
            this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
          })
      }
    }
  }
</script>

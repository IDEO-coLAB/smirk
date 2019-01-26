<template>
  <main>

    <div class="header">
      <span class="header-anchor">
        <router-link to="/dashboard" class="button is-header">
          <span class="icon">
            <i class="fas fa-angle-left"></i>
          </span>
        </router-link>
      </span>

			<div class="header-content">
				Finalize a transaction
			</div>
    </div>

    <!-- Capture the transaction JSON -->
    <div v-if="currentStep===FINALIZE_STEPS.INPUT_DATA">

      <div class="body">
        <p v-if="!uploadedTransaction">Drop a transaction that needs to be finalized into the area below.</p>
        <p v-else>
          <span class="icon has-text-success">
            <i class="fas fa-check-square"></i>
          </span>
          Finalize and broadcast your transaction to the Grin network.
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
        <router-link tag="button" to="/dashboard" class="column button is-footer is-fullwidth">
          Cancel
        </router-link>
        <button
          class="column button is-success is-footer"
          @click="finalizeTransaction">
          Finalize
        </button>
      </div>

    </div>

    <!-- Handle the finalized transaction -->
    <div v-if="currentStep===FINALIZE_STEPS.FINALIZE_COMPLETE">

      <div class="body">
        <p>The finalized transaction was downloaded to your <code>~/Downloads</code> folder; the raw JSON is below.</p>
        <p class="json">{{signedTxJSON}}</p>
        <button
          class="button is-success is-fullwidth"
          @click="downloadTransaction">
          Download Again
        </button>
      </div>

      <div class="footer columns is-gapless is-mobile">
        <router-link tag="button" to="/dashboard" class="column button is-footer is-fullwidth">
          Finish
        </router-link>
      </div>

    </div>

  </main>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import FullscreenFileUpload from '../components/FullscreenFileUpload'
  import {
    NOTIFICATION_TYPES,
    NOTIFICATION_MUTATIONS,
    createLargeErrorNotification,
    createSmallSuccessNotification
  } from '../store/modules/Notifications'
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'
  import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'
  import { refreshAppState } from '../utils/app-state'

  const FINALIZE_STEPS = {
    INPUT_DATA: 'INPUT_DATA',
    FINALIZE_COMPLETE: 'FINALIZE_COMPLETE'
  }

  export default {
    name: 'broadcast-page',
    components: {
      FullscreenFileUpload
    },
    data () {
      return {
        FINALIZE_STEPS,
        currentStep: FINALIZE_STEPS.INPUT_DATA,
        signedTxJSON: null
      }
    },
    computed: {
      uploadedTransaction () {
        return this.$store.getters.uploadedTransaction
      }
    },
    methods: {
      setStep (step) {
        this.currentStep = step
      },
      removeTransaction () {
        this.$store.commit(APP_STATE_MUTATIONS.SET_UPLOADED_TX, null)
      },
      downloadTransaction () {
        // TODO: Ensure an ID
        // TODO: should we use a dynamic/different name for the file?
        // TODO: check for uploaded tx?
        ipcRenderer.send('DOWNLOAD_FILE', {
          filename: `tx_receive_${this.signedTxJSON.id}`,
          filedata: JSON.stringify(this.signedTxJSON)
        })
      },
      finalizeTransaction () {
        this.$store.dispatch(GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION, this.uploadedTransaction)
          .then((payload) => {
            // set the signed tx file in memory
            this.signedTxJSON = payload

            // Notify the user
            const notification = createSmallSuccessNotification({
              title: 'Transaction finalized'
            })
            this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)

            // Update the app state
            refreshAppState(this.$store)

            // Auto-download the finalized transaction
            this.downloadTransaction()

            // Advance the state
            this.setStep(this.FINALIZE_STEPS.FINALIZE_COMPLETE)
          })
          .catch((error) => {
            // Notify the user
            const notification = createLargeErrorNotification({
              title: 'Error finalizing the transaction',
              type: NOTIFICATION_TYPES.GRIN_API,
              message: `${error.response.data}`
            })
            this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)

            // Remove the (now invalid) uploaded tx
            this.removeTransaction()
          })
      }
    }
  }
</script>

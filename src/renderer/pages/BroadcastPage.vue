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
				Finalize and broadcast
			</div>
    </div>

		<div class="body">
      <h3>Finalizing your transaction</h3>
      <p v-if="!uploadedTransaction">Drop a transaction file into the upload area.</p>
      <p v-else>
        <span class="icon has-text-success">
          <i class="fas fa-check-square"></i>
        </span>
        Finalize your transaction to broadcast it to the Grin network.
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

  </main>
</template>

<script>
  import FullscreenFileUpload from '../components/FullscreenFileUpload'
  import {
    NOTIFICATION_MUTATIONS,
    // createSmallSuccessNotification,
    createLargeErrorNotification
  } from '../store/modules/Notifications'
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'
  import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  export default {
    name: 'broadcast-page',
    components: {
      FullscreenFileUpload
    },
    computed: {
      uploadedTransaction () {
        return this.$store.getters.uploadedTransaction
      }
    },
    methods: {
      finalizeTransaction () {
        this.$store.dispatch(GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION, this.uploadedTransaction)
          .then((payload) => {

          })
          .catch((error) => {
            const notification = createLargeErrorNotification({
              title: 'Transaction signing error',
              message: error.response.data
            })
            // Set the notification on the app
            this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, notification)
            // Remove the invalid uploaded tx
            this.$store.commit(APP_STATE_MUTATIONS.SET_UPLOADED_TX, null)
          })
      }
    }
  }
</script>

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
      <p>Click below to finalize your transaction and briadcast it to the Grin network.</p>
      <div class="json">
        {{uploadedTransaction}}
      </div>
		</div>

    <div class="footer columns is-gapless is-mobile">
    	<router-link tag="button" to="/dashboard" class="column button is-footer is-fullwidth">
    		Cancel
    	</router-link>
      <button class="column button is-success is-footer">
        Finalize
      </button>
    </div>

  </main>
</template>

<script>
  export default {
    name: 'broadcast-page',
    components: {},
    computed: {
      uploadedTransaction () {
        return this.$store.getters.uploadedTransaction
      }
    }
  }
</script>

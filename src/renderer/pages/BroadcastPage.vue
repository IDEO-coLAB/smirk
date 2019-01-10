<template>
  <main>

    <div class="smirk-header">
      <span class="smirk-header-anchor">
        <router-link to="/dashboard" class="button is-smirk-header">
          <span class="icon">
            <i class="fas fa-times"></i>
          </span>
        </router-link>
      </span>

			<div class="smirk-header-content">
				Broadcast
			</div>
    </div>

		<div class="smirk-body">
      <h3>Broadcast this transaction</h3>
      <p>You uploaded a transaction that is ready to broadcast to the Grin network. Click below to </p>
      <div class="code-container">
        {{uploadedTransaction}}
      </div>
		</div>

    <div class="smirk-footer columns is-gapless is-mobile">
      <!-- <button
        class="column button is-warning is-smirk-footer is-fullwidth"> -->
    	<router-link tag="button" to="/dashboard" class="column button is-warning is-smirk-footer is-fullwidth">
    		Cancel
    	</router-link>
      <!-- </button> -->
      <button class="column button is-success is-smirk-footer">
        Broadcast
      </button>
    </div>

    <!-- <h2>BROADCAST PAGE</h2> -->
    <router-link to="/dashboard">Dashboard</router-link> |
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

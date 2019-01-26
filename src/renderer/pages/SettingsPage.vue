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
				Settings
			</div>
    </div>

		<div class="body without-footer">
      <section class="section">
        <h4>File downloads</h4>
        <p>All files will be downloaded to:</p>
        <code>{{ config.paths.downloads }}</code>
      </section>

      <section class="section">
        <h4>Grin directory</h4>
        <p>Configuration data is coming from:</p>
        <code>{{ config.node.isFloonet ? config.paths.floonet : config.paths.mainnet }}</code>
      </section>

      <section class="section">
        <h4>Network settings</h4>
        <p>You are currently running on {{ config.node.isFloonet ? 'Floonet' : 'Mainnet' }}</p>
        <button @click="toggleFloonet" class="button is-info">
          {{ config.node.isFloonet ? 'Switch to Mainnet' : 'Switch to Floonet' }}
        </button>
      </section>
		</div>

  </main>
</template>

<script>
  import { APP_STATE_ACTIONS } from '../store/modules/AppState'

  export default {
    name: 'settings-page',
    components: {},
    computed: {
      config () {
        return this.$store.getters.grinConfig
      }
    },
    methods: {
      toggleFloonet () {
        const newVal = !this.config.node.isFloonet

        let newConfig = Object.assign(this.config, {
          node: {
            isFloonet: newVal
          }
        })
        this.$store.dispatch(APP_STATE_ACTIONS.UPDATE_GLOBAL_GRIN_CONFIG, newConfig)
      }
    }
  }
</script>

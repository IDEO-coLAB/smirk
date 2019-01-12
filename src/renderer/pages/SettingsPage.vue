<template>
  <main>

    <div class="header">
      <span class="header-anchor">
        <router-link to="/dashboard" class="button is-header">
          <span class="icon">
            <i class="fas fa-times"></i>
          </span>
        </router-link>
      </span>

			<div class="header-content">
				Smirk Settings
			</div>
    </div>

		<div class="body without-footer">
      <h5>File Download Path</h5>
      <code>{{settings.paths.download}}</code>

      <h5>Grin library Path</h5>
      <code>{{settings.paths.grin}}</code>

		</div>

  </main>
</template>

<script>
  export default {
    name: 'settings-page',
    components: {},
    computed: {
      settings () {
        return this.$store.getters.settings
      }
    }
  }
</script>

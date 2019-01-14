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
				Config
			</div>
    </div>

		<div class="body without-footer">
      <section class="section">
        <h5>File Download Path</h5>
        <code>{{ config.path.download }}</code>
      </section>

      <section class="section">
        <h5>Grin library Path</h5>
        <code>{{ config.path.grin }}</code>
      </section>
		</div>

  </main>
</template>

<script>
  import { remote } from 'electron'
  export default {
    name: 'config-page',
    components: {},
    computed: {
      config () {
        return remote.getGlobal('GRIN_CONFIG')
      }
    }
  }
</script>

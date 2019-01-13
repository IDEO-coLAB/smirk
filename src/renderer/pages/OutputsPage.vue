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
				Outputs
			</div>
    </div>

		<div class="body without-footer">
      <h3>Unspent outputs</h3>
      <p>some text that is helpful</p>
      <OutputTile
        v-for="data, idx in unspent"
        :key="`unspent_${idx}`"
        :output="data[0]"
        :commitment="data[1]"/>

      <hr>
      <h3>Spent outputs</h3>
      <p>some text that is helpful</p>
      <OutputTile
        v-for="data, idx in spent"
        :key="`spent_${idx}`"
        :output="data[0]"
        :commitment="data[1]"/>

      <!-- TODO: dynamic load and fetching -->
      <!-- <button class="button is-fullwidth">
        Load Next 10
      </button> -->
		</div>

  </main>
</template>

<script>
  import OutputTile from '../components/OutputTile'
  import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  export default {
    name: 'outputs-page',
    components: {
      OutputTile
    },
    mounted () {
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_OUTPUTS)
    },
    computed: {
      unspent () {
        return this.$store.getters.outputs.filter((outputData) => {
          const output = outputData[0]
          return output.status === 'Unspent'
        })
      },
      spent () {
        return this.$store.getters.outputs.filter((outputData) => {
          const output = outputData[0]
          return output.status === 'Spent'
        })
      }
    }
  }
</script>

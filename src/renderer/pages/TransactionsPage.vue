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
				Transactions
			</div>
    </div>

		<div class="body without-footer">
      <h4>Grin transaction history</h4>
      <br>
      <!-- TODO: dynamically load more / paginate  -->
      <TransactionTileHistorical
        v-for="tx, idx in transactions"
        :key="idx"
        :transaction="tx" />
		</div>

  </main>
</template>

<script>
  import TransactionTileHistorical from '../components/TransactionTileHistorical'

  export default {
    name: 'transactions-page',
    components: {
      TransactionTileHistorical
    },
    computed: {
      transactions () {
        return this.$store.getters.transactions
      }
    }
  }
</script>

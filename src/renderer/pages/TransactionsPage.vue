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
				Transactions
			</div>
    </div>

		<div class="body without-footer">
      <h3>Your transaction history</h3>

      <!-- TODO: dynamically load more  -->
      <TransactionHistoryTile
        v-for="tx, idx in transactions"
        :key="idx"
        :transaction="tx" />
		</div>

  </main>
</template>

<script>
  import TransactionHistoryTile from '../components/TransactionHistoryTile'

  export default {
    name: 'transactions-page',
    components: {
      TransactionHistoryTile
    },
    computed: {
      transactions () {
        return this.$store.getters.transactions
      }
    }
  }
</script>

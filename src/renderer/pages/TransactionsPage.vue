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
      <h1>list of txs</h1>
      <h1>list of txs</h1>
      <h1>list of txs</h1>
      <h1>list of txs</h1>
      <h1>list of txs</h1>
      <h1>list of txs</h1>
      <h1>list of txs</h1>
      <button class="button is-fullwidth">
        Load Next 10
      </button>
		</div>

  </main>
</template>

<script>
  export default {
    name: 'transactions-page',
    components: {},
    computed: {
    }
  }
</script>

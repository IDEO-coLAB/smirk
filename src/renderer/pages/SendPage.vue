<template>
  <div>
    <router-link :to="{ path: '/transactions' }">
      <button>
        Back to All Transactions
      </button>
    </router-link>
    <hr>
    <h2>Send Page</h2>
  </div>
</template>

<script>
  export default {
    name: 'send-page'
  }
</script>

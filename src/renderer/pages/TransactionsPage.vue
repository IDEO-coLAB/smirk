<template>
  <div class="columns">
    <div class="column">

      <div id="wrapper">
        <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
        <main>
          <div>
            {{ spendable | toPrettyNumber }} Spendable T3 Grin
            <br>
            <button>Receive</button>
          </div>

          <div v-for="tx in transactions">
            <TransactionTile v-bind:transaction="tx" />
            <!-- <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>. -->
          </div>
        </main>
      </div>

    </div>
  </div>
</template>

<script>
  import TransactionTile from '../components/TransactionTile'

  export default {
    name: 'transactions-page',
    components: {
      TransactionTile
    },
    computed: {
      spendable () {
        return this.$store.getters.spendable
      },
      transactions () {
        return this.$store.getters.wallet.transactions
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<template>
  <main>
  <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <div>
      {{ spendable | toPrettyNumber }} Spendable T3 Grin
      <br>
      <button
        @click="openModal(APP_STATE_MODAL_TYPES.RECEIVE)"
        class="button">
          Receive
      </button>

      <router-link :to="{ path: '/send' }">
        <button class="button">
          Send
        </button>
      </router-link>
    </div>

    <div v-for="tx in transactions">
      <TransactionTile v-bind:transaction="tx" />
      <!-- <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>. -->
    </div>
  </main>
</template>

<script>
  import TransactionTile from '../components/TransactionTile'
  import { APP_STATE_MODAL_TYPES, APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'transactions-page',
    components: {
      TransactionTile
    },
    data () {
      return {
        APP_STATE_MODAL_TYPES
      }
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
      openModal (type) {
        this.$store.commit(APP_STATE_MUTATIONS.SET_MODAL, { isActive: true, type })
      }
    }
  }
</script>

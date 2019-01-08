<template>
  <!-- This is the place for styling expansion -->
  <div
    id="app"
    class="content app"
    v-bind:class="{
      'is-expanded' :  appIsExpanded,
      'is-minimized' : !appIsExpanded
    }">
    <router-view></router-view>
  </div>
</template>

<script>
  import { GRIN_WALLET_ACTIONS } from './store/modules/GrinWallet'

  // Prevent global drag/drop events because we only want certain
  // areas of the application to register file upload events
  const preventGlobalDragDropEvents = (event) => event.preventDefault()
  const EVENTS_TO_PREVENT = ['dragover', 'drop']
  EVENTS_TO_PREVENT.forEach(event => window.addEventListener(event, preventGlobalDragDropEvents))

  export default {
    name: 'smirk',
    mounted () {
      this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_SUMMARY)
      // this.$store.dispatch(GRIN_WALLET_ACTIONS.GET_TRANSACTIONS)
    },
    methods: {},
    computed: {
      appIsExpanded () {
        return this.$store.getters.appIsExpanded
      }
    }
  }
</script>

<style lang="sass">
  @import '~@/styles/app.sass'
</style>

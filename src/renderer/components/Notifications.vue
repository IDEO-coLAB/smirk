<template>
  <div v-if="notification" class="notifications">

    <div
      class="header"
      v-bind:class="{
        'has-background-danger': notification.type === NOTIFICATION_TYPES.ERROR,
        'has-background-success': notification.type === NOTIFICATION_TYPES.SUCCESS
      }">
      <span
        class="header-anchor"
        @click="clearNotification">
        <button class="button is-header">
          <span class="icon"><i class="fas fa-times"></i></span>
        </button>
      </span>

      <span class="header-content">
        <span v-if="appIsExpanded">An Error Occurred</span>
        <span v-else>{{notification.title}}</span>
      </span>
    </div>

    <div
      class="body without-footer"
      v-bind:class="{
        'is-paddingless-vertical': !appIsExpanded,
        'has-background-danger': notification.type === NOTIFICATION_TYPES.ERROR,
        'has-background-success': notification.type === NOTIFICATION_TYPES.SUCCESS
      }"
      v-if="notification.isFullscreen">
      <h3 v-if="appIsExpanded" class="is-italic">{{notification.title}}</h3>
      <p class="is-italic">{{notification.message}}</p>
    </div>

  </div>
</template>

<script>
  import { NOTIFICATION_TYPES, APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'notifications',
    // mounted () {
    //   this.$store.commit(APP_STATE_MUTATIONS.SET_APP_NOTIFICATION, {
    //     isFullscreen: true,
    //     type: NOTIFICATION_TYPES.ERROR,
    //     title: 'Some error title',
    //     message: 'And this will be some descriptive text talking a person down from jumping off the ledge.'
    //   })
    // },
    data () {
      return {
        NOTIFICATION_TYPES
      }
    },
    computed: {
      notification () {
        return this.$store.getters.notification
      },
      appIsExpanded () {
        return this.$store.getters.appIsExpanded
      }
    },
    methods: {
      clearNotification () {
        this.$store.commit(APP_STATE_MUTATIONS.SET_APP_NOTIFICATION)
      }
    }
  }
</script>

<template>
  <div v-if="notification" class="notifications">

    <div
      class="header"
      v-bind:class="{
        'has-background-info': notification.style === NOTIFICATION_STYLES.INFO,
        'has-background-danger': notification.style === NOTIFICATION_STYLES.ERROR,
        'has-background-success': notification.style === NOTIFICATION_STYLES.SUCCESS
      }">
      <span
        class="header-anchor"
        @click="clearNotification">
        <button class="button is-header">
          <span class="icon"><i class="fas fa-times"></i></span>
        </button>
      </span>

      <span class="header-content">
        <span class="is-italic">{{notification.title}}</span>
      </span>
    </div>

    <div
      class="body without-footer has-text-white"
      v-bind:class="{
        'is-paddingless-vertical': !appIsExpanded,
        'has-background-info': notification.style === NOTIFICATION_STYLES.INFO,
        'has-background-danger': notification.style === NOTIFICATION_STYLES.ERROR,
        'has-background-success': notification.style === NOTIFICATION_STYLES.SUCCESS
      }"
      v-if="notification.isFullscreen">
      <span v-html="notification.message" class="is-italic"></span>
    </div>

  </div>
</template>

<script>
  import { NOTIFICATION_STYLES, NOTIFICATION_MUTATIONS } from '../store/modules/Notifications'

  export default {
    name: 'notifications',
    data () {
      return {
        NOTIFICATION_STYLES
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
        this.$store.commit(NOTIFICATION_MUTATIONS.SET_NOTIFICATION, null)
      }
    }
  }
</script>

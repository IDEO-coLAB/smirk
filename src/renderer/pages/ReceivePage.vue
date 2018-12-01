<template>
  <div>
    <h1>RECEIVE PAGE</h1>
    <router-link to="/dashboard">Dashboard</router-link>

    <h3>Receive Method</h3>
    <div class="control">
      <label class="radio">
        <input type="radio" value="HTTP" v-model="receiveMethod" :checked="receiveMethod===RECEIVE_METHODS.HTTP" />
        HTTP
      </label>
      <label class="radio">
        <input type="radio" value="FILE" v-model="receiveMethod" :checked="receiveMethod===RECEIVE_METHODS.FILE" />
        FILE
      </label>
      <label class="radio">
        <input type="radio" value="SERVICE" v-model="receiveMethod" :checked="receiveMethod===RECEIVE_METHODS.SERVICE" />
        SERVICE
      </label>
    </div>

    <div v-if="receiveMethod===RECEIVE_METHODS.HTTP">
      <h3>You want to receive by http connection</h3>
    </div>

    <div v-if="receiveMethod===RECEIVE_METHODS.FILE">
      <h3>You want to receive a file</h3>

      <div class="section">
        <FullscreenFileUpload class-styles="upload" />
      </div>

      <div v-if="uploadedTransaction">
        <h5>Looks like you jus uploaded one :)</h5>
        {{uploadedTransaction}}
      </div>
    </div>

    <div v-if="receiveMethod===RECEIVE_METHODS.SERVICE">
      <h3>You want to receive a 3rd-party service</h3>
    </div>

  </div>
</template>

<script>
  import FullscreenFileUpload from '../components/FullscreenFileUpload'

  const RECEIVE_METHODS = {
    HTTP: 'HTTP',
    FILE: 'FILE',
    SERVICE: 'SERVICE'
  }

  export default {
    name: 'receive-page',
    components: {
      FullscreenFileUpload
    },
    mounted () {
      if (this.uploadedTransaction) {
        this.receiveMethod = this.RECEIVE_METHODS.FILE
      }
    },
    data () {
      return {
        RECEIVE_METHODS,
        receiveMethod: RECEIVE_METHODS.FILE
      }
    },
    computed: {
      uploadedTransaction () {
        return this.$store.getters.uploadedTransaction
      }
    },
    methods: {}
  }
</script>

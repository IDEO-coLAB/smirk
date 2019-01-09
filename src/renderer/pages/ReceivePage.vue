<template>
  <div>

    <div class="smirk-header">
      <span class="smirk-header-anchor">
        <router-link to="/dashboard" class="button is-smirk-header">
          <span class="icon">
            <i class="fas fa-times"></i>
          </span>
        </router-link>
      </span>

      <div
        class="dropdown is-smirk-header"
        v-bind:class="{ 'is-active': dropdownIsActive }"
        @click="toggleDropdown">

        <div class="dropdown-trigger">
          <button class="button is-smirk-header">
            <span>{{receiveMethod.title}}</span>
            <span class="icon is-medium">
              <i class="fas fa-md fa-angle-down"></i>
            </span>
          </button>
        </div>

        <div class="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <span
              v-for="(data, key) in RECEIVE_METHODS"
              @click="setReceiveMethod(data)"
              >
              <a class="dropdown-item">
                <h3>{{data.title}}</h3>
                <p>{{data.detail}}</p>
              </a>
              <hr v-if="key !== 'FILE'" class="dropdown-divider">
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentStep===SLATE_RECEIVE_STEPS.CAPTURE_SLATE">
      <div class="smirk-body">
        <h3>Drag and drop a slate file</h3>
        <FullscreenFileUpload class-styles="upload" />
      </div>

      <div class="smirk-footer">
        kdsjfn
      </div>
    </div>

    <div v-if="currentStep===SLATE_RECEIVE_STEPS.SIGN_SLATE">
      <div class="smirk-body">

        <div v-if="uploadedTransaction">
          <h3>You received a slate</h3>
          <p>Click the button below to sign this slate and create a signed response slate to pass back to the sender.</p>
          <div class="code-container">
            {{uploadedTransaction}}
          </div>
        </div>

        <div v-else>

        </div>

      </div>


      <div class="smirk-footer columns is-gapless is-mobile">
        <button
          class="column button is-success is-smirk-footer is-fullwidth"
          @click="signSlate">
          Sign this slate
        </button>
      </div>

    </div>

    <div v-if="currentStep===SLATE_RECEIVE_STEPS.CONFIRMATION">

    </div>

<!--     <div class="smirk-body">
      <h3>Drag and drop a slate</h3>

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
      </div> -->


    </div>

  </div>
</template>

<script>
  import FullscreenFileUpload from '../components/FullscreenFileUpload'

  const SLATE_RECEIVE_STEPS = {
    CAPTURE_SLATE: 'CAPTURE_SLATE',
    SIGN_SLATE: 'SIGN_SLATE',
    CONFIRMATION: 'CONFIRMATION'
  }

  const RECEIVE_METHODS = {
    HTTP: {
      key: 'HTTP',
      grinMethod: 'http',
      title: 'Receive over IP',
      detail: 'some detail text regaring IP addresses is going to go here'
    },
    FILE: {
      key: 'FILE',
      grinMethod: 'file',
      title: 'Receive a slate',
      detail: 'some detail text'
    }
    // Not sure if this is required - maybe people want to manually check
    // SERVICE: {
    //   key: 'SERVICE',
    //   grinMethod: 'file',
    //   title: 'Send with Grinbox',
    //   detail: 'some detail text'
    // }
  }

  export default {
    name: 'receive-page',
    components: {
      FullscreenFileUpload
    },
    mounted () {
      if (this.uploadedTransaction) {
        this.receiveMethod = this.RECEIVE_METHODS.FILE
        this.currentStep = this.SLATE_RECEIVE_STEPS.SIGN_SLATE
      }
    },
    data () {
      return {
        dropdownIsActive: false,

        SLATE_RECEIVE_STEPS: SLATE_RECEIVE_STEPS,
        currentStep: SLATE_RECEIVE_STEPS.CAPTURE_SLATE,
        RECEIVE_METHODS,
        receiveMethod: RECEIVE_METHODS.FILE
      }
    },
    computed: {
      uploadedTransaction () {
        return this.$store.getters.uploadedTransaction
      }
    },
    watch: {
      uploadedTransaction (newVal, oldVal) {
        if (newVal) {
          this.receiveMethod = this.RECEIVE_METHODS.FILE
          this.currentStep = this.SLATE_RECEIVE_STEPS.SIGN_SLATE
        }
      }
    },
    methods: {
      toggleDropdown () {
        this.dropdownIsActive = !this.dropdownIsActive
      },
      setReceiveMethod (method) {
        this.currentStep = SLATE_RECEIVE_STEPS.CAPTURE_SLATE
        this.receiveMethod = method
      },
      signSlate () {

      }
    }
  }
</script>

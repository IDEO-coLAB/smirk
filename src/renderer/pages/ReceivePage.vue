<template>
  <div>

    <!-- Page header -->
    <div class="header">

      <!-- Header anchor nav button -->
      <span class="header-anchor">
        <router-link to="/dashboard" tag="button" class="button is-header">
          <span class="icon"><i class="fas fa-times"></i></span>
        </router-link>
      </span>

      <!-- Header dropdown selector -->
      <div class="header-dropdown">

        <div
          class="dropdown is-header"
          v-bind:class="{ 'is-active': dropdownIsActive }"
          @click="toggleDropdown">

          <!-- Dropdown button (this is the visible text) -->
          <div class="dropdown-trigger is-header">
            <button class="button is-header">
              <span>{{receiveMethod.title}}</span>
              <span class="icon is-medium">
                <i class="fas fa-md fa-angle-down"></i>
              </span>
            </button>
          </div>

          <!-- The dropdown selection menu -->
          <div class="dropdown-menu is-header" role="menu">
            <div class="dropdown-content">
              <span
                v-for="(data, key) in RECEIVE_METHODS"
                @click="setMethod(data)"
                >
                <a
                  class="dropdown-item is-header"
                  v-bind:class="{
                    'is-active' : key === receiveMethod.key
                  }">
                  <h3>{{data.title}}</h3>
                  <p>{{data.detail}}</p>
                </a>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Handle the SELECT_METHOD step -->
    <div v-if="currentStep===RECEIVE_STEPS.SELECT_METHOD">

      <!-- Handle the IP use case -->
      <div v-if="receiveMethod===RECEIVE_METHODS.HTTP">
        <div class="body without-footer">
          <h3>Your IP is <code>127.0.0.1</code></h3>
          <p>To allow a sending party to connect to your wallet, share your IP address with them.</p>
          <p>Need to build this dynamic fetch and whether or not it is public into the Data fetch layer.</p>
        </div>
      </div>

      <!-- Handle FILE use case -->
      <div v-if="receiveMethod===RECEIVE_METHODS.FILE">
        <div class="body" >
          <h3 v-if="!uploadedTransaction">Drop a transaction file</h3>
          <h3 v-else>Transaction file uploaded</h3>

          <FullscreenFileUpload
            class-styles="upload"
            v-if="!uploadedTransaction"/>
          <div v-else class="json">
            {{uploadedTransaction}}
          </div>

          <p v-if="uploadedTransaction">You need to sign this transaction before returning it to the sender.</p>
        </div>

        <div class="footer columns is-gapless is-mobile">
          <button
            class="column button is-footer is-fullwidth"
            v-bind:disabled="!uploadedTransaction"
            @click="removeTransaction">
            Cancel
          </button>
          <button
            class="column button is-success is-footer is-fullwidth"
            v-bind:disabled="!uploadedTransaction"
            @click="signTransaction">
            Sign
          </button>
        </div>
      </div>

    </div>

    <!-- Handle the RECEIVE_COMPLETE step -->
    <div v-if="currentStep===RECEIVE_STEPS.RECEIVE_COMPLETE">
      <div class="body without-footer">
        <h3>Receipt successful</h3>
        <p>Now pass your signed transaction file, or the JSON below, back to the sender.</p>
        <p class="json">{{uploadedTransaction}}</p>
        <button class="button is-success is-fullwidth">Download to File</button>
      </div>
    </div>

  </div>
</template>

<script>
  import FullscreenFileUpload from '../components/FullscreenFileUpload'
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

  const RECEIVE_STEPS = {
    SELECT_METHOD: 'SELECT_METHOD',
    RECEIVE_COMPLETE: 'RECEIVE_COMPLETE'
  }

  const RECEIVE_METHODS = {
    HTTP: {
      key: 'HTTP',
      grinMethod: 'http',
      title: 'Receive directly over IP',
      detail: 'some detail text regaring IP addresses is going to go here'
    },
    FILE: {
      key: 'FILE',
      grinMethod: 'file',
      title: 'Receive a file',
      detail: 'some detail text'
    }
  }

  export default {
    name: 'receive-page',
    components: {
      FullscreenFileUpload
    },
    mounted () {
      if (this.uploadedTransaction) {
        this.receiveMethod = this.RECEIVE_METHODS.FILE
        this.currentStep = this.SLATE_RECEIVE_STEPS.SELECT_METHOD
      }
    },
    data () {
      return {
        dropdownIsActive: false,
        RECEIVE_STEPS,
        currentStep: RECEIVE_STEPS.SELECT_METHOD,
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
        }
      }
    },
    methods: {
      toggleDropdown () {
        this.dropdownIsActive = !this.dropdownIsActive
      },
      setMethod (method) {
        this.currentStep = this.RECEIVE_STEPS.SELECT_METHOD
        this.receiveMethod = method
      },
      setStep (step) {
        this.currentStep = step
      },
      removeTransaction () {
        this.$store.commit(APP_STATE_MUTATIONS.SET_UPLOADED_TX, null)
      },
      signTransaction () {
        this.currentStep = this.RECEIVE_STEPS.RECEIVE_COMPLETE
      }
    }
  }
</script>

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
          <button class="button">
            <span>{{sendMethod.title}}</span>
            <span class="icon is-medium">
              <i class="fas fa-md fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>

        <!-- TODO: Array of Methods -->
        <div class="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <span
              v-for="(data, key) in SEND_METHODS"
              @click="setSendMethod(data)"
              >
              <a class="dropdown-item">
                <h3>{{data.title}}</h3>
                <p>{{data.detail}}</p>
              </a>
              <hr v-if="key !== 'SERVICE'" class="dropdown-divider">
            </span>
          </div>
        </div>
      </div>
    </div>

    <form
      v-show="currentStep===SEND_STEPS.CONSTRUCT"
      v-on:submit.prevent="confirmTransaction">

      <div class="smirk-body">

        <div class="field">
          <div class="control has-icons-left">
            <input
              min="0"
              class="input"
              placeholder="Amount to send"
              v-model="transactionTemplate.amount"
            />
            <span class="icon is-small is-left">
              <i>G</i>
            </span>
          </div>
        </div>

        <div class="field">
          <input
            type="checkbox"
            id="advancedOptions"
            class="is-checkradio has-background-color is-info"
            v-model="showAdvancedOptions"
            :checked="showAdvancedOptions"
          />
          <label for="advancedOptions">Advanced options</label>
        </div>

        <div v-if="showAdvancedOptions">

          <!-- TODO: improve CSS classes here -->
          <div class="field has-addons">
            <div class="control">
              <span class="select">
                <select class="is-minwidth" v-model="transactionTemplate.fluff">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </span>
            </div>
            <div class="control">
              <a class="button is-set-width is-static">
                Use Dandelion
              </a>
            </div>
          </div>

          <div class="field has-addons">
            <div class="control">
              <span class="select">
                <select class="is-minwidth" v-model="transactionTemplate.selection_strategy_is_use_all">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </span>
            </div>
            <div class="control">
              <a class="button is-set-width is-static">
                Combine Outputs
              </a>
            </div>
          </div>

          <div class="field has-addons">
            <div class="control">
              <input
                min="1"
                step="1"
                type="number"
                class="input "
                v-model="transactionTemplate.num_change_outputs"
              />
            </div>
            <div class="control">
              <a class="button is-set-width is-static">
                Change Output{{ transactionTemplate.num_change_outputs > 1 ? 's' : '' }}
              </a>
            </div>
          </div>

          <div class="field has-addons">
            <div class="control">
              <input
                min="1"
                step="1"
                type="number"
                class="input "
                v-model="transactionTemplate.minimum_confirmations"
              />
            </div>
            <div class="control">
              <a class="button is-set-width  is-static">
                Required Confirmation{{ transactionTemplate.minimum_confirmations > 1 ? 's' : '' }}
              </a>
            </div>
          </div>

        </div>
      </div>

      <div class="smirk-footer columns is-gapless is-mobile">
        <button
          type="submit"
          class="column button is-success is-smirk-footer is-fullwidth">
          Confirm
        </button>
      </div>
    </form>

    <div v-show="currentStep===SEND_STEPS.SEND">
<!-- {{transactionTemplate}} -->

      <div class="smirk-body">
        <table class="table is-fullwidth">
          <tbody>
            <tr>
              <td>You're sending</td>
              <td>{{transactionTemplate.amount}} Grin</td>
            </tr>
            <tr>
              <td>Existing outputs will {{transactionTemplate.selection_strategy_is_use_all ? '' : 'not'}} be combined</td>
              <td></td>
            </tr>
            <tr>
              <td>{{transactionTemplate.num_change_outputs}} output will be created</td>
              <td></td>
            </tr>
            <tr>
              <td>Dandelion will {{transactionTemplate.fluff ? '' : 'not' }} be used</td>
              <td></td>
            </tr>
            <tr>
              <td>{{transactionTemplate.minimum_confirmations}} confirmation{{transactionTemplate.minimum_confirmations > 1 ? 's' : '' }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

      </div>

      <div class="smirk-footer columns is-gapless is-mobile">
        <button
          class="column button is-warning is-smirk-footer is-fullwidth">
          Back
        </button>
        <button
          class="column button is-success is-smirk-footer is-fullwidth">
          Send
        </button>
      </div>
    </div>

  </div>
</template>

<script>
  import models from '../models'
  // import { prettyNumToGrinBaseNum } from '../../utils/grin-utils'
  // import { GRIN_WALLET_ACTIONS } from '../store/modules/GrinWallet'

  const SEND_STEPS = {
    CONSTRUCT: 'CONSTRUCT',
    SEND: 'SEND'
  }

  const SEND_METHODS = {
    HTTP: {
      key: 'HTTP',
      title: 'Send using IP Address',
      detail: 'some detail text regaring IP addresses is going to go here'
    },
    FILE: {
      key: 'FILE',
      title: 'Send using a Slate',
      detail: 'some detail text'
    },
    SERVICE: {
      key: 'SERVICE',
      title: 'Send using Grinbox',
      detail: 'some detail text'
    }
  }

  export default {
    name: 'send-page',
    data () {
      return {
        dropdownIsActive: false,

        SEND_STEPS: SEND_STEPS,
        currentStep: SEND_STEPS.SEND,
        SEND_METHODS: SEND_METHODS,
        sendMethod: SEND_METHODS.FILE,
        showAdvancedOptions: false,
        transactionTemplate: new models.TransactionTemplateToOther()
      }
    },
    computed: {},
    methods: {
      toggleDropdown () {
        this.dropdownIsActive = !this.dropdownIsActive
      },
      setSendMethod (method) {
        this.sendMethod = method
      },
      confirmTransaction () {
        // advance the process
        this.currentStep = SEND_STEPS.SEND

        // Use a new object for input formatting
        // let formattedTx = Object.assign({}, this.transactionTemplate)

        // set the tx.method based on the sendMethod // http vs file

        // // Convert tx amount to the Grin base format
        // console.log(prettyNumToGrinBaseNum(this.transactionTemplate.amount))
        // formattedTx.amount = prettyNumToGrinBaseNum(this.transactionTemplate.amount)

        // // the call below are the self send flow
        // this.$store.dispatch(GRIN_WALLET_ACTIONS.ISSUE_SEND_TRANSACTION, formattedTx)
        //   .then((payload) => {
        //     this.$store.dispatch(GRIN_WALLET_ACTIONS.RECEIVE_TRANSACTION, payload)
        //     return payload
        //   })
        //   .then((payload) => {
        //     this.$store.dispatch(GRIN_WALLET_ACTIONS.FINALIZE_TRANSACTION, payload)
        //     return payload
        //   })
        //   // TODO: uniform error handler for the app
        //   .catch((error) => console.warn(error))
      }
    }
  }
</script>

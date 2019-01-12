<template>
  <div class="transaction">
    <!-- TODO: figure out how to show the commitment for these outputs -->
    <div class="transaction-body is-marginless">
      <table class="table is-fullwidth">
        <tbody>
          <tr>
            <td>Associated Tx</td>
            <td>{{ output.tx_log_entry }}</td>
          </tr>
          <tr>
            <td>Value</td>
            <td>G {{ output.value | grinBaseNumToPrettyNum }}</td>
          </tr>
          <tr>
            <td>Confirms</td>
            <td>{{ numConfirms }}</td>
          </tr>
          <tr>
            <td>Lock Height</td>
            <td>{{ output.lock_height }}</td>
          </tr>
          <tr>
            <td>Commitment</td>
            <td>{{ commitmentHex }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

</template>

<script>
  export default {
    name: 'output-tile',
    props: {
      output: {
        type: Object,
        required: true
      },
      commitment: {
        type: Array,
        required: true
      }
    },
    computed: {
      commitmentHex () {
        const commitmentBytes = this.commitment
        return Array.prototype.map.call(commitmentBytes, (byte) => {
          return ('0' + (byte & 0xFF).toString(16)).slice(-2)
        }).join('')
      },
      numConfirms () {
        const curHeight = this.$store.getters.nodeHeight
        return curHeight - this.output.height + 1
      }
    }
  }
</script>

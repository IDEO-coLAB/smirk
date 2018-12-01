<template>
  <div :class="classStyles"
    v-on:click="click"
    v-on:dragenter="dragEnter"
    v-on:dragover="dragOver"
    v-on:dragleave="dragLeave"
    v-on:drop="drop">
  </div>
</template>

<script>
  import { APP_STATE_MUTATIONS } from '../store/modules/AppState'

  export default {
    name: 'fullscreen-file-upload',
    props: {
      classStyles: {
        type: String,
        required: true
      }
    },
    methods: {
      readFile (event) {
        // decode the incoming arrayBuffer from the event
        var decoder = new TextDecoder('utf-8')
        const txString = decoder.decode(event.target.result)
        const tx = JSON.parse(txString)
        console.log('UNPACKED A TX', tx)
        // TODO: Handle invalid file formats, timing, UX, etc

        // Commit the freshly uploaded tx to the store
        this.$store.commit(APP_STATE_MUTATIONS.SET_UPLOADED_TX, tx)

        // To consider a transaction in the finalized state:
        // 1) length of participant_data must be >=2
        const hasTwoParticipants = tx.participant_data.length >= 2

        // 2) partsig of participant_data idx=1 is not null
        let recipientHasSigned = null
        if (hasTwoParticipants) {
          recipientHasSigned = tx.participant_data[1].part_sig !== null
        }

        // If it has two participants and the second participant
        // has signed, then we need to broadcast the transaction
        if (hasTwoParticipants && recipientHasSigned) {
          return this.$router.push({ path: '/broadcast' })
        }
        this.$router.push({ path: '/receive' })
      },
      click (event) {
        event.preventDefault()
        event.stopPropagation()
        // get element at point of click and trigger the click
        let passThroughElement = document.elementsFromPoint(event.clientX, event.clientY)
        // Note: the target is always the first element in the array
        // the array contains all bubbled DOM nodes from the source up
        passThroughElement[1].click()
      },
      dragEnter (event) {
        event.preventDefault()
        event.stopPropagation()
      },
      dragOver (event) {
        event.preventDefault()
        event.stopPropagation()
      },
      dragLeave (event) {
        event.preventDefault()
        event.stopPropagation()
      },
      drop (event) {
        event.preventDefault()
        event.stopPropagation()

        const dataTransfer = event.dataTransfer
        const files = dataTransfer.files

        const reader = new FileReader()
        reader.onload = this.readFile
        reader.readAsArrayBuffer(files[0])
      }
    }
  }
</script>

<style lang="sass">
  @import '~@/styles/app.sass'
</style>

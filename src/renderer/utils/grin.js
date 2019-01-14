// import _ from 'lodash'

// https://github.com/mimblewimble/grin/blob/ecf20602d58c58b74e34f97ed1c88810fea08919/core/src/consensus.rs#L28
export const prettyNumToGrinBaseNum = (value) => {
  // TODO: improve error handling
  return parseFloat(value) * 1e9
}

// This is a filter now
// export const grinBaseNumToPrettyNum = (value) => {
//   // TODO: improve error handling
//   if (_.isNil(value) || !_.isNumber(value)) return null
//   return parseInt(value) / 1e9
// }

// TODO: convert bytes into hex here - remove from OutputTile
// const commitmentBytes = this.commitment
// return Array.prototype.map.call(commitmentBytes, (byte) => {
//   return ('0' + (byte & 0xFF).toString(16)).slice(-2)
// }).join('')

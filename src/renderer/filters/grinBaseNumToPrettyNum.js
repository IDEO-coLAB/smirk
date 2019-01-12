import _ from 'lodash'

// https://github.com/mimblewimble/grin/blob/ecf20602d58c58b74e34f97ed1c88810fea08919/core/src/consensus.rs#L28
export default (value) => {
  // TODO: improve error handling
  if (_.isNil(value) || !_.isNumber(value)) return 'unavailable'
  // if over 10,000,000, remove decimals
  const prettyNum = parseInt(value) / 1e9
  if (prettyNum > 10000000) {
    return Math.trunc(prettyNum).toLocaleString()
  }
  return prettyNum.toLocaleString()
}

import _ from 'lodash'

// https://github.com/mimblewimble/grin/blob/ecf20602d58c58b74e34f97ed1c88810fea08919/core/src/consensus.rs#L28
export const prettyNumToGrinBaseNum = (value) => {
  // TODO: improve error handling
  return parseFloat(value) * 1e9
}

export const grinBaseNumToPrettyNum = (value) => {
  // TODO: improve error handling
  if (_.isNil(value) || !_.isNumber(value)) return ''
  return parseInt(value) / 1e9
}

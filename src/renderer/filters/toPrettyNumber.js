import _ from 'lodash'

// TODO: improve error handling
export default (value) => {
  if (_.isNil(value) || !_.isNumber(value)) return ''
  return parseFloat(value) * 10e-10
}

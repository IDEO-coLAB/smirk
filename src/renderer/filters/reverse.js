// Currently only supports arrays
import _ from 'lodash'

export default (value) => {
  if (_.isArray(value)) {
    return _.reverse(value)
  } else {
    throw new Error(
      `The 'reverse' filter currently only handles Arrays. \
      Please add another handler for type ${typeof value}: ${value}`
    )
  }
}

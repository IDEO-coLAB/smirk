import _ from 'lodash'
import moment from 'moment'

export default (value) => {
  if (_.isNil(value)) return ''
  const dateFmt = 'M/d/YY h:m a'
  return moment(value).format(dateFmt)
}

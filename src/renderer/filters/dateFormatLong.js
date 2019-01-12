import _ from 'lodash'
import format from 'date-fns/format'

export default (value) => {
  if (_.isNil(value)) return ''
  const dateFmt = 'M/d/YY h:m a'
  return format(value, dateFmt)
}

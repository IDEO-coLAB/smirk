import Vue from 'vue'

import grinBaseNumToPrettyNum from './grinBaseNumToPrettyNum'
import reverse from './reverse'
import dateFormatLong from './dateFormatLong'

const filters = {
  grinBaseNumToPrettyNum,
  reverse,
  dateFormatLong
}

export default () => {
  for (let filter in filters) {
    Vue.filter(filter, filters[filter])
  }
}

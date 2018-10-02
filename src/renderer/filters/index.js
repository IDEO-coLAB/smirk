import Vue from 'vue'

import grinBaseNumToPrettyNum from './grinBaseNumToPrettyNum'
import reverse from './reverse'

const filters = {
  grinBaseNumToPrettyNum,
  reverse
}

export default () => {
  for (let filter in filters) {
    Vue.filter(filter, filters[filter])
  }
}

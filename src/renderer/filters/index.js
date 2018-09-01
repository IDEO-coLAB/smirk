import Vue from 'vue'

import toPrettyNumber from './toPrettyNumber'

const filters = {
  toPrettyNumber
}

export default () => {
  for (let filter in filters) {
    Vue.filter(filter, filters[filter])
  }
}

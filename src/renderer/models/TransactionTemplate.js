export default class TransactionTemplateToOther {
  constructor () {
    this.amount = 1
    this.minimum_confirmations = 10
    this.method = 'http'
    this.dest = 'http://<IP_ADDR>:<PORT>'
    this.max_outputs = 500
    this.num_change_outputs = 1
    this.selection_strategy_is_use_all = true
    this.fluff = true
  }
}

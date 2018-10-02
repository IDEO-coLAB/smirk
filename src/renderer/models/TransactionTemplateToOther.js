export default class TransactionTemplateToOther {
  constructor () {
    this.amount = 0
    this.minimum_confirmations = 1
    this.dest = 'http://<IP>:<PORT>'
    this.max_outputs = 500
    this.num_change_outputs = 1
    this.selection_strategy_is_use_all = true
    this.fluff = true
    this.method = 'http'
  }
}

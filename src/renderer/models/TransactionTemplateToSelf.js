export default class TransactionTemplateToSelf {
  constructor () {
    this.amount = 1
    this.minimum_confirmations = 0
    this.method = 'file' //
    this.dest = '' // over the network is: http://127.0.0.1:13415
    this.max_outputs = 500
    this.num_change_outputs = 1
    this.selection_strategy_is_use_all = true
    this.fluff = true
  }
}

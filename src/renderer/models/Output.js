export default class Output {
  constructor (opts) {
    this.root_key_id = opts.root_key_id
    this.key_id = opts.key_id
    this.n_child = opts.n_child
    this.value = opts.value
    this.status = opts.status
    this.height = opts.height
    this.lock_height = opts.lock_height
    this.is_coinbase = opts.is_coinbase
    this.block = opts.block
    this.tx_log_entry = opts.tx_log_entry
  }
}

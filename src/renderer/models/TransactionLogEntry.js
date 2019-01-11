export default class TxLogEntry {
  constructor (opts) {
    this.amount_credited = opts.amount_credited
    this.amount_debited = opts.amount_debited
    this.confirmation_ts = opts.confirmation_ts
    this.confirmed = opts.confirmed
    this.creation_ts = opts.creation_ts
    this.fee = opts.fee
    this.id = opts.id
    this.num_inputs = opts.num_inputs
    this.num_outputs = opts.num_outputs
    this.parent_key_id = opts.parent_key_id
    this.stored_tx = opts.stored_tx
    this.tx_slate_id = opts.tx_slate_id
    this.tx_type = opts.tx_type
  }
}

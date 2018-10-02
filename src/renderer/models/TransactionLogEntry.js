export default class TxLogEntry {
  constructor (opts) {
    this.id = opts.id
    this.tx_slate_id = opts.tx_slate_id
    this.tx_type = opts.tx_type
    this.creation_ts = opts.creation_ts
    this.confirmation_ts = opts.confirmation_ts
    this.confirmed = opts.confirmed
    this.num_inputs = opts.num_inputs
    this.num_outputs = opts.num_outputs
    this.amount_credited = opts.amount_credited
    this.amount_debited = opts.amount_debited
    this.fee = opts.fee
  }
}

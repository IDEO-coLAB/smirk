export default class WalletSummary {
  constructor (opts) {
    this.last_confirmed_height = opts.last_confirmed_height
    this.total = opts.total
    this.amount_awaiting_confirmation = opts.amount_awaiting_confirmation
    this.amount_currently_spendable = opts.amount_currently_spendable
    this.amount_immature = opts.amount_immature
    this.amount_locked = opts.amount_locked
  }
}

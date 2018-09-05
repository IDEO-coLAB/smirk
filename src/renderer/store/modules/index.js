/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

import { WalletDaemonService } from './WalletDaemonService'
import { AppState } from './AppState'

export default { WalletDaemonService, AppState }

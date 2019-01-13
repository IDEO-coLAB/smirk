/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

import { GrinWallet } from './GrinWallet'
import { AppState } from './AppState'
import { Notifications } from './Notifications'

export default { GrinWallet, AppState, Notifications }

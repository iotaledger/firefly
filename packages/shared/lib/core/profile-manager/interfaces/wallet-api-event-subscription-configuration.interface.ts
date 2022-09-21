import { WalletApiEventMap } from '../types'

import { IProfileManager } from './profile-manager.interface'

export interface IWalletApiEventSubscriptionConfiguration {
    eventMap: WalletApiEventMap
    profileManager?: IProfileManager
}

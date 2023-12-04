import { IWallet } from '@core/profile'
import { WalletApiEventMap } from '../types'

export interface IWalletApiEventSubscriptionConfiguration {
    eventMap: WalletApiEventMap
    wallet: IWallet
}

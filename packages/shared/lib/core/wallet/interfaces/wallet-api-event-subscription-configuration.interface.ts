import { WalletApiEventMap } from '../types'
import { IAccount } from '@core/account/interfaces'

export interface IWalletApiEventSubscriptionConfiguration {
    eventMap: WalletApiEventMap
    wallet: IAccount
}

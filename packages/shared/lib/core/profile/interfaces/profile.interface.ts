import { Readable, Writable } from 'svelte/store'
import { WalletAccount } from '@lib/typings/walletAccount'
import { IBalanceOverview } from './balance-overview.interface'
import { IPersistedProfile } from './persisted-profile.interface'

export interface IProfile extends IPersistedProfile {
    balanceOverview: Writable<IBalanceOverview>
    accounts: Writable<WalletAccount[]>
    hasLoadedAccounts: Writable<boolean>
    isStrongholdLocked: Writable<boolean>
    shouldOpenProfileModal: Writable<boolean>
    internalTransfersInProgress: Writable<{
        [key: string]: {
            from: string
            to: string
        }
    }>
}

import { IAccountState } from '@core/account'
import { Writable } from 'svelte/store'
import { IBalanceOverview } from './balance-overview.interface'
import { IPersistedProfile } from './persisted-profile.interface'

export interface IProfile extends IPersistedProfile {
    balanceOverview: Writable<IBalanceOverview>
    accounts: Writable<IAccountState[]>
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

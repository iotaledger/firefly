import { Writable } from 'svelte/store'
import { IBalanceOverview } from './balance-overview.interface'
import { IPersistedProfile } from './persisted-profile.interface'

export interface IProfile extends IPersistedProfile {
    balanceOverview: Writable<IBalanceOverview>
    hasLoadedAccounts: Writable<boolean>
    isStrongholdLocked: Writable<boolean>
    shouldOpenProfileModal: Writable<boolean>
    internalTransfersInProgress: Writable<{
        [key: string]: {
            from: string
            to: string
        }
    }>
    loggedIn: Writable<boolean>
    lastActiveAt: Writable<Date>
    showHiddenAccounts: boolean
}

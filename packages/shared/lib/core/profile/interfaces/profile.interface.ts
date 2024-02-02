import { Writable } from 'svelte/store'
import { IPersistedProfile } from './persisted-profile.interface'

export interface IProfile extends IPersistedProfile {
    hasLoadedWallets: Writable<boolean>
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
    showHiddenWallets: boolean
}

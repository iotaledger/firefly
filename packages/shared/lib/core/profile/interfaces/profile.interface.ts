import { Writable } from 'svelte/store'
import { IPersistedProfile } from './persisted-profile.interface'

export interface IProfile extends IPersistedProfile {
    hasLoadedAccounts: Writable<boolean> // TODO(2.0) Shouldn't we rename this field?
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

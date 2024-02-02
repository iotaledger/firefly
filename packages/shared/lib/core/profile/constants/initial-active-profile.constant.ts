import { writable } from 'svelte/store'
import { IProfile } from '../interfaces'

export const INITIAL_ACTIVE_PROFILE: Partial<IProfile> = {
    hasLoadedWallets: writable<boolean>(false),
    isStrongholdLocked: writable<boolean>(true),
    shouldOpenProfileModal: writable<boolean>(false),
    loggedIn: writable<boolean>(false),
    lastActiveAt: writable<Date>(new Date()),
    internalTransfersInProgress: writable<{
        [key: string]: {
            from: string
            to: string
        }
    }>({}),
    showHiddenWallets: false,
}

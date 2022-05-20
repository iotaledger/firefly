import { writable } from 'svelte/store'
import { IBalanceOverview, IProfile } from '../interfaces'

export const INITIAL_ACTIVE_PROFILE: Partial<IProfile> = {
    balanceOverview: writable<IBalanceOverview>({
        incoming: '0 Mi',
        incomingRaw: 0,
        outgoing: '0 Mi',
        outgoingRaw: 0,
        balance: '0 Mi',
        balanceRaw: 0,
        balanceFiat: '$ 0.00',
    }),
    hasLoadedAccounts: writable<boolean>(false),
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
    showHiddenAccounts: false,
}

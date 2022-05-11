import { WalletAccount } from '@lib/typings/walletAccount'
import { get, writable } from 'svelte/store'
import { IBalanceOverview, IProfile } from '../interfaces'
import { persistedProfile } from './persisted-profile.store'

export const activeProfile = writable<IProfile>({
    balanceOverview: writable<IBalanceOverview>({
        incoming: '0 Mi',
        incomingRaw: 0,
        outgoing: '0 Mi',
        outgoingRaw: 0,
        balance: '0 Mi',
        balanceRaw: 0,
        balanceFiat: '$ 0.00',
    }),
    accounts: writable<WalletAccount[]>([]),
    hasLoadedAccounts: writable<boolean>(false),
    isStrongholdLocked: writable<boolean>(true),
    shouldOpenProfileModal: writable<boolean>(false),
    internalTransfersInProgress: writable<{
        [key: string]: {
            from: string
            to: string
        }
    }>({}),
    ...get(persistedProfile),
})

export function loadPersistedProfileIntoActiveProfile(): void {
    return activeProfile.update((state) => ({ ...state, ...get(persistedProfile) }))
}

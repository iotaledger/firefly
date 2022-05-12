import { WalletAccount } from '@lib/typings/walletAccount'
import { get, writable } from 'svelte/store'
import { IBalanceOverview, IProfile, IProfileSettings } from '../interfaces'
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

export function updateActiveProfile(payload: Partial<IProfile>): void {
    activeProfile.update((state) => ({ ...state, ...payload }))
}

export function updateActiveProfileSettings(payload: Partial<IProfileSettings>): void {
    activeProfile.update((state) => ({
        ...state,
        settings: { ...state?.settings, ...payload },
    }))
}

export function loadPersistedProfileIntoActiveProfile(): void {
    activeProfile.update((state) => ({ ...state, ...get(persistedProfile) }))
}

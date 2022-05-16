import { IAccountMetadata, IAccountState } from '@core/account'
import { get, writable } from 'svelte/store'
import { IBalanceOverview, IPersistedProfile, IProfile, IProfileSettings } from '../interfaces'

const INITIAL_ACTIVE_PROFILE: Partial<IProfile> = {
    balanceOverview: writable<IBalanceOverview>({
        incoming: '0 Mi',
        incomingRaw: 0,
        outgoing: '0 Mi',
        outgoingRaw: 0,
        balance: '0 Mi',
        balanceRaw: 0,
        balanceFiat: '$ 0.00',
    }),
    accounts: writable<IAccountState[]>([]),
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
}

export const activeProfile = writable<IProfile>(<IProfile>INITIAL_ACTIVE_PROFILE)

export function updateActiveProfile(payload: Partial<IProfile>): void {
    activeProfile?.update((state) => ({ ...state, ...payload }))
}

export function updateActiveProfileSettings(payload: Partial<IProfileSettings>): void {
    activeProfile?.update((state) => ({
        ...state,
        settings: { ...state?.settings, ...payload },
    }))
}

export function setActiveProfile(persistedProfile: IPersistedProfile): void {
    activeProfile?.set(<IProfile>{ ...INITIAL_ACTIVE_PROFILE, ...persistedProfile })
}

export function resetActiveProfile(): void {
    activeProfile.set(null)
}

export function addAccountToActiveProfile(account: IAccountState): void {
    const { accounts } = get(activeProfile)
    accounts?.update((state) => [...state, account])
}

export function addAccountMetadataToActiveProfile(metadata: IAccountMetadata): void {
    activeProfile?.update((state) => ({
        ...state,
        accountMetadatas: [...state?.accountMetadatas, metadata],
    }))
}

export function getAccountMetadatById(id: string): IAccountMetadata {
    const { accountMetadatas } = get(activeProfile)
    return accountMetadatas.find((metadata) => metadata.id === id)
}

export function updateAccountMetadataOnActiveProfile(metadata: IAccountMetadata): void {
    activeProfile?.update((state) => ({
        ...state,
        accountMetadatas: state?.accountMetadatas.map((existingValue) =>
            existingValue.id === metadata.id ? metadata : existingValue
        ),
    }))
}

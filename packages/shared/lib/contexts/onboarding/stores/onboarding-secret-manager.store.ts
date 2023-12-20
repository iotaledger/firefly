import { onboardingProfile } from '@contexts/onboarding/stores'
import { api } from '@core/api'
import { SecretManager, SecretManagerType } from '@iota/sdk'
import { USE_LEDGER_SIMULATOR } from 'shared/lib/core/ledger'
import { getStorageDirectoryOfProfile, ProfileType } from 'shared/lib/core/profile'
import { get, writable, Writable } from 'svelte/store'

export const onboardingProfileSecretManager: Writable<SecretManager | null> = writable(null)

export async function buildOnboardingSecretManager(): Promise<void> {
    const profile = get(onboardingProfile)
    if (profile) {
        const { id, type, strongholdPassword } = profile

        const storagePath = await getStorageDirectoryOfProfile(id)
        const secretManagerOptions = getSecretManagerFromProfileType(type, {
            storagePath,
            strongholdPassword,
        })

        const secretManager = await api.createSecretManager(secretManagerOptions)

        onboardingProfileSecretManager.set(secretManager)
    } else {
        onboardingProfileSecretManager.set(null)
    }
}

export function isOnboardingSecretManagerInitialized(): boolean {
    return !!get(onboardingProfileSecretManager)
}

export function getSecretManagerFromProfileType(
    type?: ProfileType,
    {
        storagePath,
        strongholdPassword,
    }: {
        storagePath?: string
        strongholdPassword?: string
    } = {}
): SecretManagerType {
    const strongholdSecretManager = {
        stronghold: { snapshotPath: `${storagePath}/wallet.stronghold`, password: strongholdPassword },
    }
    const ledgerSecretManager = {
        ledgerNano: USE_LEDGER_SIMULATOR,
    }

    switch (type) {
        case ProfileType.Ledger:
            return ledgerSecretManager
        case ProfileType.Software:
        default:
            return strongholdSecretManager
    }
}

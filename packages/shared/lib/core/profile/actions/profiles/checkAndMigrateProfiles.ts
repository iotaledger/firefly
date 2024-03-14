import { IPersistedAccountData } from '@core/account/interfaces'
import {
    COIN_TYPE,
    DEFAULT_CHAIN_CONFIGURATIONS,
    DEFAULT_MAX_PARALLEL_API_REQUESTS,
    DEFAULT_NETWORK_METADATA,
    getDefaultPersistedNetwork,
    IIscpChainMetadata,
    NetworkId,
} from '@core/network'
import { INode, IPersistedNetwork } from '@core/network/interfaces'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES } from '@core/nfts'
import { ProfileType } from '@core/profile/enums'
import { StrongholdVersion } from '@core/stronghold/enums'
import { get } from 'svelte/store'
import {
    DEFAULT_PERSISTED_PROFILE_OBJECT,
    DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
    PROFILE_VERSION,
} from '../../constants'
import { IPersistedProfile } from '../../interfaces'
import { currentProfileVersion, profiles, saveProfile } from '../../stores'
import { checkAndMigrateChrysalisProfiles } from './'

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Firefly version.
 */

export function checkAndMigrateProfiles(): void {
    const shouldMigratePersistedProfiles = (get(currentProfileVersion) ?? 3) < PROFILE_VERSION

    if (shouldMigratePersistedProfiles) {
        if (checkAndMigrateChrysalisProfiles()) {
            // If there was a migration, we need to update the currentProfileVersion
            // to the latest compatible with the chrysalis migration, which is 13
            currentProfileVersion.set(13)
        }
        migrateEachVersion()
    }
}

function migrateEachVersion(): void {
    let migrationVersion = get(currentProfileVersion)
    for (migrationVersion; migrationVersion < PROFILE_VERSION; migrationVersion++) {
        migratePersistedProfile(migrationVersion)
        currentProfileVersion.set(migrationVersion + 1)
    }
}

function migratePersistedProfile(migrationVersion: number): void {
    const _profiles = get(profiles)
    for (const profile of _profiles) {
        persistedProfileMigrationsMap?.[migrationVersion]?.(profile)
    }
}

const persistedProfileMigrationsMap: Record<number, (existingProfile: unknown) => void> = {
    /**
     * NOTE: 0-2 are missing here because we wrote this functionality,
     * when the profile version was already 3.
     */
    3: persistedProfileMigrationToV4,
    4: persistedProfileMigrationToV5,
    5: persistedProfileMigrationToV6,
    6: persistedProfileMigrationToV7,
    7: persistedProfileMigrationToV8,
    8: persistedProfileMigrationToV9,
    9: persistedProfileMigrationToV10,
    10: persistedProfileMigrationToV11,
    11: persistedProfileMigrationToV12,
    12: persistedProfileMigrationToV13,
    13: persistedProfileMigrationToV14,
    14: persistedProfileMigrationToV15,
    15: persistedProfileMigrationToV16,
    16: persistedProfileMigrationToV17,
    17: persistedProfileMigrationToV18,
}

function persistedProfileMigrationToV4(existingProfile: unknown): void {
    const newProfile = {}

    const keysToKeep = [
        'id',
        'name',
        'type',
        'networkProtocol',
        'networkType',
        'lastStrongholdBackupTime',
        'settings',
        'accountMetadata',
        'isDeveloperProfile',
        'hasVisitedDashboard',
        'lastUsedAccountIndex',
        'clientOptions',
    ]

    keysToKeep.forEach((key) => {
        const existingValue = existingProfile?.[key]
        newProfile[key] = existingValue
    })

    saveProfile(newProfile as IPersistedProfile)
}

function persistedProfileMigrationToV5(existingProfile: unknown): void {
    interface IOldPersistedProfile {
        settings: {
            currency: unknown
        }
    }

    const oldProfile = existingProfile as IOldPersistedProfile
    delete oldProfile?.settings?.currency

    const newProfile = oldProfile as unknown as IPersistedProfile
    newProfile.settings.marketCurrency = DEFAULT_PERSISTED_PROFILE_OBJECT.settings?.marketCurrency

    saveProfile(newProfile)
}

function persistedProfileMigrationToV6(existingProfile: IPersistedProfile): void {
    existingProfile.forceAssetRefresh = true
    saveProfile(existingProfile)
}

function persistedProfileMigrationToV7(existingProfile: unknown): void {
    const newProfile = {}

    const keysToKeep = [
        'id',
        'name',
        'type',
        'networkProtocol',
        'networkType',
        'lastStrongholdBackupTime',
        'settings',
        'accountMetadata',
        'isDeveloperProfile',
        'hasVisitedDashboard',
        'lastUsedAccountIndex',
        'clientOptions',
        'forceAssetRefresh',
    ]

    keysToKeep.forEach((key) => {
        const existingValue = existingProfile?.[key]
        newProfile[key] = existingValue
    })

    saveProfile(newProfile as IPersistedProfile)
}

function persistedProfileMigrationToV8(existingProfile: IPersistedProfile): void {
    existingProfile.settings = { ...existingProfile.settings, maxMediaSizeInMegaBytes: 50 }

    saveProfile(existingProfile)
}

function persistedProfileMigrationToV9(existingProfile: IPersistedProfile): void {
    function migrateNode(node: INode): INode {
        if (node) {
            return {
                url: node.url as string,
                auth: {
                    jwt: node.auth?.jwt,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    basicAuthNamePwd: [node.auth?.username, node.auth?.password],
                },
            }
        } else {
            return undefined
        }
    }

    existingProfile.clientOptions.nodes = existingProfile?.clientOptions?.nodes?.map(migrateNode)
    existingProfile.clientOptions.primaryNode = migrateNode(existingProfile?.clientOptions?.primaryNode)

    saveProfile(existingProfile)
}

function persistedProfileMigrationToV10(existingProfile: IPersistedProfile): void {
    existingProfile.settings = {
        ...existingProfile.settings,
        strongholdPasswordTimeoutInMinutes: DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
        maxMediaSizeInMegaBytes: DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
    }

    saveProfile(existingProfile)
}

function getNetworkIdFromOldNetworkType(networkType: 'mainnet' | 'devnet' | 'private-net'): NetworkId {
    // At this point you have not been able to create IOTA profiles so we can assume that the network protocol was Shimmer
    switch (networkType) {
        case 'mainnet':
            return NetworkId.Shimmer
        case 'devnet':
            return NetworkId.Testnet
        case 'private-net':
            return NetworkId.Custom
        default:
            return
    }
}

function persistedProfileMigrationToV11(
    existingProfile: IPersistedProfile & { networkType: 'mainnet' | 'devnet' | 'private-net' }
): void {
    if (!existingProfile?.network) {
        let network: IPersistedNetwork
        const networkId = getNetworkIdFromOldNetworkType(existingProfile?.networkType)
        if (networkId === NetworkId.Shimmer || networkId === NetworkId.Testnet) {
            network = getDefaultPersistedNetwork(networkId)
        } else {
            network.id = NetworkId.Custom
        }
        network.coinType = COIN_TYPE[NetworkId.Shimmer]
        existingProfile.network = structuredClone(network)
    }

    existingProfile.settings = {
        ...existingProfile.settings,
        maxMediaDownloadTimeInSeconds: DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
    }

    existingProfile.forceAssetRefresh = true

    const newProfile = {}
    const keysToKeep = [
        'id',
        'name',
        'type',
        'lastStrongholdBackupTime',
        'settings',
        'accountMetadata',
        'isDeveloperProfile',
        'hasVisitedDashboard',
        'lastUsedAccountIndex',
        'clientOptions',
        'forceAssetRefresh',
        'strongholdVersion',
        'network',
    ]
    keysToKeep.forEach((key) => {
        const existingValue = existingProfile?.[key]
        newProfile[key] = existingValue
    })

    saveProfile(newProfile as IPersistedProfile)
}

function persistedProfileMigrationToV12(existingProfile: IPersistedProfile): void {
    existingProfile.strongholdVersion = StrongholdVersion.V2
    saveProfile(existingProfile)
}

function persistedProfileMigrationToV13(
    existingProfile: IPersistedProfile & { accountMetadata: (IPersistedAccountData & { index: number })[] }
): void {
    const newProfile = {}
    const keysToKeep = [
        'id',
        'name',
        'type',
        'lastStrongholdBackupTime',
        'settings',
        'accountPersistedData',
        'isDeveloperProfile',
        'hasVisitedDashboard',
        'lastUsedAccountIndex',
        'clientOptions',
        'forceAssetRefresh',
        'strongholdVersion',
        'network',
    ]
    const accountPersistedData = {}
    existingProfile.accountMetadata?.forEach((metadata) => {
        const { index, ...rest } = metadata
        accountPersistedData[index] = { ...rest }
    })
    existingProfile.accountPersistedData = accountPersistedData
    keysToKeep.forEach((key) => {
        const existingValue = existingProfile?.[key]
        newProfile[key] = existingValue
    })

    if (existingProfile.network) {
        interface IOldPersistedNetwork {
            chainConfigurations: unknown
        }

        const oldNetwork = existingProfile.network as unknown as IOldPersistedNetwork
        delete oldNetwork.chainConfigurations

        const newNetwork = oldNetwork as unknown as IPersistedNetwork
        const maybeDefaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[existingProfile.network.id]

        const defaultChainConfig: IIscpChainMetadata[] = maybeDefaultChainConfig ? [maybeDefaultChainConfig] : []

        newNetwork.chains = defaultChainConfig
        existingProfile.network = newNetwork
    }

    saveProfile(newProfile as IPersistedProfile)
}

function persistedProfileMigrationToV14(existingProfile: IPersistedProfile): void {
    const isLedgerProfile = existingProfile?.type === ProfileType.Ledger
    if (isLedgerProfile) {
        delete existingProfile.strongholdVersion
        saveProfile(existingProfile)
    }
}

function persistedProfileMigrationToV15(existingProfile: IPersistedProfile): void {
    if (existingProfile.clientOptions && !existingProfile.clientOptions.maxParallelApiRequests) {
        existingProfile.clientOptions.maxParallelApiRequests = DEFAULT_MAX_PARALLEL_API_REQUESTS
        saveProfile(existingProfile)
    }
}

function persistedProfileMigrationToV16(existingProfile: IPersistedProfile): void {
    const defaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[existingProfile.network.id]
    const newChains: IIscpChainMetadata[] = defaultChainConfig ? [defaultChainConfig] : []
    existingProfile.network.chains = newChains
    saveProfile(existingProfile)
}

function persistedProfileMigrationToV17(existingProfile: IPersistedProfile): void {
    const defaultChainConfig = DEFAULT_CHAIN_CONFIGURATIONS[existingProfile.network.id]
    const newChains: IIscpChainMetadata[] = defaultChainConfig ? [defaultChainConfig] : []
    existingProfile.network.chains = newChains
    saveProfile(existingProfile)
}

function persistedProfileMigrationToV18(existingProfile: IPersistedProfile): void {
    if (existingProfile.network) {
        interface IOldPersistedNetwork {
            protocol: unknown
            baseToken: unknown
        }

        const oldNetwork = existingProfile.network as unknown as IOldPersistedNetwork
        delete oldNetwork.protocol
        delete oldNetwork.baseToken

        const newNetwork = oldNetwork as unknown as IPersistedNetwork
        const defaultBech32Hrp = DEFAULT_NETWORK_METADATA[existingProfile.network.id]?.bech32Hrp || ''
        newNetwork.bech32Hrp = defaultBech32Hrp

        existingProfile.network = newNetwork
        saveProfile(existingProfile)
    }
}

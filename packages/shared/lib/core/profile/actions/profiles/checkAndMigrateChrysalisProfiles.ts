import { IPersistedAccountData } from '@core/account/interfaces'
import { MarketCurrency } from '@core/market'
import { NetworkId, getDefaultClientOptions, getDefaultPersistedNetwork } from '@core/network'
import { INode } from '@core/network/interfaces'
import { ChrysalisNetworkId } from '@core/profile/enums'
import { get } from 'svelte/store'
import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '../../constants'
import { IChrysalisNode, IChrysalisPersistedProfile, IPersistedProfile } from '../../interfaces'
import { profiles, saveProfile } from '../../stores'

// Migrate chrysalis profile until profile version 13
// Returns true if there was a migration
export function checkAndMigrateChrysalisProfiles(): boolean {
    let migrated = false
    const _profiles = get(profiles)
    for (const profile of _profiles) {
        if (isChrysalisProfile(profile)) {
            const chrysalisProfile = profile as IChrysalisPersistedProfile

            const migratedProfile: IPersistedProfile = {
                id: chrysalisProfile.id ?? DEFAULT_PERSISTED_PROFILE_OBJECT.id,
                name: chrysalisProfile.name ?? DEFAULT_PERSISTED_PROFILE_OBJECT.name,
                type: chrysalisProfile.type ?? DEFAULT_PERSISTED_PROFILE_OBJECT.type,
                network: DEFAULT_PERSISTED_PROFILE_OBJECT.network,
                lastStrongholdBackupTime:
                    chrysalisProfile.lastStrongholdBackupTime ??
                    DEFAULT_PERSISTED_PROFILE_OBJECT.lastStrongholdBackupTime,
                settings: DEFAULT_PERSISTED_PROFILE_OBJECT.settings,
                accountPersistedData: DEFAULT_PERSISTED_PROFILE_OBJECT.accountPersistedData,
                isDeveloperProfile:
                    chrysalisProfile.isDeveloperProfile ?? DEFAULT_PERSISTED_PROFILE_OBJECT.isDeveloperProfile,
                hasVisitedDashboard: chrysalisProfile.hasVisitedDashboard ?? undefined,
                lastUsedAccountIndex: Number(chrysalisProfile.lastUsedAccountId) ?? undefined,
                clientOptions: DEFAULT_PERSISTED_PROFILE_OBJECT.clientOptions, // migration needed
                forceAssetRefresh: DEFAULT_PERSISTED_PROFILE_OBJECT.forceAssetRefresh,
                strongholdVersion:
                    chrysalisProfile.strongholdVersion ?? DEFAULT_PERSISTED_PROFILE_OBJECT.strongholdVersion,
            }

            // accountPersistedData
            if (chrysalisProfile.accounts) {
                const accountPersistedData: {
                    [accountId: string]: IPersistedAccountData
                } = {}
                chrysalisProfile.accounts.forEach((account, index) => {
                    accountPersistedData[index] = {
                        name: `Wallet ${index + 1}`,
                        color: account.color,
                        hidden: chrysalisProfile.hiddenAccounts?.includes(account.id) ?? false,
                        shouldRevote: false,
                    }
                })
                migratedProfile.accountPersistedData = accountPersistedData
            }

            // settings
            if (chrysalisProfile.settings) {
                const chrysalisProfileMarketCurrency = chrysalisProfile.settings?.currency?.toLocaleLowerCase() ?? ''
                if (chrysalisProfileMarketCurrency) {
                    const migratedProfileMarketCurrency: MarketCurrency =
                        Object.values(MarketCurrency).find((currency) => currency === chrysalisProfileMarketCurrency) ??
                        migratedProfile.settings.marketCurrency
                    migratedProfile.settings.marketCurrency = migratedProfileMarketCurrency
                }
                if (chrysalisProfile.settings.lockScreenTimeout) {
                    migratedProfile.settings.lockScreenTimeoutInMinutes = chrysalisProfile.settings.lockScreenTimeout
                }
                if (chrysalisProfile.settings.hideNetworkStatistics) {
                    migratedProfile.settings.hideNetworkStatistics = chrysalisProfile.settings.hideNetworkStatistics
                }
            }

            // network
            const chrysalisProfileNetworkId =
                chrysalisProfile.settings?.networkConfig?.network?.id ?? ChrysalisNetworkId.Mainnet
            const migratedNetworkId = getMigratedNetworkId(chrysalisProfileNetworkId)
            const migratedNetwork = getDefaultPersistedNetwork(migratedNetworkId)
            migratedProfile.network = migratedNetwork

            // clientOptions
            const migratedClientOptions = getDefaultClientOptions(migratedNetworkId)
            migratedProfile.clientOptions = migratedClientOptions
            if (chrysalisProfile.settings?.networkConfig?.nodes) {
                chrysalisProfile.settings?.networkConfig?.nodes.forEach((node) => {
                    if (!isOfficalChrysalisNode(node.url)) {
                        const migratedNode = convertChrysalisNodeToStardust(node)
                        if (!migratedProfile.clientOptions.nodes) {
                            migratedProfile.clientOptions.nodes = []
                        }
                        migratedProfile.clientOptions.nodes.push(migratedNode)
                    }
                })
            }
            migratedProfile.clientOptions.localPow =
                chrysalisProfile.settings?.networkConfig?.localPow ?? migratedClientOptions.localPow

            migrated = true
            saveProfile(migratedProfile)
        }
    }
    return migrated
}

function getMigratedNetworkId(chrysalisNetworkId: ChrysalisNetworkId): NetworkId {
    switch (chrysalisNetworkId) {
        case ChrysalisNetworkId.Mainnet:
            return NetworkId.Iota
        case ChrysalisNetworkId.Devnet:
            return NetworkId.IotaAlphanet
        case ChrysalisNetworkId.PrivateNet:
            return NetworkId.Custom
        default:
            throw new Error(`Unable to migrate network: ${chrysalisNetworkId}`)
    }
}

function convertChrysalisNodeToStardust(node: IChrysalisNode): INode {
    return {
        url: node.url,
        ...(node.auth
            ? {
                  ...(node.auth.jwt ? { jwt: node.auth.jwt } : {}),
                  basicAuthNamePwd: [node.auth.username ?? '', node.auth.password ?? ''],
              }
            : {}),
        ...(node.isDisabled ? { disabled: node.isDisabled } : {}),
    }
}

const isOfficalChrysalisNode = (nodeUrl: string): boolean => {
    const CHRYSALIS_DEVNET_OFFICIAL_NODES = [
        'https://api.lb-0.h.chrysalis-devnet.iota.cafe',
        'https://api.lb-1.h.chrysalis-devnet.iota.cafe',
    ]
    const CHRYSALIS_MAINNET_OFFICIAL_NODES = [
        'https://chrysalis-nodes.iota.org',
        'https://chrysalis-nodes.iota.cafe',
        'https://iota-node.tanglebay.com',
    ]
    return [...CHRYSALIS_DEVNET_OFFICIAL_NODES, ...CHRYSALIS_MAINNET_OFFICIAL_NODES].includes(nodeUrl)
}

function isChrysalisProfile(profile: IPersistedProfile | IChrysalisPersistedProfile): boolean {
    if ('settings' in profile && 'networkConfig' in profile.settings) {
        const chrysalisProfile = profile as IChrysalisPersistedProfile
        const chrysalisNetworkIdsArray: string[] = Object.values(ChrysalisNetworkId)
        const chrysalisProfileNetworkId = chrysalisProfile?.settings?.networkConfig?.network?.id
        if (chrysalisProfileNetworkId) {
            return chrysalisNetworkIdsArray.includes(chrysalisProfileNetworkId)
        }
    }
    return false
}

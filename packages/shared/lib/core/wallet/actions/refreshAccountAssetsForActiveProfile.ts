import { activeAccounts, activeProfile, getBaseToken, getCoinType } from '@core/profile'
import { get } from 'svelte/store'
import { getOrRequestAssetFromPersistedAssets } from '../actions'
import { TokenStandard, VerifiedStatus } from '../enums'
import { IPersistedAsset } from '../interfaces'
import {
    addPersistedAsset,
    clearPersistedAssetForActiveProfile,
    persistedAssets,
} from '../stores/persisted-assets.store'

export async function refreshAccountAssetsForActiveProfile(
    clearPersistedAssets = false,
    keepVerificationStatus = false
): Promise<void> {
    const storedVerificationStates = {}
    if (keepVerificationStatus) {
        const assets = get(persistedAssets)?.[get(activeProfile)?.id] ?? {}
        for (const [id, asset] of Object.entries(assets)) {
            storedVerificationStates[id] = asset.verification
        }
    }
    clearPersistedAssets && clearPersistedAssetForActiveProfile()

    const persistedBaseCoin: IPersistedAsset = {
        id: getCoinType(),
        standard: TokenStandard.BaseToken,
        metadata: getBaseToken(),
        hidden: false,
        verification: { verified: true, status: VerifiedStatus.Official },
    }

    const assets: IPersistedAsset[] = []
    const accounts = get(activeAccounts)
    for (const account of accounts) {
        const tokens = account?.balances?.nativeTokens ?? []
        for (const token of tokens) {
            try {
                const persistedAsset = await getOrRequestAssetFromPersistedAssets(token.tokenId)
                if (persistedAsset) {
                    if (keepVerificationStatus) {
                        const verificationStatus = storedVerificationStates[persistedAsset.id]
                        persistedAsset.verification = verificationStatus
                    }
                    assets.push(persistedAsset)
                }
            } catch (err) {
                console.error(err)
            }
        }
    }
    addPersistedAsset(persistedBaseCoin, ...assets)
}

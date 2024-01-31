import { activeWallets, activeProfile, getBaseToken, getCoinType } from '@core/profile'
import { get } from 'svelte/store'
import { getOrRequestAssetFromPersistedAssets } from '.'
import { TokenStandard, VerifiedStatus } from '../enums'
import { IPersistedAsset } from '../interfaces'
import {
    addPersistedAsset,
    clearPersistedAssetForActiveProfile,
    persistedAssets,
} from '../stores/persisted-assets.store'

export async function refreshWalletAssetsForActiveProfile(
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
    const wallets = get(activeWallets)
    for (const wallet of wallets) {
        const tokens = wallet?.balances?.nativeTokens ?? {}
        for (const tokenId of Object.keys(tokens)) {
            try {
                const persistedAsset = await getOrRequestAssetFromPersistedAssets(tokenId)
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

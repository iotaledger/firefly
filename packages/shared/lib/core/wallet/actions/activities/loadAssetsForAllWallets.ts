import { getOrRequestAssetFromPersistedAssets } from '../getOrRequestAssetFromPersistedAssets'
import { IWalletState } from '@core/wallet/interfaces'
import { get } from 'svelte/store'
import { ActivityType } from '@core/wallet/enums'
import { allWalletActivities, addPersistedAsset } from '../../stores'
import { IPersistedAsset } from '@core/wallet/interfaces'

export async function loadAssetsForAllWallets(wallet: IWalletState): Promise<void> {
    const walletActivities = get(allWalletActivities)[wallet.id]

    const persistedAssets: IPersistedAsset[] = []
    for (const activity of walletActivities) {
        try {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const asset = await getOrRequestAssetFromPersistedAssets(activity.assetId)
                if (asset) {
                    persistedAssets.push(asset)
                }
            }
        } catch (err) {
            console.error(err)
        }
    }
    addPersistedAsset(...persistedAssets)
}

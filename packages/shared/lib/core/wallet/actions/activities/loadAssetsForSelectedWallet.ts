import { getOrRequestAssetFromPersistedAssets } from '../getOrRequestAssetFromPersistedAssets'
import { get } from 'svelte/store'
import { ActivityType } from '@core/wallet/enums'
import { addPersistedAsset, selectedWalletActivities } from '../../stores'
import { IPersistedAsset } from '@core/wallet/interfaces'

export async function loadAssetsForSelectedWallet(): Promise<void> {
    const walletActivities = get(selectedWalletActivities);

    const persistedAssets: IPersistedAsset[] = []
    for (const activity of walletActivities) {
        try {
            if (activity.type() === ActivityType.Transaction || activity.type() === ActivityType.Foundry) {
                const asset = await getOrRequestAssetFromPersistedAssets(activity.assetId())
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

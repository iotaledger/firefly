import { getOrRequestAssetFromPersistedAssets } from '../getOrRequestAssetFromPersistedAssets'
import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { allAccountActivities, addPersistedAsset } from '../../stores'
import { IPersistedAsset } from '@core/wallet/interfaces'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[Number(account.id)]

    try {
        const persistedAssets: IPersistedAsset[] = []
        for (const activity of accountActivities) {
            const asset = await getOrRequestAssetFromPersistedAssets(activity.data.assetId)
            if (asset) {
                persistedAssets.push(asset)
            }
        }
        addPersistedAsset(...persistedAssets)
    } catch (reason) {
        console.error(reason)
    }
}

import { getOrRequestAssetFromPersistedAssets } from '../getOrRequestAssetFromPersistedAssets'
import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { ActivityType } from '@core/wallet/enums'
import { allAccountActivities, addPersistedAsset } from '../../stores'
import { IPersistedAsset } from '@core/wallet/interfaces'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const persistedAssets: IPersistedAsset[] = []
    for (const activity of accountActivities) {
        try {
            if (activity.data.type !== ActivityType.Nft) {
                const asset = await getOrRequestAssetFromPersistedAssets(activity.data.assetId)
                if (asset) {
                    persistedAssets.push(asset)
                }
            }
        } catch (reason) {
            console.error(reason)
        }
    }
    addPersistedAsset(...persistedAssets)
}

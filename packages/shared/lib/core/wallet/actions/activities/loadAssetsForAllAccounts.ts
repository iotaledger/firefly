import { tryGetAndStoreAssetFromPersistedAssets } from '../tryGetAndStoreAssetFromPersistedAssets'
import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { allAccountActivities } from '../../stores'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[Number(account.id)]

    for (const activity of accountActivities) {
        try {
            await tryGetAndStoreAssetFromPersistedAssets(activity.data.assetId)
        } catch (reason) {
            console.error(reason)
        }
    }
}

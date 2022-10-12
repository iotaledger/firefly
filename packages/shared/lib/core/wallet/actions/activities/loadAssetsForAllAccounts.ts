import { tryGetAndStoreAssetFromPersistedAssets } from '../tryGetAndStoreAssetFromPersistedAssets'
import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { allAccountActivities } from '../../stores'
import { ActivityType } from '@core/wallet/enums'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    for (const activity of accountActivities) {
        try {
            if (activity.data.type !== ActivityType.Nft) {
                await tryGetAndStoreAssetFromPersistedAssets(activity.data.assetId)
            }
        } catch (reason) {
            console.error(reason)
        }
    }
}

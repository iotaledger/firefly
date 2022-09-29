import { getOrRequestAssetFromPersistedAssets } from '../getOrRequestAssetFromPersistedAssets'
import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { allAccountActivities, setPersistedAssets } from '../../stores'
import { IPersistedAsset } from '@core/wallet/interfaces'

export async function loadAssetsForAllActivities(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[Number(account.id)]

    try {
        const persistedAssets: { [tokenId: string]: IPersistedAsset } = {}
        for (const activity of accountActivities) {
            const assets = await getOrRequestAssetFromPersistedAssets(activity.data.assetId)
            persistedAssets[assets.id] = assets
        }
        setPersistedAssets(persistedAssets)
    } catch (reason) {
        console.error(reason)
    }
}

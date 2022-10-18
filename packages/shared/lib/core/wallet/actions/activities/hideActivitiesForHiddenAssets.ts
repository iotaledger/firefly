import { get } from 'svelte/store'
import { allAccountActivities, persistedAssets } from '../../stores'
import { activeProfile } from '@core/profile'
import { selectedAccountIndex } from '@core/account'
import { ActivityType } from '@core/wallet/enums'

export function hideActivitiesForHiddenAssets(): void {
    const assets = get(persistedAssets)?.[get(activeProfile)?.id]
    allAccountActivities.update((state) => {
        state[get(selectedAccountIndex)].forEach((_activity) => {
            if (_activity.data.type !== ActivityType.Nft) {
                const isAssetHidden = !assets[_activity?.data?.assetId] || assets[_activity?.data?.assetId]?.hidden
                _activity.updateFromPartialActivity({ isAssetHidden })
            }
        })
        return state
    })
}

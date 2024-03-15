import { get } from 'svelte/store'
import { allWalletActivities, persistedAssets, selectedWalletId } from '../../stores'
import { activeProfile } from '@core/profile'
import { ActivityType } from '@core/wallet/enums'
import { updateActivityFromPartialActivity } from '@core/wallet/utils/generateActivity/helper'

export function hideActivitiesForHiddenAssets(): void {
    const assets = get(persistedAssets)?.[get(activeProfile)?.id]
    allWalletActivities.update((state) => {
        state[get(selectedWalletId)].forEach((_activity) => {
            if (_activity.type === ActivityType.Transaction || _activity.type === ActivityType.Foundry) {
                const isAssetHidden = !assets[_activity.assetId] || assets[_activity.assetId]?.hidden
                updateActivityFromPartialActivity(_activity, { isAssetHidden })
            }
        })
        return state
    })
}

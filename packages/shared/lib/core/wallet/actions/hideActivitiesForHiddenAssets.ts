import { get } from 'svelte/store'
import { allAccountActivities, persistedAssets } from '../stores'
import { activeProfile } from '@core/profile'
import { selectedAccountId } from '@core/account'

export function hideActivitiesForHiddenAssets(): void {
    const assets = get(persistedAssets)?.[get(activeProfile)?.id]
    allAccountActivities.update((state) => {
        state[Number(get(selectedAccountId))].forEach((_activity) => {
            const isAssetHidden = !assets[_activity.asset?.id] || assets[_activity.asset?.id]?.hidden
            _activity.updateFromPartialActivity({ isAssetHidden })
        })
        return state
    })
}

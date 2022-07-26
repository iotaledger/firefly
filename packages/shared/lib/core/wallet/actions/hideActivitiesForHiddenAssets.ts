import { get } from 'svelte/store'
import { allAccountActivities, persistedAssets } from '../stores'
import { activeProfile } from '@core/profile'

export function hideActivitiesForHiddenAssets(accountId: string): void {
    const assets = get(persistedAssets)?.[get(activeProfile)?.id]
    allAccountActivities.update((state) => {
        state[Number(accountId)].forEach((_activity) => {
            const isAssetHidden = !assets[_activity.asset?.id] || assets[_activity.asset?.id]?.hidden
            _activity.updateFromPartialActivity({ isAssetHidden })
        })
        return state
    })
}

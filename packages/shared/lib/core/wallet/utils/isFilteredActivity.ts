import { get } from 'svelte/store'
import { Activity } from '../classes'
import { activityFilter } from '../stores'

export function isFilteredActivity(activity: Activity): boolean {
    const filter = get(activityFilter)

    if (!filter.showHidden.active && activity.isAssetHidden) {
        return true
    }
    return false
}

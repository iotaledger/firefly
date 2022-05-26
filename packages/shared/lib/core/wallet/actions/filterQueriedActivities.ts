import { ActivityDirection } from '@core/wallet'
import { get } from 'svelte/store'
import { selectedAccountActivities, queriedActivities } from '../stores'

export function filterQueriedActivities(filter: number): void {
    let activityList = get(selectedAccountActivities)

    if (filter === 1) {
        activityList = activityList.filter((activity) => activity.direction === ActivityDirection.In)
    } else if (filter === 2) {
        activityList = activityList.filter((activity) => activity.direction === ActivityDirection.Out)
    }
    queriedActivities.set(activityList)
}

import { ActivityDirection } from '@core/wallet'
import { formatUnitBestMatch } from '@lib/units'
import { unitToValue } from '@lib/utils'
import { get } from 'svelte/store'
import { selectedAccountActivities, queriedActivities } from '../stores'

export function filterQueriedActivities(filter: number): void {
    let activityList = get(selectedAccountActivities)

    if (filter === 1) {
        activityList = activityList.filter((activity) => activity.direction === ActivityDirection.In)
    } else if (filter === 2) {
        activityList = activityList.filter((activity) => activity.direction === ActivityDirection.Out)
    }

    activityList = activityList.filter(
        (activity) =>
            (activity.recipient.type === 'account' && activity.recipient?.account?.name === searchTerm) ||
            (activity.recipient.type === 'address' && activity.recipient?.address === searchTerm) ||
            activity?.id.toLowerCase() === searchTerm ||
            (searchTerm[0] === '>' && unitToValue(searchTerm.substring(1)) < activity.rawAmount) ||
            (searchTerm[0] === '<' && unitToValue(searchTerm.substring(1)) > activity.rawAmount) ||
            (searchTerm[1] === 'i' && isValueInUnitRange(activity.rawAmount, searchTerm)) ||
            activity.rawAmount === unitToValue(searchTerm) ||
            formatUnitBestMatch(activity.rawAmount).toString().toLowerCase()?.includes(searchTerm)
    )

    queriedActivities.set(activityList)
}

import { get } from 'svelte/store'
import { activities, queriedActivities } from '../stores'
import { isValueInUnitRange, unitToValue } from '@lib/utils'
import { formatUnitBestMatch } from 'shared/lib/units'

export function searchQueriedActivities(searchTerm: string): void {
    queriedActivities.set(
        get(activities).filter(
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
    )
}

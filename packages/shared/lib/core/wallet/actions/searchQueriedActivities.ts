import { get } from 'svelte/store'
import { activities, queriedActivities } from '../stores'
import { isValueInUnitRange, unitToValue } from '@lib/utils'
import { formatUnitBestMatch } from 'shared/lib/units'

export function searchQueriedActivities(searchTerm: string): void {
    queriedActivities.set(
        get(activities).filter((activity) => {
            const amount = unitToValue(activity.amount)
            return (
                activity.subjectAccountName === searchTerm ||
                activity.subjectAddress === searchTerm ||
                activity?.id.toLowerCase() === searchTerm ||
                (searchTerm[0] === '>' && unitToValue(searchTerm.substring(1)) < amount) ||
                (searchTerm[0] === '<' && unitToValue(searchTerm.substring(1)) > amount) ||
                (searchTerm[1] === 'i' && isValueInUnitRange(amount, searchTerm)) ||
                amount === unitToValue(searchTerm) ||
                formatUnitBestMatch(amount).toString().toLowerCase()?.includes(searchTerm)
            )
        })
    )
}

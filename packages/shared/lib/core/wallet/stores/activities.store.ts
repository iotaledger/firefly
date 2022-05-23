import { selectedAccount } from '@core/account'
import { derived, Readable } from 'svelte/store'
import { getAccountMessages } from '@lib/wallet'
import { parseTransactionsToActivities } from '../utils'
import { ActivityDirection, IActivity } from '@lib/typings/activity'
import { isValueInUnitRange, unitToValue } from '@lib/utils'
import { formatUnitBestMatch } from 'shared/lib/units'
import { formatDate } from '@core/i18n'

export const activities: Readable<IActivity[]> = derived([selectedAccount], ([$selectedAccount]) =>
    parseTransactionsToActivities(getAccountMessages($selectedAccount))
)

export function filterActivities(activities: IActivity[], filter: number): IActivity[] {
    switch (filter) {
        case 0:
            return activities
        case 1:
            return activities.filter((activity) => activity.direction === ActivityDirection.In)
        case 2:
            return activities.filter((activity) => activity.direction === ActivityDirection.Out)
        default:
            return activities
    }
}

export function searchActivities(activities: IActivity[], searchTerm: string): IActivity[] {
    return activities.filter((activity) => {
        const amount = unitToValue(activity.amount)
        return (
            activity.subject === searchTerm ||
            activity?.id.toLowerCase() === searchTerm ||
            (searchTerm[0] === '>' && unitToValue(searchTerm.substring(1)) < amount) ||
            (searchTerm[0] === '<' && unitToValue(searchTerm.substring(1)) > amount) ||
            (searchTerm[1] === 'i' && isValueInUnitRange(amount, searchTerm)) ||
            amount === unitToValue(searchTerm) ||
            formatUnitBestMatch(amount).toString().toLowerCase()?.includes(searchTerm)
        )
    })
}

export function groupActivities(activities: IActivity[]): IActivity[] {
    const groupedActivities = []
    for (const activity of activities) {
        const activityDate = formatDate(new Date(Number(activity.timestamp)), { year: 'numeric', month: 'short' })
        if (!groupedActivities.some((group) => group.date === activityDate)) {
            groupedActivities.push({ date: activityDate, activities: [] })
        }
        const index = groupedActivities.findIndex((group) => group.date === activityDate)
        groupedActivities[index].activities.push(activity)
    }
    return groupedActivities
}

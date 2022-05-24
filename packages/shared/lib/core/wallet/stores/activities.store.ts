import { selectedAccount } from '@core/account'
import { derived, get, Readable, writable, Writable } from 'svelte/store'
import { getAccountMessages } from '@lib/wallet'
import { parseTransactionsToActivities } from '../utils'
import { ActivityDirection, IActivity } from '@lib/typings/activity'
import { isValueInUnitRange, unitToValue } from '@lib/utils'
import { formatUnitBestMatch } from 'shared/lib/units'
import { formatDate, localize } from '@core/i18n'

export const activities: Readable<IActivity[]> = derived([selectedAccount], ([$selectedAccount]) =>
    parseTransactionsToActivities(getAccountMessages($selectedAccount))
)

export const queriedActivities: Writable<IActivity[]> = writable([])

interface GroupedActivity {
    date: string
    activities: IActivity[]
}

export const groupedActivities: Readable<GroupedActivity[]> = derived([queriedActivities], ([$queriedActivities]) => {
    const groupedActivities: GroupedActivity[] = []
    for (const activity of $queriedActivities) {
        const activityDate = getDateString(activity.timestamp)
        if (!groupedActivities.some((group) => group.date === activityDate)) {
            groupedActivities.push({ date: activityDate, activities: [] })
        }
        const index = groupedActivities.findIndex((group) => group.date === activityDate)
        groupedActivities[index].activities.push(activity)
    }
    return groupedActivities
})

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

export function filterQueriedActivities(filter: number): void {
    let activityList = get(activities)

    if (filter === 1) {
        activityList = activityList.filter((activity) => activity.direction === ActivityDirection.In)
    } else if (filter === 2) {
        activityList = activityList.filter((activity) => activity.direction === ActivityDirection.Out)
    }
    queriedActivities.set(activityList)
}

function getDateString(timestamp): string {
    const dateString = getMonthYear(new Date(Number(timestamp)))
    return dateString === getMonthYear(new Date()) ? localize('general.thisMonth') : dateString
}

function getMonthYear(date): string {
    return formatDate(date, { year: 'numeric', month: 'short' })
}

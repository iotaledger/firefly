import { selectedAccount } from '@core/account'
import { derived, Readable, writable, Writable } from 'svelte/store'
import { getAccountMessages } from '@lib/wallet'
import { parseTransactionsToActivities } from '../utils'
import { getMonthYear } from '@lib/utils'
import { Transaction } from '@lib/typings/message'
import { AccountMessage } from '@lib/typings/wallet'
import { localize } from '@core/i18n'
import { IActivity } from '../interfaces/activity.interface'

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
        const activityDate = getActivityGroupTitleForTimestamp(activity.timestamp)
        if (!groupedActivities.some((group) => group.date === activityDate)) {
            groupedActivities.push({ date: activityDate, activities: [] })
        }
        const index = groupedActivities.findIndex((group) => group.date === activityDate)
        groupedActivities[index].activities.push(activity)
    }
    return groupedActivities
})

function getActivityGroupTitleForTimestamp(timestamp): string {
    const dateString = getMonthYear(new Date(Number(timestamp)))
    return dateString === getMonthYear(new Date()) ? localize('general.thisMonth') : dateString
}

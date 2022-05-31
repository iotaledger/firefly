import { selectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { getMonthYear } from '@lib/utils'
import { derived, Readable, writable, Writable } from 'svelte/store'
import { Activity } from '..'
import { allAccountActivities } from './all-account-activities.store'

export const selectedAccountActivities: Readable<Activity[]> = derived(
    [selectedAccount, allAccountActivities],
    ([$selectedAccount, $allAccountActivities]) =>
        $allAccountActivities.find((accountActivity) => $selectedAccount?.id === accountActivity.accountId)
            ?.activities ?? []
)

export const queriedActivities: Writable<Activity[]> = writable([])

interface GroupedActivity {
    date: string
    activities: Activity[]
}

export const groupedActivities: Readable<GroupedActivity[]> = derived([queriedActivities], ([$queriedActivities]) => {
    const groupedActivities: GroupedActivity[] = []
    for (const activity of $queriedActivities) {
        const activityDate = getActivityGroupTitleForTimestamp(activity.time)
        if (!groupedActivities.some((group) => group.date === activityDate)) {
            groupedActivities.push({ date: activityDate, activities: [] })
        }
        const index = groupedActivities.findIndex((group) => group.date === activityDate)
        groupedActivities[index].activities.push(activity)
    }
    return groupedActivities
})

function getActivityGroupTitleForTimestamp(time: Date): string {
    const dateString = getMonthYear(time)
    return dateString === getMonthYear(new Date()) ? localize('general.thisMonth') : dateString
}

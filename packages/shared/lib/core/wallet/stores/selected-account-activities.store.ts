import { derived, Readable, writable, Writable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'

import { localize } from '@core/i18n'
import { formatUnitBestMatch } from '@lib/units'
import { getMonthYear, isValueInUnitRange, unitToValue } from '@lib/utils'

import { Activity, ActivityDirection } from '..'
import { allAccountActivities } from './all-account-activities.store'

export const selectedAccountActivities: Readable<Activity[]> = derived(
    [selectedAccount, allAccountActivities],
    ([$selectedAccount, $allAccountActivities]) => {
        if (selectedAccount) {
            return $allAccountActivities[$selectedAccount?.id] ?? []
        } else {
            return []
        }
    }
)

export const activityFilterIndex: Writable<number> = writable(0)
export const activitySearchTerm: Writable<string> = writable('')

export const queriedActivities: Readable<Activity[]> = derived(
    [selectedAccountActivities, activityFilterIndex, activitySearchTerm],
    ([$selectedAccountActivities, $activityFilterIndex, $activitySearchTerm]) => {
        let activityList = $selectedAccountActivities

        if ($activityFilterIndex === 1) {
            activityList = activityList.filter((activity) => activity.direction === ActivityDirection.In)
        } else if ($activityFilterIndex === 2) {
            activityList = activityList.filter((activity) => activity.direction === ActivityDirection.Out)
        }

        if (activitySearchTerm) {
            activityList = activityList.filter(
                (activity) =>
                    (activity.recipient.type === 'account' &&
                        activity.recipient?.account?.name === $activitySearchTerm) ||
                    (activity.recipient.type === 'address' && activity.recipient?.address === $activitySearchTerm) ||
                    activity?.id?.toLowerCase() === $activitySearchTerm ||
                    ($activitySearchTerm[0] === '>' &&
                        unitToValue($activitySearchTerm.substring(1)) < activity.rawAmount) ||
                    ($activitySearchTerm[0] === '<' &&
                        unitToValue($activitySearchTerm.substring(1)) > activity.rawAmount) ||
                    ($activitySearchTerm[1] === 'i' && isValueInUnitRange(activity.rawAmount, $activitySearchTerm)) ||
                    activity.rawAmount === unitToValue($activitySearchTerm) ||
                    formatUnitBestMatch(activity.rawAmount).toString().toLowerCase()?.includes($activitySearchTerm)
            )
        }

        return activityList
    }
)

interface GroupedActivity {
    date: string
    activities: Activity[]
}

export const groupedActivities: Readable<GroupedActivity[]> = derived([queriedActivities], ([$queriedActivities]) => {
    const groupedActivities: GroupedActivity[] = []
    for (const activity of $queriedActivities.filter((activity) => !activity.isHidden && !activity.isAssetHidden)) {
        const activityDate = getActivityGroupTitleForTimestamp(activity.time)
        if (!groupedActivities.some((group) => group.date === activityDate)) {
            groupedActivities.push({ date: activityDate, activities: [] })
        }
        const index = groupedActivities.findIndex((group) => group.date === activityDate)
        groupedActivities[index].activities.push(activity)
    }
    for (const groupedActivitiesPerDate of groupedActivities) {
        groupedActivitiesPerDate.activities = groupedActivitiesPerDate.activities.sort(
            (activity1, activity2) => activity2.time.getTime() - activity1.time.getTime()
        )
    }
    return groupedActivities
})

function getActivityGroupTitleForTimestamp(time: Date): string {
    const dateString = getMonthYear(time)
    return dateString === getMonthYear(new Date()) ? localize('general.thisMonth') : dateString
}

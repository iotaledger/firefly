import { derived, Readable, writable, Writable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'

import { localize } from '@core/i18n'
import { formatUnitBestMatch } from '@lib/units'
import { getMonthYear, isValueInUnitRange, unitToValue } from '@lib/utils'

import { Activity } from '../classes/activity.class'
import { allAccountActivities } from './all-account-activities.store'
import { isFilteredActivity } from '../utils/isFilteredActivity'
import { ActivityFilter } from '../interfaces/filter.interface'

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

export const activityFilter: Writable<ActivityFilter> = writable({
    showHidden: { active: false, type: 'boolean', label: 'filters.showHidden' },
})
export const activitySearchTerm: Writable<string> = writable('')

export const queriedActivities: Readable<Activity[]> = derived(
    [selectedAccountActivities, activitySearchTerm, activityFilter],
    ([$selectedAccountActivities, $activitySearchTerm]) => {
        let activityList = $selectedAccountActivities

        activityList = activityList.filter((activity) => !isFilteredActivity(activity))

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

        return activityList.sort((activity1, activity2) => activity2.time.getTime() - activity1.time.getTime())
    }
)

interface GroupedActivity {
    date: string
    activities: Activity[]
}

export const groupedActivities: Readable<GroupedActivity[]> = derived([queriedActivities], ([$queriedActivities]) => {
    const groupedActivities: GroupedActivity[] = []
    for (const activity of $queriedActivities.filter((activity) => !activity.isHidden)) {
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

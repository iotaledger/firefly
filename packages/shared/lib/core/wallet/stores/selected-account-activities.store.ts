import { derived, Readable, writable, Writable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'

import { formatUnitBestMatch } from '@lib/units'
import { isValueInUnitRange, unitToValue } from '@lib/utils'

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
        let activityList = $selectedAccountActivities.filter((_activity) => !_activity.isHidden)

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

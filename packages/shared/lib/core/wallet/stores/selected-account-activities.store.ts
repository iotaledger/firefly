import { derived, Readable, writable, Writable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'

import { formatUnitBestMatch } from '@lib/units'
import { isValueInUnitRange, unitToValue } from '@lib/utils'

import { Activity } from '../classes/activity.class'
import { allAccountActivities } from './all-account-activities.store'
import { isFilteredActivity } from '../utils/isFilteredActivity'
import { ActivityFilter } from '../interfaces/filter.interface'
import { NumberFilterOption, BooleanFilterOption, TypeFilterOption, StatusFilterOption, ActivityType } from '../enums'

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
    amount: {
        type: 'number',
        active: false,
        localeKey: 'filters.amount',
        selected: NumberFilterOption.Equal,
        choices: Object.values(NumberFilterOption),
        subunit: {
            type: 'single',
            amount: '',
        },
    },
    asset: {
        active: false,
        type: 'asset',
        localeKey: 'filters.asset',
        selected: '',
    },
    status: {
        active: false,
        type: 'selection',
        localeKey: 'filters.status',
        selected: StatusFilterOption.Confirmed,
        choices: [
            StatusFilterOption.Confirmed,
            StatusFilterOption.Pending,
            StatusFilterOption.Claimed,
            StatusFilterOption.Unclaimed,
        ],
    },
    type: {
        active: false,
        type: 'selection',
        localeKey: 'filters.type',
        selected: TypeFilterOption.Incoming,
        choices: [TypeFilterOption.Incoming, TypeFilterOption.Outgoing, TypeFilterOption.Internal],
    },
    showRejected: {
        active: false,
        type: 'selection',
        localeKey: 'filters.showRejected',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
    showHidden: {
        active: false,
        type: 'selection',
        localeKey: 'filters.showHidden',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
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
                    (activity.data.type === ActivityType.Transaction &&
                        ((activity.data.recipient?.type === 'account' &&
                            activity.data.recipient?.account?.name === $activitySearchTerm) ||
                            (activity.data.recipient?.type === 'address' &&
                                activity.data.recipient?.address === $activitySearchTerm))) ||
                    activity?.id?.toLowerCase() === $activitySearchTerm ||
                    ($activitySearchTerm[0] === '>' &&
                        unitToValue($activitySearchTerm.substring(1)) < activity.data.rawAmount) ||
                    ($activitySearchTerm[0] === '<' &&
                        unitToValue($activitySearchTerm.substring(1)) > activity.data.rawAmount) ||
                    ($activitySearchTerm[1] === 'i' &&
                        isValueInUnitRange(activity.data.rawAmount, $activitySearchTerm)) ||
                    activity.data.rawAmount === unitToValue($activitySearchTerm) ||
                    formatUnitBestMatch(activity.data.rawAmount).toString().toLowerCase()?.includes($activitySearchTerm)
            )
        }

        return activityList.sort((activity1, activity2) => activity2.time.getTime() - activity1.time.getTime())
    }
)

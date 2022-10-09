import { derived, Readable, writable, Writable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'
import { Activity } from '../classes/activity.class'
import {
    ActivityType,
    AliasType,
    BooleanFilterOption,
    DateFilterOption,
    NumberFilterOption,
    StatusFilterOption,
    TypeFilterOption,
} from '../enums'
import { IActivity } from '../interfaces'
import { ActivityFilter } from '../interfaces/filter/filter.interface'
import { getAssetFromPersistedAssets } from '../utils'
import { isVisibleActivity } from '../utils/isVisibleActivity'
import { allAccountActivities } from './all-account-activities.store'
import { isValidIRC30 } from '@lib/utils/isValidIRC30'

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
    date: {
        active: false,
        type: 'date',
        localeKey: 'filters.date',
        selected: DateFilterOption.Equals,
        choices: Object.values(DateFilterOption),
        subunit: {
            type: 'single',
            value: undefined,
        },
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
        let activityList = $selectedAccountActivities.filter((_activity) => {
            const asset = getAssetFromPersistedAssets(_activity.data.assetId)
            return (
                !_activity.isHidden &&
                asset &&
                isValidIRC30(asset.metadata) &&
                (_activity.data.type !== ActivityType.Alias || _activity.data.aliasType === AliasType.Created)
            )
        })

        activityList = activityList.filter((activity) => isVisibleActivity(activity))

        if ($activitySearchTerm) {
            activityList = activityList.filter((activity) => {
                const fieldsToSearch = getFieldsToSearchFromActivity(activity)
                return fieldsToSearch.find((field) =>
                    field?.toLowerCase()?.includes($activitySearchTerm?.toLowerCase())
                )
            })
        }

        return activityList.sort((activity1, activity2) => activity2.time.getTime() - activity1.time.getTime())
    }
)

function getFieldsToSearchFromActivity(activity: IActivity): string[] {
    const fieldsToSearch: string[] = []

    if (activity.transactionId) {
        fieldsToSearch.push(activity.transactionId)
    }

    if (activity.data.assetId) {
        fieldsToSearch.push(activity.data.assetId)
        fieldsToSearch.push(getAssetFromPersistedAssets(activity.data.assetId)?.metadata?.name)
    }

    if (
        (activity.data.type === ActivityType.Transaction, activity.data.type === ActivityType.Foundry) &&
        activity.data.rawAmount
    ) {
        fieldsToSearch.push(activity.data.rawAmount?.toString())
        fieldsToSearch.push(activity.getFormattedAmount(false)?.toLowerCase())
    }

    if (activity.data.type === ActivityType.Transaction) {
        if (activity.data.subject?.type === 'account') {
            fieldsToSearch.push(activity.data.subject?.account?.name)
        } else if (activity.data.subject?.type === 'address') {
            fieldsToSearch.push(activity.data.subject?.address)
        }

        if (activity.data.claimingTransactionId) {
            fieldsToSearch.push(activity.data.claimingTransactionId)
        }

        if (activity.data.metadata) {
            fieldsToSearch.push(activity.data.metadata)
        }

        if (activity.data.tag) {
            fieldsToSearch.push(activity.data.tag)
        }

        if (activity.data.outputId) {
            fieldsToSearch.push(activity.data.outputId)
        }
    }

    return fieldsToSearch
}

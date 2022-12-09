import { derived, Readable, writable, Writable } from 'svelte/store'
import { isValidIrc30 } from '@core/token'

import { selectedAccount } from '../../account/stores/selected-account.store'
import { Activity } from '../types/activity.type'
import {
    ActivityAction,
    ActivityDirection,
    ActivityType,
    BooleanFilterOption,
    DateFilterOption,
    InternalExternalOption,
    NumberFilterOption,
    StatusFilterOption,
} from '../enums'
import { ActivityFilter } from '../interfaces/filter/filter.interface'
import { getAssetFromPersistedAssets, getFormattedAmountFromActivity } from '../utils'
import { isVisibleActivity } from '../utils/isVisibleActivity'
import { allAccountActivities } from './all-account-activities.store'

export const selectedAccountActivities: Readable<Activity[]> = derived(
    [selectedAccount, allAccountActivities],
    ([$selectedAccount, $allAccountActivities]) => {
        if (selectedAccount) {
            return $allAccountActivities[$selectedAccount?.index] ?? []
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
        selected: ActivityType.Basic,
        choices: [ActivityType.Basic, ActivityType.Nft, ActivityType.Foundry, ActivityType.Alias],
    },
    direction: {
        active: false,
        type: 'selection',
        localeKey: 'filters.direction',
        selected: ActivityDirection.Incoming,
        choices: [ActivityDirection.Incoming, ActivityDirection.Outgoing, ActivityDirection.SelfTransaction],
    },
    internalExternal: {
        active: false,
        type: 'selection',
        localeKey: 'filters.internalExternal',
        selected: InternalExternalOption.External,
        choices: [InternalExternalOption.External, InternalExternalOption.Internal],
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
    showValueless: {
        active: false,
        type: 'selection',
        localeKey: 'filters.showValueless',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
})

export const activitySearchTerm: Writable<string> = writable('')

export const queriedActivities: Readable<Activity[]> = derived(
    [selectedAccountActivities, activitySearchTerm, activityFilter],
    ([$selectedAccountActivities, $activitySearchTerm]) => {
        let activityList = $selectedAccountActivities.filter((_activity) => {
            if (
                !_activity.isHidden &&
                (_activity.type === ActivityType.Nft ||
                    (_activity.type === ActivityType.Alias && _activity.action === ActivityAction.Mint))
            ) {
                return true
            }

            const asset =
                (_activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry) &&
                getAssetFromPersistedAssets(_activity.assetId)
            const hasValidAsset = asset && isValidIrc30(asset.metadata)
            return !_activity.isHidden && hasValidAsset
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

function getFieldsToSearchFromActivity(activity: Activity): string[] {
    const fieldsToSearch: string[] = []

    if (activity.transactionId) {
        fieldsToSearch.push(activity.transactionId)
    }

    if ((activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) && activity.assetId) {
        fieldsToSearch.push(activity.assetId)
        fieldsToSearch.push(getAssetFromPersistedAssets(activity.assetId)?.metadata?.name)
    }

    if ((activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) && activity.rawAmount) {
        fieldsToSearch.push(activity.rawAmount?.toString())
        fieldsToSearch.push(getFormattedAmountFromActivity(activity, false)?.toLowerCase())
    }

    if (activity.subject?.type === 'account') {
        fieldsToSearch.push(activity.subject?.account?.name)
    } else if (activity.subject?.type === 'address') {
        fieldsToSearch.push(activity.subject?.address)
    }

    if (activity.asyncData.claimingTransactionId) {
        fieldsToSearch.push(activity.asyncData.claimingTransactionId)
    }

    if (activity.metadata) {
        fieldsToSearch.push(activity.metadata)
    }

    if (activity.tag) {
        fieldsToSearch.push(activity.tag)
    }

    if (activity.outputId) {
        fieldsToSearch.push(activity.outputId)
    }

    return fieldsToSearch
}

import { derived, Readable, writable, Writable } from 'svelte/store'
import { isValidIrc30Token } from '@core/token'

import { selectedAccount } from '../../account/stores/selected-account.store'
import { Activity } from '../types/activity.type'
import { ActivityType, SubjectType } from '../enums'
import { ActivityFilter } from '../interfaces/activity-filter.interface'
import { getAssetFromPersistedAssets, getFormattedAmountFromActivity } from '../utils'
import { isVisibleActivity } from '../utils/isVisibleActivity'
import { allAccountActivities } from './all-account-activities.store'
import { DEFAULT_ACTIVITY_FILTER } from '../constants'

export const selectedAccountActivities: Readable<Activity[]> = derived(
    [selectedAccount, allAccountActivities],
    ([$selectedAccount, $allAccountActivities]) => {
        if ($selectedAccount) {
            return $allAccountActivities[$selectedAccount?.index] ?? []
        } else {
            return []
        }
    }
)

export const activityFilter: Writable<ActivityFilter> = writable(DEFAULT_ACTIVITY_FILTER)

export const activitySearchTerm: Writable<string> = writable('')

export const queriedActivities: Readable<Activity[]> = derived(
    [selectedAccountActivities, activitySearchTerm, activityFilter],
    ([$selectedAccountActivities, $activitySearchTerm]) => {
        let activityList = $selectedAccountActivities.filter((_activity) => {
            const containsAssets = _activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry
            if (!_activity.isHidden && !containsAssets) {
                return true
            }

            const asset =
                _activity.type === ActivityType.Basic || _activity.type === ActivityType.Foundry
                    ? getAssetFromPersistedAssets(_activity.assetId)
                    : undefined
            const hasValidAsset = asset?.metadata && isValidIrc30Token(asset.metadata)
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

    if (activity?.transactionId) {
        fieldsToSearch.push(activity.transactionId)
    }

    if ((activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) && activity.assetId) {
        fieldsToSearch.push(activity.assetId)

        const assetName = getAssetFromPersistedAssets(activity.assetId)?.metadata?.name
        if (assetName) {
            fieldsToSearch.push(assetName)
        }
    }

    if ((activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) && activity.rawAmount) {
        fieldsToSearch.push(activity.rawAmount?.toString())
        fieldsToSearch.push(getFormattedAmountFromActivity(activity, false)?.toLowerCase())
    }

    if (activity.subject?.type === SubjectType.Account) {
        fieldsToSearch.push(activity.subject?.account?.name)
    } else if (activity.subject?.type === SubjectType.Address) {
        fieldsToSearch.push(activity.subject?.address)
    }

    if (activity?.asyncData?.claimingTransactionId) {
        fieldsToSearch.push(activity.asyncData.claimingTransactionId)
    }

    if (activity?.metadata) {
        fieldsToSearch.push(activity.metadata)
    }

    if (activity?.tag) {
        fieldsToSearch.push(activity.tag)
    }

    if (activity.outputId) {
        fieldsToSearch.push(activity.outputId)
    }

    return fieldsToSearch
}

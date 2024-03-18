import { derived, Readable, writable, Writable } from 'svelte/store'
import { isValidIrc30Token } from '@core/token'
import { selectedWalletId } from './selected-wallet-id.store'
import { ActivityType, SubjectType } from '../enums'
import { ActivityFilter } from '../interfaces/activity-filter.interface'
import { getAssetFromPersistedAssets, getFormattedAmountFromActivity } from '../utils'
import { isVisibleActivity } from '../utils/isVisibleActivity'
import { DEFAULT_ACTIVITY_FILTER } from '../constants'
import { ActivityBase } from '../types'

export const selectedWalletActivities: Readable<ActivityBase[]> = derived(
    [selectedWalletId],
    ([$selectedWallet]) => {
        // if ($selectedWallet) {
        //     return $allWalletActivities[$selectedWallet] ?? []
        // } else {
        //     return []
        // }
        return []
    }
)

export const activityFilter: Writable<ActivityFilter> = writable(DEFAULT_ACTIVITY_FILTER)

export const activitySearchTerm: Writable<string> = writable('')

export const queriedActivities: Readable<ActivityBase[]> = derived(
    [selectedWalletActivities, activitySearchTerm, activityFilter],
    ([$selectedWalletActivities, $activitySearchTerm]) => {
        // TODO: Refactor this an clean up.
        let activityList = $selectedWalletActivities.filter((_activity) => {
            const containsAssets = _activity.type === ActivityType.Transaction || _activity.type === ActivityType.Foundry
            if (!_activity.isHidden && !containsAssets) {
                return true
            }

            const asset =
                _activity.type === ActivityType.Transaction || _activity.type === ActivityType.Foundry
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

function getFieldsToSearchFromActivity(activity: ActivityBase): string[] {
    const fieldsToSearch: string[] = []

    if (activity?.transactionId) {
        fieldsToSearch.push(activity.transactionId)
    }

    if ((activity.type === ActivityType.Transaction || activity.type === ActivityType.Foundry) && activity.assetId) {
        fieldsToSearch.push(activity.assetId)

        const assetName = getAssetFromPersistedAssets(activity.assetId)?.metadata?.name
        if (assetName) {
            fieldsToSearch.push(assetName)
        }
    }

    if ((activity.type === ActivityType.Transaction || activity.type === ActivityType.Foundry) && activity.rawAmount) {
        fieldsToSearch.push(activity.rawAmount?.toString())
        fieldsToSearch.push(getFormattedAmountFromActivity(activity, false)?.toLowerCase())
    }

    if (activity.subject?.type === SubjectType.Wallet) {
        fieldsToSearch.push(activity.subject?.wallet?.name)
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

import { ActivityAction, ActivityDirection, ActivityType } from '@core/wallet/enums'
import { FoundryActivity, TransactionActivity } from '@core/wallet/types'
import { formatTokenAmountBestMatch } from '../formatTokenAmountBestMatch'
import { getAssetFromPersistedAssets } from '../getAssetFromPersistedAssets'

export function getFormattedAmountFromActivity(
    activity: TransactionActivity | FoundryActivity,
    signed: boolean = true
): string {
    if (!activity) return ''

    const metadata = getAssetFromPersistedAssets(activity.assetId)?.metadata
    const amount = formatTokenAmountBestMatch(activity.rawAmount, metadata)
    if (activity.type === ActivityType.Basic) {
        return `${
            (activity.direction === ActivityDirection.Outgoing || activity.action === ActivityAction.Burn) && signed
                ? '- '
                : ''
        }${amount}`
    } else {
        return amount
    }
}

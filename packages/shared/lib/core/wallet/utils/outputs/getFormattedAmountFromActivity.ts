import { ActivityDirection, ActivityType } from '@core/wallet/enums'
import { FoundryActivity, TransactionActivity } from '@core/wallet/types'
import { formatTokenAmountBestMatch } from '../formatTokenAmountBestMatch'
import { getAssetFromPersistedAssets } from '../getAssetFromPersistedAssets'

export function getFormattedAmountFromActivity(
    activity: TransactionActivity | FoundryActivity,
    signed: boolean = true
): string {
    const metadata = getAssetFromPersistedAssets(activity.assetId)?.metadata
    const amount = formatTokenAmountBestMatch(activity.rawAmount, metadata, 2)
    if (activity.type === ActivityType.Basic) {
        return `${activity.direction === ActivityDirection.Outgoing && signed ? '- ' : ''}${amount}`
    } else {
        return amount
    }
}

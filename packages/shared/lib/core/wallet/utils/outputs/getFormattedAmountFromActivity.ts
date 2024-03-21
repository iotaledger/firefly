import { ActivityAction, ActivityDirection, ActivityType } from '@core/wallet/enums'
import { ActivityBase } from '@core/wallet/types'
import { formatTokenAmountBestMatch } from '../formatTokenAmountBestMatch'
import { getAssetFromPersistedAssets } from '../getAssetFromPersistedAssets'

// TODO: Move into ActivityBase or new abstract class. TransactionActivity | FoundryActivity | VestingActivity,
export function getFormattedAmountFromActivity(
    activity: ActivityBase,
    signed: boolean = true
): string {
    if (!activity) return ''
    const metadata = getAssetFromPersistedAssets(activity.assetId)?.metadata
    const amount = formatTokenAmountBestMatch(activity.rawAmount, metadata)
    if (activity.type === ActivityType.Transaction) {
        return `${
            (activity.direction === ActivityDirection.Outgoing || activity.action === ActivityAction.Burn) && signed
                ? '- '
                : ''
        }${amount}`
    } else {
        return amount
    }
}

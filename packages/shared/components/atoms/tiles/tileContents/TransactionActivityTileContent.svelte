<script lang="typescript">
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network'
    import {
        ActivityDirection,
        IPersistedAsset,
        getFormattedAmountFromActivity,
        TransactionActivity,
        selectedAccountAssets,
        getAssetFromPersistedAssets,
        getActivityTileTitle,
    } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { AssetIcon, ActivityTileContent } from 'shared/components'

    export let activity: TransactionActivity

    let asset: IPersistedAsset
    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(activity.assetId))
    $: title = localize(getActivityTileTitle(activity))
    $: subtitle =
        activity.direction === ActivityDirection.SelfTransaction
            ? localize('general.internalTransaction')
            : localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
                  values: { account: getSubjectLocale(activity) },
              })

    $: amount = getFormattedAmountFromActivity(activity)
    $: isIncoming = activity.direction === ActivityDirection.Incoming
    $: rightText = {
        text: amount,
        color: isIncoming || activity.direction === ActivityDirection.SelfTransaction ? 'blue-700' : '',
    }

    function getSubjectLocale(_activity: TransactionActivity): string {
        const { isShimmerClaiming, subject } = _activity
        if (isShimmerClaiming) {
            return localize('general.shimmerGenesis')
        }
        if (subject?.type === 'account') {
            return truncateString(subject?.account?.name, 13, 0)
        }
        if (subject?.type === 'address') {
            const address = activity.parsedLayer2Metadata?.ethereumAddress ?? subject?.address
            const hrpLength = activity.parsedLayer2Metadata ? '0x'.length : $networkHrp.length
            return truncateString(address, hrpLength, 6)
        }
        return localize('general.unknownAddress')
    }
</script>

<ActivityTileContent {title} {subtitle} {rightText}>
    <AssetIcon slot="icon" {asset} showVerifiedBadgeOnly />
</ActivityTileContent>

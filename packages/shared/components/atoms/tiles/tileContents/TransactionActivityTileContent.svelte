<script lang="ts">
    import { localize } from '@core/i18n'
    import { truncateString } from '@core/utils'
    import {
        ActivityDirection,
        getActivityTileTitle,
        getAssetFromPersistedAssets,
        getFormattedAmountFromActivity,
        IPersistedAsset,
        selectedAccountAssets,
        TransactionActivity,
    } from '@core/wallet'
    import { ActivityTileContent, AssetIcon } from 'shared/components'

    export let activity: TransactionActivity

    let asset: IPersistedAsset
    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(activity.assetId))
    $: action = localize(getActivityTileTitle(activity))
    $: subject =
        activity.direction === ActivityDirection.SelfTransaction
            ? localize('general.internalTransaction')
            : localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
                  values: { account: getSubjectLocale(activity) },
              })

    $: amount = getFormattedAmountFromActivity(activity)
    $: isIncoming = activity.direction === ActivityDirection.Incoming
    $: formattedAsset = {
        text: amount,
        color: isIncoming || activity.direction === ActivityDirection.SelfTransaction ? 'blue-700' : '',
        classes: 'flex-shrink-0',
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
            return truncateString(address, 6, 6)
        }
        return localize('general.unknownAddress')
    }
</script>

<ActivityTileContent {action} {subject} {formattedAsset}>
    <AssetIcon slot="icon" {asset} showVerifiedBadgeOnly />
</ActivityTileContent>

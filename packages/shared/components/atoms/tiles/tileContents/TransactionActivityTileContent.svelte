<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        ActivityDirection,
        getActivityTileTitle,
        getAssetFromPersistedAssets,
        getFormattedAmountFromActivity,
        getSubjectLocaleFromActivity,
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
                  values: { account: getSubjectLocaleFromActivity(activity) },
              })

    $: amount = getFormattedAmountFromActivity(activity)
    $: isIncoming = activity.direction === ActivityDirection.Incoming
    $: formattedAsset = {
        text: amount,
        color: isIncoming || activity.direction === ActivityDirection.SelfTransaction ? 'blue-700' : '',
        classes: 'flex-shrink-0',
    }
</script>

<ActivityTileContent {action} {subject} {formattedAsset}>
    <AssetIcon slot="icon" {asset} />
</ActivityTileContent>

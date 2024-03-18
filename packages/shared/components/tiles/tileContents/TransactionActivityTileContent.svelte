<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        ActivityDirection,
        getAssetFromPersistedAssets,
        getFormattedAmountFromActivity,
        IPersistedAsset,
        selectedWalletAssets,
        ActivityTransaction,
    } from '@core/wallet'
    import { ActivityTileContent, AssetIcon } from '@ui'

    export let activity: ActivityTransaction

    let asset: IPersistedAsset
    $: $selectedWalletAssets, (asset = getAssetFromPersistedAssets(activity.assetId()))
    $: action = localize(activity.tileTitle())
    $: subject =
        activity.direction() === ActivityDirection.SelfTransaction
            ? localize('general.internalTransaction')
            : localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
                  values: { account: activity.subjectLocale() },
              })

    $: amount = getFormattedAmountFromActivity(activity)
    $: isIncoming = activity.direction() === ActivityDirection.Incoming
    $: formattedAsset = {
        text: amount,
        color: isIncoming || activity.direction() === ActivityDirection.SelfTransaction ? 'blue-700' : '',
        classes: 'shrink-0',
    }
</script>

{#if asset}
    <ActivityTileContent {action} {subject} {formattedAsset}>
        <AssetIcon slot="icon" {asset} />
    </ActivityTileContent>
{/if}

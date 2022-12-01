<script lang="typescript">
    import { AmountBox, SubjectBox, TransactionActivityStatusPill } from 'shared/components'
    import { formatTokenAmountDefault, getAssetFromPersistedAssets } from '@core/wallet'
    import { FoundryActivity } from '@core/wallet'

    export let activity: FoundryActivity

    $: asset = getAssetFromPersistedAssets(activity.assetId)
    $: amount = formatTokenAmountDefault(Number(activity.rawAmount), asset?.metadata, asset?.metadata?.unit)
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    {#if amount}
        <AmountBox {amount} unit={asset?.metadata?.unit} {asset} />
    {/if}
    <foundry-status class="flex flex-row w-full space-x-2 justify-center">
        <TransactionActivityStatusPill
            inclusionState={activity.inclusionState}
            direction={activity.direction}
            isInternal={activity.isInternal}
            action={activity.action}
        />
    </foundry-status>
    {#if activity.subject}
        <SubjectBox subject={activity.subject} />
    {/if}
</main-content>

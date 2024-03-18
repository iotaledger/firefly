<script lang="ts">
    import { AmountBox, SubjectBox, TransactionActivityStatusPill } from '@ui'
    import { getAssetFromPersistedAssets } from '@core/wallet'
    import { ActivityFoundry } from '@core/wallet'

    export let activity: ActivityFoundry

    $: asset = getAssetFromPersistedAssets(activity.assetId())
    $: amount = activity.rawAmount()
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    {#if amount}
        <AmountBox {amount} {asset} />
    {/if}
    <foundry-status class="flex flex-row w-full space-x-2 justify-center">
        <TransactionActivityStatusPill
            type={activity.type()}
            inclusionState={activity.inclusionState()}
            direction={activity.direction()}
            isInternal={activity.isInternal()}
            action={activity.action()}
        />
    </foundry-status>
    {#if activity?.subject}
        <SubjectBox subject={activity.subject()} />
    {/if}
</main-content>

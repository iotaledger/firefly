<script lang="typescript">
    import {
        TransactionActivityStatusPill,
        ActivityAsyncStatusPill,
        Pill,
        AmountBox,
        SubjectBox,
    } from 'shared/components'
    import { localize } from '@core/i18n'
    import { formatTokenAmountDefault, TransactionActivity, getAssetFromPersistedAssets } from '@core/wallet'
    import { time } from '@core/app'

    export let activity: TransactionActivity
    export let networkAddress: string = null

    $: asset = getAssetFromPersistedAssets(activity.assetId)
    $: amount = formatTokenAmountDefault(Number(activity.rawAmount), asset?.metadata, asset?.metadata?.unit)
    $: isTimelocked = activity.asyncData?.timelockDate > $time
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    {#if amount}
        <AmountBox {amount} unit={asset?.metadata?.unit} {asset} />
    {/if}
    <transaction-status class="flex flex-row w-full space-x-2 justify-center">
        {#if activity.inclusionState && activity.direction}
            <TransactionActivityStatusPill
                type={activity.type}
                direction={activity.direction}
                isInternal={activity.isInternal}
                inclusionState={activity.inclusionState}
            />
        {/if}
        {#if activity.asyncData?.asyncStatus}
            <ActivityAsyncStatusPill asyncStatus={activity.asyncData.asyncStatus} />
        {/if}
        {#if isTimelocked}
            <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                {localize('pills.locked')}
            </Pill>
        {/if}
        {#if networkAddress}
            <Pill backgroundColor="blue-200" darkBackgroundColor="blue-200">
                {localize('pills.smartContractCall')}
            </Pill>
        {/if}
    </transaction-status>
    {#if activity.subject}
        <SubjectBox subject={activity.subject} />
    {/if}
</main-content>

<script lang="ts">
    import { TransactionActivityStatusPill, ActivityAsyncStatusPill, Pill, AmountBox, SubjectBox } from '@ui'
    import { localize } from '@core/i18n'
    import {
        TransactionActivity,
        getAssetFromPersistedAssets,
        ActivityAsyncStatus,
        getUnitFromTokenMetadata,
        VestingActivity,
    } from '@core/wallet'
    import { time } from '@core/app'
    import { getSubjectFromActivity } from '@core/wallet/utils/generateActivity/helper'

    export let activity: TransactionActivity | VestingActivity
    export let unit: string | undefined = undefined

    $: asset = getAssetFromPersistedAssets(activity.assetId)
    $: amount = activity?.rawAmount
    $: isTimelocked = activity.asyncData?.timelockDate > $time
    $: subject = getSubjectFromActivity(activity)
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    {#if amount}
        <AmountBox
            {amount}
            {asset}
            unit={unit ?? (asset?.metadata ? getUnitFromTokenMetadata(asset?.metadata) : undefined)}
        />
    {/if}
    <transaction-status class="flex flex-row w-full space-x-2 justify-center">
        {#if activity.inclusionState && activity.direction}
            <TransactionActivityStatusPill
                type={activity.type}
                direction={activity.direction}
                action={activity.action}
                isInternal={activity.isInternal}
                inclusionState={activity.inclusionState}
            />
        {/if}
        {#if activity.asyncData?.asyncStatus && activity?.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked}
            <ActivityAsyncStatusPill asyncStatus={activity.asyncData.asyncStatus} />
        {/if}
        {#if isTimelocked}
            <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                {localize('pills.locked')}
            </Pill>
        {/if}
        {#if activity?.parsedLayer2Metadata}
            <Pill backgroundColor="blue-200" darkBackgroundColor="blue-200">
                {localize('pills.smartContract')}
            </Pill>
        {/if}
    </transaction-status>
    {#if activity?.subject}
        <SubjectBox {subject} />
    {/if}
</main-content>

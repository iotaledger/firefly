<script lang="ts">
    import { closePopup } from '@auxiliary/popup'
    import { selectedWalletId } from '@core/wallet/stores'
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts, ownedNfts, selectedNftId } from '@core/nfts'
    import { CollectiblesRoute, collectiblesRouter, DashboardRoute, dashboardRouter } from '@core/router'
    import { ActivityAsyncStatus, NftActivity } from '@core/wallet'
    import { getSubjectFromActivity } from '@core/wallet/utils/generateActivity/helper'
    import {
        ActivityAsyncStatusPill,
        FontWeight,
        NftImageOrIconBox,
        NftSize,
        Pill,
        SubjectBox,
        Text,
        TextType,
        TransactionActivityStatusPill,
    } from 'shared/components'
    import { tick } from 'svelte'

    export let activity: NftActivity

    $: nft = getNftByIdFromAllAccountNfts($selectedWalletId, activity.nftId)
    $: nftIsOwned = $ownedNfts.some((nft) => nft.id === activity.nftId)
    $: isTimelocked = activity?.asyncData?.timelockDate > $time
    $: subject = getSubjectFromActivity(activity)

    async function onClick(): Promise<void> {
        closePopup()
        $selectedNftId = activity.nftId
        $dashboardRouter.goTo(DashboardRoute.Collectibles)
        // ugly hack to make sure router routes correctly
        await tick()
        // ugly hack to avoid a crash when navigating very fast between gallery and details
        await tick()
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
    }
</script>

<nft-transaction-details class="w-full space-y-6 flex flex-auto flex-col shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3 overflow-hidden">
        <button
            on:click|preventDefault={onClick}
            disabled={!nftIsOwned}
            class="flex w-full items-start justify-center space-x-2 cursor-default"
            class:cursor-pointer={nftIsOwned}
        >
            <NftImageOrIconBox {nft} size={NftSize.Small} />
            <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="whitespace-normal text-left">
                {nft?.name}
            </Text>
        </button>
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            {#if activity?.inclusionState && activity?.direction}
                <TransactionActivityStatusPill
                    type={activity.type}
                    action={activity?.action}
                    direction={activity?.direction}
                    isInternal={activity?.isInternal}
                    inclusionState={activity?.inclusionState}
                />
            {/if}
            {#if activity?.asyncData?.asyncStatus && activity?.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked}
                <ActivityAsyncStatusPill asyncStatus={activity?.asyncData?.asyncStatus} />
            {/if}
            {#if isTimelocked}
                <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                    {localize('pills.locked')}
                </Pill>
            {/if}
        </transaction-status>
        {#if activity?.subject}
            <SubjectBox {subject} />
        {/if}
    </main-content>
</nft-transaction-details>

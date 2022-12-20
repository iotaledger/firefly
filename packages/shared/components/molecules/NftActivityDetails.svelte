<script lang="typescript">
    import { closePopup } from '@auxiliary/popup'
    import { selectedAccountIndex } from '@core/account/stores'
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts, selectedAccountNfts, selectedNftId } from '@core/nfts'
    import { CollectiblesRoute, collectiblesRouter, DashboardRoute, dashboardRouter } from '@core/router'
    import { NftActivity } from '@core/wallet'
    import {
        ActivityAsyncStatusPill,
        FontWeight,
        Pill,
        SubjectBox,
        Text,
        TextType,
        TransactionActivityStatusPill,
    } from 'shared/components'
    import NftImageOrIconBox from './NftImageOrIconBox.svelte'

    export let activity: NftActivity

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
    $: nftIsOwned = $selectedAccountNfts.some((nft) => nft.id === activity.nftId)
    $: isTimelocked = activity?.asyncData?.timelockDate > $time

    function handleClick(): void {
        $selectedNftId = activity.nftId
        $dashboardRouter.goTo(DashboardRoute.Collectibles)
        $collectiblesRouter.goTo(CollectiblesRoute.Details)
        closePopup()
    }
</script>

<nft-transaction-details class="w-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3 overflow-hidden">
        <!-- kraftjs: rerouting to detailsView sends to galleryView in some wallets -->
        <button
            on:click|preventDefault={handleClick}
            disabled={!nftIsOwned}
            class="flex w-max items-center justify-center space-x-2 cursor-{nftIsOwned ? 'pointer' : 'default'}"
        >
            <NftImageOrIconBox nftId={activity.nftId} size="small" />
            <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="whitespace-pre truncate">
                {nft?.name}
            </Text>
        </button>
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            {#if activity?.inclusionState && activity?.direction}
                <TransactionActivityStatusPill
                    action={activity?.action}
                    direction={activity?.direction}
                    isInternal={activity?.isInternal}
                    inclusionState={activity?.inclusionState}
                />
            {/if}
            {#if activity?.asyncData?.asyncStatus}
                <ActivityAsyncStatusPill asyncStatus={activity?.asyncData?.asyncStatus} />
            {/if}
            {#if isTimelocked}
                <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                    {localize('pills.locked')}
                </Pill>
            {/if}
        </transaction-status>
        {#if activity?.subject}
            <SubjectBox subject={activity?.subject} />
        {/if}
    </main-content>
</nft-transaction-details>

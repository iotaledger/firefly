<script lang="typescript">
    import { selectedAccountIndex } from '@core/account/stores'
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { NftActivity } from '@core/wallet'
    import {
        ActivityAsyncStatusPill,
        NftMedia,
        NftMediaSize,
        Pill,
        SubjectBox,
        TransactionActivityStatusPill,
        Text,
        FontWeight,
        TextType,
    } from 'shared/components'

    export let activity: NftActivity

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
    $: isTimelocked = activity?.asyncData?.timelockDate > $time
</script>

<nft-transaction-details class="w-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3 overflow-hidden">
        <nft-summary class="flex w-full items-center justify-center w-full space-x-2">
            {#if nft?.name}
                <NftMedia nftId={activity.nftId} classes="p-1 w-6 h-6 bg-gray-500 dark:bg-gray-500 rounded-md" />
                <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="whitespace-pre truncate">
                    {nft?.name}
                </Text>
            {:else}
                <NftMedia
                    nftId={activity.nftId}
                    size={NftMediaSize.Medium}
                    classes="p-1 w-20 h-20 bg-gray-500 dark:bg-gray-500 rounded-xl"
                />
            {/if}
        </nft-summary>
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

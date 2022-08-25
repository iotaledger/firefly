<script lang="typescript">
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import { networkHrp } from '@core/network'
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        claimActivity,
        rejectActivity,
        InclusionState,
        VerificationStatus,
        selectedAccountAssets,
        getAssetFromPersistedAssets,
        IPersistedAsset,
        ITransactionActivityData,
        getTimeDifference,
    } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { closePopup, openPopup } from '@lib/popup'
    import { ActivityAsyncStatusPill, ClickableTile, HR, Icon, Text, Spinner, AssetIcon, Pill } from 'shared/components'
    import { FontWeight } from 'shared/components/Text.svelte'

    export let activityId: string
    export let amount: string
    export let fiatAmount: string
    export let inclusionState: InclusionState
    export let data: ITransactionActivityData

    let asset: IPersistedAsset

    $: data.assetId, $selectedAccountAssets, (asset = getAssetFromPersistedAssets(data.assetId))
    $: isIncomingActivityUnclaimed =
        (data.direction === ActivityDirection.In || data.isSelfTransaction) &&
        data.asyncStatus === ActivityAsyncStatus.Unclaimed
    $: isTimelocked = data.timelockDate > $time

    let timeDiff: string
    $: if (isTimelocked) {
        timeDiff = getTimeDifference(data.timelockDate, $time)
    } else if (data.isAsync && !data.isClaimed && data?.expirationDate) {
        timeDiff = getTimeDifference(data.expirationDate, $time)
    } else {
        timeDiff = localize('general.none')
    }

    let title: string
    $: if (data.isInternal) {
        title = inclusionState === InclusionState.Confirmed ? 'general.transfer' : 'general.transferring'
    } else {
        if (data.direction === ActivityDirection.In) {
            title = inclusionState === InclusionState.Confirmed ? 'general.received' : 'general.receiving'
        } else if (data.direction === ActivityDirection.Out) {
            title = inclusionState === InclusionState.Confirmed ? 'general.sent' : 'general.sending'
        }
    }

    let subject: string
    $: if (data.subject?.type === 'account') {
        subject = truncateString(data.subject?.account?.name, 13, 0)
    } else if (data.subject?.type === 'address') {
        subject = truncateString(data.subject?.address, $networkHrp.length, 6)
    } else {
        subject = localize('general.unknownAddress')
    }

    function handleTransactionClick(): void {
        if (asset?.verification === VerificationStatus.New) {
            openPopup({
                type: 'tokenInformation',
                overflow: true,
                props: {
                    activityId,
                    asset,
                },
            })
        } else {
            openPopup({
                type: 'activityDetails',
                props: { activityId },
            })
        }
    }

    function handleRejectClick(): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('actions.confirmRejection.title'),
                description: localize('actions.confirmRejection.description'),
                hint: localize('actions.confirmRejection.node'),
                warning: true,
                confirmText: localize('actions.reject'),
                onConfirm: () => {
                    rejectActivity(activityId)
                    closePopup()
                },
            },
        })
    }

    function handleClaimClick(): void {
        claimActivity(activityId, data)
    }
</script>

<ClickableTile
    onClick={handleTransactionClick}
    classes={inclusionState !== InclusionState.Confirmed ? 'opacity-50' : ''}
>
    <div class="w-full flex flex-col space-y-4">
        <div class="flex flex-row items-center text-left space-x-4">
            <AssetIcon {asset} showVerifiedBadgeOnly />
            <div class="flex flex-col w-full space-y-0.5">
                <div class="flex flex-row justify-between space-x-1">
                    <Text
                        fontWeight={FontWeight.semibold}
                        lineHeight="140"
                        classes="overflow-hidden overflow-ellipsis multiwrap-line2"
                    >
                        {localize(title)}
                    </Text>
                    <Text
                        fontWeight={FontWeight.semibold}
                        lineHeight="140"
                        color={data.direction === ActivityDirection.In ? 'blue-700' : ''}
                        classes="whitespace-nowrap"
                    >
                        {amount}
                    </Text>
                </div>

                <div class="flex flex-row justify-between">
                    <Text fontWeight={FontWeight.normal} lineHeight="140" color="gray-600">
                        {localize(
                            data.direction === ActivityDirection.In ? 'general.fromAddress' : 'general.toAddress',
                            { values: { account: subject } }
                        )}
                    </Text>
                    <Text fontWeight={FontWeight.normal} lineHeight="140" color="gray-600" classes="whitespace-nowrap">
                        {fiatAmount}
                    </Text>
                </div>
            </div>
        </div>
        {#if isTimelocked || (data.isAsync && (data.direction === ActivityDirection.Out || !data.isClaimed))}
            <HR />
            <div class="flex w-full justify-between space-x-4">
                <div class="flex flex-row justify-center items-center space-x-2">
                    {#if !data.isClaimed || isTimelocked}
                        <Icon width="16" height="16" icon="timer" classes="text-gray-600" />
                        <Text fontSize="13" color="gray-600" fontWeight={FontWeight.semibold}>{timeDiff}</Text>
                    {/if}
                </div>
                <div class="flex flex-row justify-end w-1/2 space-x-2">
                    {#if isTimelocked}
                        <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                            {localize('pills.locked')}
                        </Pill>
                    {:else if isIncomingActivityUnclaimed}
                        <button
                            disabled={data.isClaiming || data.isRejected}
                            class="action px-3 py-1 w-1/2 text-center rounded-4 font-normal text-14 text-blue-500 bg-transparent 
                            {data.isClaiming || data.isRejected
                                ? 'cursor-default text-gray-500'
                                : 'cursor-pointer hover:bg-blue-200'}"
                            on:click|stopPropagation={handleRejectClick}
                        >
                            {localize('actions.reject')}
                        </button>
                        <button
                            class="action px-3 py-1 w-1/2 h-8 text-center rounded-4 font-normal text-14 text-white bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400"
                            on:click|stopPropagation={handleClaimClick}
                        >
                            {#if data.isClaiming}
                                <Spinner busy={true} classes="justify-center h-fit" />
                            {:else}
                                {localize('actions.claim')}
                            {/if}
                        </button>
                    {:else}
                        <ActivityAsyncStatusPill asyncStatus={data.asyncStatus} />
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</ClickableTile>

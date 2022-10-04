<script lang="typescript">
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import { showInternalVerificationPopup } from '@core/ledger'
    import { networkHrp } from '@core/network'
    import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        claimActivity,
        getAssetFromPersistedAssets,
        getTimeDifference,
        InclusionState,
        IPersistedAsset,
        ITransactionActivityData,
        NotVerifiedStatus,
        rejectActivity,
        selectedAccountAssets,
        Subject,
    } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { closePopup, openPopup } from '@lib/popup'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import {
        ActivityAsyncStatusPill,
        ClickableTile,
        HR,
        TooltipIcon,
        Text,
        AssetIcon,
        Pill,
        Button,
        FontWeight,
    } from 'shared/components'
    import { Position } from 'shared/components/Tooltip.svelte'
    import { ButtonSize } from 'shared/components/Button.svelte'

    export let activityId: string
    export let amount: string
    export let fiatAmount: string
    export let inclusionState: InclusionState
    export let data: ITransactionActivityData

    let asset: IPersistedAsset
    let asyncStatusTooltipText: string

    $: title = getTitle(data, inclusionState)
    $: subjectLocale = getSubjectLocale(data.subject, data.isShimmerClaiming)
    $: timeDiff = getTimeDiff(data)
    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(data.assetId))

    $: isUnclaimed = data.asyncStatus === ActivityAsyncStatus.Unclaimed
    $: isTimelocked = data.asyncStatus === ActivityAsyncStatus.Timelocked
    $: isIncoming = data.direction === ActivityDirection.In
    $: isIncomingActivityUnclaimed = (isIncoming || data.isSelfTransaction) && isUnclaimed
    $: isAsyncActivity = isTimelocked || (data.isAsync && (data.direction === ActivityDirection.Out || isUnclaimed))
    $: {
        if (isUnclaimed || isTimelocked) {
            const activityDirectionKey = isIncoming ? 'incoming' : 'outgoing'
            const activityAsyncStatusKey = isUnclaimed ? 'expirationTime' : 'timelockDate'
            const textKey = `tooltips.transactionDetails.${activityDirectionKey}.${activityAsyncStatusKey}`
            asyncStatusTooltipText = localize(textKey)
        }
    }

    function getTimeDiff(txData: ITransactionActivityData): string {
        const { asyncStatus, isAsync, isClaimed, expirationDate, timelockDate } = txData

        if (asyncStatus === ActivityAsyncStatus.Timelocked) {
            return getTimeDifference(timelockDate, $time)
        }
        if (isAsync && !isClaimed && expirationDate) {
            return getTimeDifference(expirationDate, $time)
        }
        return localize('general.none')
    }

    function getTitle(txData: ITransactionActivityData, inclusionState: InclusionState): string {
        const { isShimmerClaiming, isInternal, direction } = txData
        const isInclusionStateConfirmed = inclusionState === InclusionState.Confirmed

        if (isShimmerClaiming) {
            return isInclusionStateConfirmed ? 'general.shimmerClaimed' : 'general.shimmerClaiming'
        }
        if (isInternal) {
            return isInclusionStateConfirmed ? 'general.transfer' : 'general.transferring'
        }
        if (direction === ActivityDirection.In) {
            return isInclusionStateConfirmed ? 'general.received' : 'general.receiving'
        }
        if (direction === ActivityDirection.Out) {
            return isInclusionStateConfirmed ? 'general.sent' : 'general.sending'
        }
    }

    function getSubjectLocale(subject: Subject, isShimmerClaiming: boolean): string {
        if (isShimmerClaiming) {
            return localize('general.shimmerGenesis')
        }
        if (subject?.type === 'account') {
            return truncateString(subject?.account?.name, 13, 0)
        }
        if (subject?.type === 'address') {
            return truncateString(subject?.address, $networkHrp.length, 6)
        }
        return localize('general.unknownAddress')
    }

    function handleTransactionClick(): void {
        if (asset?.verification?.status === NotVerifiedStatus.New) {
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
        if ($isActiveLedgerProfile) {
            $showInternalVerificationPopup = true
        }
        checkActiveProfileAuth(() => claimActivity(activityId, data))
    }
</script>

<ClickableTile
    onClick={handleTransactionClick}
    classes={inclusionState === InclusionState.Confirmed ? '' : 'opacity-50'}
>
    <activity-tile class="w-full flex flex-col space-y-4">
        <info-container class="flex flex-row items-center text-left space-x-4">
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
                        color={isIncoming ? 'blue-700' : ''}
                        classes="whitespace-nowrap"
                    >
                        {amount}
                    </Text>
                </div>
                <div class="flex flex-row justify-between">
                    <Text fontWeight={FontWeight.medium} lineHeight="140" color="gray-600">
                        {localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
                            values: { account: subjectLocale },
                        })}
                    </Text>
                    <Text fontWeight={FontWeight.medium} lineHeight="140" color="gray-600" classes="whitespace-nowrap">
                        {fiatAmount}
                    </Text>
                </div>
            </div>
        </info-container>
        {#if isAsyncActivity}
            <HR />
            <async-activity-container class="flex w-full justify-between space-x-4">
                <info-container class="flex flex-row justify-center items-center space-x-2">
                    {#if isUnclaimed || isTimelocked}
                        <TooltipIcon
                            icon={isTimelocked ? IconEnum.Timelock : IconEnum.ExpirationTime}
                            iconClasses="text-gray-600 dark:text-gray-200"
                            title={localize(`general.${isUnclaimed ? 'expirationTime' : 'timelockDate'}`)}
                            text={asyncStatusTooltipText}
                            position={Position.Top}
                        />
                        <Text fontSize="13" color="gray-600" fontWeight={FontWeight.semibold}>{timeDiff}</Text>
                    {/if}
                </info-container>
                <claim-container class="flex flex-row justify-end w-1/2 space-x-2">
                    {#if isTimelocked}
                        <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                            {localize('pills.locked')}
                        </Pill>
                    {:else if isIncomingActivityUnclaimed}
                        <Button
                            onClick={handleRejectClick}
                            disabled={data.isClaiming || data.isRejected}
                            inlineStyle="min-width: 4rem;"
                            size={ButtonSize.Small}
                            outline
                        >
                            {localize('actions.reject')}
                        </Button>
                        <Button
                            onClick={handleClaimClick}
                            disabled={data.isClaiming}
                            isBusy={data.isClaiming}
                            inlineStyle="min-width: 4rem;"
                            size={ButtonSize.Small}
                        >
                            {localize('actions.claim')}
                        </Button>
                    {:else}
                        <ActivityAsyncStatusPill asyncStatus={data.asyncStatus} />
                    {/if}
                </claim-container>
            </async-activity-container>
        {/if}
    </activity-tile>
</ClickableTile>

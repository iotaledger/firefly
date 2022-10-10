<script lang="typescript">
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        ITransactionActivityData,
        claimActivity,
        rejectActivity,
        getTimeDifference,
    } from '@core/wallet'
    import {
        ActivityAsyncStatusPill,
        TooltipIcon,
        Text,
        Button,
        TileFooter,
        FontWeight,
        ButtonSize,
    } from 'shared/components'
    import { time } from '@core/app'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Position } from 'shared/components/Tooltip.svelte'
    import { localize } from '@core/i18n'
    import { showInternalVerificationPopup } from '@core/ledger'
    import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import { closePopup, openPopup } from '@lib/popup'

    export let activityId: string
    export let data: ITransactionActivityData

    $: shouldShowActions =
        data.direction === ActivityDirection.Incoming && data.asyncStatus === ActivityAsyncStatus.Unclaimed
    $: shouldShowAsyncFooter = data.asyncStatus !== ActivityAsyncStatus.Claimed

    $: timeDiff = getTimeDiff(data)

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
</script>

{#if shouldShowAsyncFooter}
    <TileFooter>
        <svelte:fragment slot="left">
            <TooltipIcon
                icon={IconEnum.ExpirationTime}
                iconClasses="text-gray-600 dark:text-gray-200"
                title={localize('general.expirationTime')}
                text={localize(`tooltips.transactionDetails.${data.direction}.expirationTime`)}
                position={Position.Top}
            />
            <Text fontSize="13" color="gray-600" fontWeight={FontWeight.semibold}>{timeDiff}</Text>
        </svelte:fragment>
        <svelte:fragment slot="right">
            {#if shouldShowActions}
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
        </svelte:fragment>
    </TileFooter>
{/if}

<script lang="typescript">
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        ITransactionActivityData,
        claimActivity,
        rejectActivity,
        getTimeDifference,
    } from '@core/wallet'
    import { ActivityAsyncStatusPill, TooltipIcon, Text, Pill, Button, HR } from 'shared/components'
    import { time } from '@core/app'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Position } from 'shared/components/Tooltip.svelte'
    import { ButtonSize } from 'shared/components/Button.svelte'
    import { localize } from '@core/i18n'
    import { showInternalVerificationPopup } from '@core/ledger'
    import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import { closePopup, openPopup } from '@lib/popup'
    import { FontWeight } from 'shared/components/Text.svelte'

    export let activityId: string
    export let data: ITransactionActivityData

    let asyncStatusTooltipText: string
    $: timeDiff = getTimeDiff(data)

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

{#if isAsyncActivity}
    <HR />
    <async-activity-actions class="flex w-full justify-between space-x-4">
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
    </async-activity-actions>
{/if}

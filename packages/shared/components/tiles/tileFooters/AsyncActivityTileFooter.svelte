<script lang="ts">
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        claimActivity,
        rejectActivity,
        getTimeDifference,
        Activity,
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
    import { Position } from 'shared/components/enums'
    import { localize } from '@core/i18n'
    import { showInternalVerificationPopup } from '@core/ledger'
    import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'

    export let activity: Activity

    $: shouldShowActions =
        (activity.direction === ActivityDirection.Incoming ||
            activity.direction === ActivityDirection.SelfTransaction) &&
        activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed

    $: timeDiff = getTimeDiff(activity)
    $: hasExpirationTime = !!activity.asyncData?.expirationDate

    function onRejectClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.confirmRejection.title'),
                description: localize('actions.confirmRejection.description'),
                hint: localize('actions.confirmRejection.node'),
                warning: true,
                confirmText: localize('actions.reject'),
                onConfirm: () => {
                    rejectActivity(activity.id)
                    closePopup()
                },
            },
        })
    }

    function onClaimClick(): void {
        if ($isActiveLedgerProfile) {
            $showInternalVerificationPopup = true
        }
        checkActiveProfileAuth(() => claimActivity(activity))
    }

    function getTimeDiff(activity: Activity): string {
        if (activity.asyncData) {
            const { asyncStatus, expirationDate, timelockDate } = activity.asyncData
            if (asyncStatus === ActivityAsyncStatus.Timelocked) {
                return getTimeDifference(timelockDate, $time)
            }
            if (asyncStatus !== ActivityAsyncStatus.Claimed && expirationDate) {
                return getTimeDifference(expirationDate, $time)
            }
        }
        return undefined
    }
</script>

<TileFooter>
    <svelte:fragment slot="left">
        {#if timeDiff}
            <TooltipIcon
                icon={hasExpirationTime ? IconEnum.ExpirationTime : IconEnum.Timelock}
                iconClasses="text-gray-600 dark:text-gray-200"
                title={localize(`general.${hasExpirationTime ? 'expirationTime' : 'timelockDate'}`)}
                text={localize(
                    `tooltips.transactionDetails.${activity.direction}.${
                        hasExpirationTime ? 'expirationTime' : 'timelockDate'
                    }`
                )}
                position={Position.Top}
            />
            <Text fontSize="13" color="gray-600" fontWeight={FontWeight.semibold}>{timeDiff}</Text>
        {/if}
    </svelte:fragment>
    <svelte:fragment slot="right">
        {#if shouldShowActions}
            <Button
                onClick={onRejectClick}
                disabled={activity.asyncData?.isClaiming || activity.asyncData?.isRejected}
                inlineStyle="min-width: 4rem;"
                size={ButtonSize.Small}
                outline
            >
                {localize('actions.reject')}
            </Button>
            <Button
                onClick={onClaimClick}
                disabled={activity.asyncData?.isClaiming}
                isBusy={activity.asyncData?.isClaiming}
                inlineStyle="min-width: 4rem;"
                size={ButtonSize.Small}
            >
                {localize('actions.claim')}
            </Button>
        {:else}
            <ActivityAsyncStatusPill asyncStatus={activity.asyncData?.asyncStatus} />
        {/if}
    </svelte:fragment>
</TileFooter>

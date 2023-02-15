<script lang="ts">
    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import {
        Activity,
        ActivityAsyncStatus,
        ActivityDirection,
        ActivityType,
        claimActivity,
        rejectActivity,
    } from '@core/wallet'
    import features from '@features/features'
    import {
        ActivityInformation,
        AliasActivityDetails,
        BasicActivityDetails,
        Button,
        FoundryActivityDetails,
        NftActivityDetails,
    } from 'shared/components'
    import { closeDrawer, DrawerId, openDrawer } from '../../lib/auxiliary/drawer'

    export let activity: Activity | undefined

    $: isTimelocked = activity.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked
    $: isActivityIncomingAndUnclaimed =
        activity.asyncData &&
        (activity.direction === ActivityDirection.Incoming ||
            activity.direction === ActivityDirection.SelfTransaction) &&
        activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed

    function onReject(): void {
        const _onConfirm = (): void => {
            rejectActivity(activity.id)
            closeDrawer(DrawerId.Confirm)
        }
        openDrawer(DrawerId.Confirm, {
            title: localize('actions.confirmRejection.title'),
            description: localize('actions.confirmRejection.description'),
            hint: localize('actions.confirmRejection.node'),
            info: true,
            confirmText: localize('actions.reject'),
            warning: true,
            onConfirm: _onConfirm,
        })
    }
    async function onClaim(): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        if (isUnlocked) {
            claimActivity(activity)
        } else {
            const _onSuccess = async (): Promise<void> => {
                await onClaim()
                closeDrawer(DrawerId.EnterPassword)
            }
            openDrawer(DrawerId.EnterPassword, { onSuccess: _onSuccess })
        }
    }
</script>

<activity-details class="flex flex-col justify-between h-full space-y-10">
    <activity-content class="flex flex-col space-y-8">
        {#if activity?.type === ActivityType.Basic}
            <BasicActivityDetails {activity} />
        {:else if activity.type === ActivityType.Foundry}
            <FoundryActivityDetails {activity} />
        {:else if activity.type === ActivityType.Nft}
            <NftActivityDetails {activity} />
        {:else if activity.type === ActivityType.Alias}
            <AliasActivityDetails {activity} />
        {/if}
        <ActivityInformation {activity} />
    </activity-content>
    {#if !isTimelocked && isActivityIncomingAndUnclaimed && features.dashboard.activity.actions.enabled}
        <activity-actions class="space-y-4">
            <Button
                classes="w-full"
                disabled={activity.asyncData?.isClaiming}
                onClick={onClaim}
                isBusy={activity.asyncData?.isClaiming}
            >
                {localize('actions.claim')}
            </Button>
            <Button
                outline
                classes="w-full"
                disabled={activity.asyncData?.isClaiming || activity.asyncData?.isRejected}
                onClick={onReject}
            >
                {localize('actions.reject')}
            </Button>
        </activity-actions>
    {/if}
</activity-details>

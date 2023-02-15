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

    $: isActivityIncomingAndUnclaimed =
        activity &&
        activity.asyncData &&
        (activity?.direction === ActivityDirection.Incoming ||
            activity?.direction === ActivityDirection.SelfTransaction) &&
        activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed
    $: shouldShowActions =
        isActivityIncomingAndUnclaimed &&
        activity.asyncData?.asyncStatus !== ActivityAsyncStatus.Timelocked &&
        features.dashboard.activity.actions.enabled

    function onReject(): void {
        const onRejectConfirm = (): void => {
            rejectActivity(activity.id)
            closeRejectDrawer()
        }
        const closeRejectDrawer = (): void => {
            closeDrawer(DrawerId.Confirm)
        }
        openDrawer(DrawerId.Confirm, { onConfirm: onRejectConfirm, onCancel: closeRejectDrawer })
    }
    async function onClaim(): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        if (isUnlocked) {
            claimActivity(activity)
        } else {
            const onSuccess = async (): Promise<void> => {
                await onClaim()
                closeConfirmPasswordDrawer()
            }
            const closeConfirmPasswordDrawer = (): void => {
                closeDrawer(DrawerId.EnterPassword)
            }
            openDrawer(DrawerId.EnterPassword, { onSuccess, onCancel: closeConfirmPasswordDrawer })
        }
    }
</script>

<activity-details class="flex flex-col justify-between h-full pt-10">
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
    {#if shouldShowActions}
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

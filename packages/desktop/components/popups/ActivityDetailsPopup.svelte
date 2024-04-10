<script lang="ts">
    import { PopupId, closePopup, openPopup } from '@auxiliary/popup'
    import { openUrlInBrowser } from '@core/app'
    import { localize } from '@core/i18n'
    import { ExplorerEndpoint, ITransactionInfoToCalculateManaCost } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { activeProfile, checkActiveProfileAuth } from '@core/profile'
    import { setClipboard, truncateString } from '@core/utils'
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        ActivityType,
        claimActivity,
        hasWalletMainAccountNegativeBIC,
        ignoreActivity,
        selectedWallet,
        selectedWalletActivities,
    } from '@core/wallet'
    import {
        ActivityInformation,
        AccountActivityDetails,
        BasicActivityDetails,
        Button,
        ConsolidationActivityDetails,
        FontWeight,
        FoundryActivityDetails,
        GovernanceActivityDetails,
        NftActivityDetails,
        Text,
        TextType,
        DelegationActivityDetails,
        TextHint,
    } from '@ui'
    import { TextHintVariant } from '@ui/enums'
    import { onMount } from 'svelte'
    import { ManaBox } from '@components'

    export let activityId: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.network?.id)

    const transactionInfo: ITransactionInfoToCalculateManaCost = {}
    let hasEnoughMana = false

    $: activity = $selectedWalletActivities?.find((_activity) => _activity.id === activityId)
    $: isTimelocked = activity?.asyncData?.asyncStatus === ActivityAsyncStatus.Timelocked
    $: isActivityIncomingAndUnclaimed =
        activity?.asyncData &&
        (activity?.direction === ActivityDirection.Incoming ||
            activity?.direction === ActivityDirection.SelfTransaction) &&
        activity?.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed

    $: hasMainAccountNegativeBIC = hasWalletMainAccountNegativeBIC($selectedWallet)

    function onExplorerClick(): void {
        let url: string
        if (activity?.type === ActivityType.Vesting) {
            url = `${explorerUrl}/${ExplorerEndpoint.Output}/${activity?.outputId}`
        } else {
            url = `${explorerUrl}/${ExplorerEndpoint.Transaction}/${activity?.transactionId}`
        }
        openUrlInBrowser(url)
    }

    function onTransactionIdClick(): void {
        setClipboard(activity?.transactionId)
    }

    async function claim(): Promise<void> {
        await claimActivity(activity)
        openPopup({
            id: PopupId.ActivityDetails,
            props: { activityId },
        })
    }

    async function onClaimClick(): Promise<void> {
        await checkActiveProfileAuth(claim, { stronghold: true, ledger: false })
    }

    async function prepareClaimOutput(): Promise<void> {
        try {
            transactionInfo.preparedTransaction = await $selectedWallet?.prepareClaimOutputs([activity.outputId])
        } catch (error) {
            transactionInfo.preparedTransactionError = error
        }
    }

    function onIgnoreClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.confirmIgnore.title'),
                description: localize('actions.confirmIgnore.description'),
                hint: localize('actions.confirmIgnore.node'),
                confirmText: localize('actions.ignore'),
                variant: TextHintVariant.Warning,
                onConfirm: () => {
                    ignoreActivity(activityId)
                    closePopup()
                },
                onCancel: () =>
                    openPopup({
                        id: PopupId.ActivityDetails,
                        props: { activityId },
                    }),
            },
        })
    }

    onMount(async () => {
        try {
            await _onMount()
            if (!isTimelocked && isActivityIncomingAndUnclaimed) {
                await prepareClaimOutput()
            }
        } catch (err) {
            console.error(err)
        }
    })
</script>

{#if activity}
    <activity-details-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
        <div class="flex flex-col">
            <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
                {localize('popups.transactionDetails.title')}
            </Text>
            {#if explorerUrl && activity.transactionId}
                <button
                    class="action w-max flex justify-start text-center font-medium text-14 text-blue-500"
                    on:click={onExplorerClick}
                >
                    {localize('general.viewOnExplorer')}
                </button>
            {:else if activity.transactionId}
                <button
                    class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
                    on:click={onTransactionIdClick}
                >
                    {truncateString(activity.transactionId, 12, 12)}
                </button>
            {/if}
        </div>
        <activity-details class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
            {#if activity.type === ActivityType.Basic || activity.type === ActivityType.Vesting}
                <BasicActivityDetails {activity} />
            {:else if activity.type === ActivityType.Foundry}
                <FoundryActivityDetails {activity} />
            {:else if activity.type === ActivityType.Governance}
                <GovernanceActivityDetails {activity} />
            {:else if activity.type === ActivityType.Consolidation}
                <ConsolidationActivityDetails {activity} />
            {:else if activity.type === ActivityType.Nft}
                <NftActivityDetails {activity} />
            {:else if activity.type === ActivityType.Account}
                <AccountActivityDetails {activity} />
            {:else if activity.type === ActivityType.Delegation}
                <DelegationActivityDetails {activity} />
            {/if}
            <ActivityInformation {activity} />
        </activity-details>
        {#if !isTimelocked && isActivityIncomingAndUnclaimed}
            <div class="flex flex-col space-y-4">
                <ManaBox {transactionInfo} bind:hasEnoughMana />
                {#if hasMainAccountNegativeBIC}
                    <TextHint variant={TextHintVariant.Danger} text={localize('popups.transaction.negativeBIC')} />
                {/if}
                <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
                    <Button
                        outline
                        classes="w-full"
                        disabled={activity.asyncData?.isClaiming || activity.asyncData?.isIgnored}
                        onClick={onIgnoreClick}
                    >
                        {localize('actions.ignore')}
                    </Button>
                    <Button
                        classes="w-full"
                        disabled={activity.asyncData?.isClaiming || !hasEnoughMana || hasMainAccountNegativeBIC}
                        onClick={onClaimClick}
                        isBusy={activity.asyncData?.isClaiming}
                    >
                        {localize('actions.claim')}
                    </Button>
                </popup-buttons>
            </div>
        {/if}
    </activity-details-popup>
{/if}

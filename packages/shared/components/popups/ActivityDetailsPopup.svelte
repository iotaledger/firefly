<script lang="typescript">
    import { Text, Button, FontWeight, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from 'shared/lib/platform'
    import { TransactionDetails, AliasDetails, FoundryDetails, NftDetails } from 'shared/components/molecules'
    import {
        ActivityAsyncStatus,
        ActivityDirection,
        ActivityType,
        claimActivity,
        getAssetFromPersistedAssets,
        rejectActivity,
        selectedAccountActivities,
        getFiatAmount,
    } from '@core/wallet'
    import { activeProfile, checkActiveProfileAuth } from '@core/profile'
    import { currencies, exchangeRates } from '@lib/currency'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { setClipboard } from '@core/utils'
    import { truncateString } from '@lib/helpers'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { onMount } from 'svelte'

    export let activityId: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: activity = $selectedAccountActivities.find((_activity) => _activity.id === activityId)
    $: asset = activity.type !== ActivityType.Nft ? getAssetFromPersistedAssets(activity.assetId) : undefined
    $: isTimelocked =
        activity.type === ActivityType.Transaction && activity.asyncStatus === ActivityAsyncStatus.Timelocked
    $: isActivityIncomingAndUnclaimed =
        activity.type === ActivityType.Transaction &&
        activity.isAsync &&
        (activity?.direction === ActivityDirection.Incoming || activity.isSelfTransaction) &&
        activity.asyncStatus === ActivityAsyncStatus.Unclaimed

    let details: Record<string, unknown>
    $: activity, (details = getActivityDetails())

    function getActivityDetails(): Record<string, unknown> {
        if (!activity) {
            return {}
        }
        const details = {
            transactionTime: activity.time,
            inclusionState: activity.inclusionState,
            formattedFiatValue: getFiatAmount(
                activity,
                $currencies[CurrencyTypes.USD],
                $exchangeRates[$activeProfile?.settings?.currency]
            ),
        }
        if (activity.type === ActivityType.Transaction) {
            return {
                ...details,
                type: activity.type,
                asset,
                storageDeposit: activity.storageDeposit,
                rawAmount: activity.rawAmount,
                unit: asset?.metadata?.unit,
                giftedStorageDeposit: activity.giftedStorageDeposit,
                asyncStatus: activity.asyncStatus,
                direction: activity.direction,
                isInternal: activity.isInternal,
                claimedDate: activity.claimedDate,
                claimingTransactionId: activity.claimingTransactionId,
                expirationDate: activity?.asyncStatus !== ActivityAsyncStatus.Claimed ? activity.expirationDate : null,
                timelockDate: activity.timelockDate,
                subject: activity?.subject,
                tag: activity?.tag,
                metadata: activity?.metadata,
            }
        } else if (activity.type === ActivityType.Foundry) {
            return {
                ...details,
                asset,
                storageDeposit: activity.storageDeposit,
                rawAmount: activity.rawAmount,
                unit: asset?.metadata?.unit,
                giftedStorageDeposit: activity.giftedStorageDeposit,
            }
        } else if (activity.type === ActivityType.Alias) {
            return {
                ...details,
                storageDeposit: activity.storageDeposit,
                aliasId: activity.aliasId,
                governorAddress: activity.governorAddress,
                stateControllerAddress: activity.stateControllerAddress,
            }
        } else if (activity.type === ActivityType.Nft) {
            return {
                ...details,
                type: activity.type,
                storageDeposit: activity.storageDeposit,
                metadata: activity.metadata,
                asyncStatus: activity.asyncStatus,
                direction: activity.direction,
                isInternal: activity.isInternal,
                claimedDate: activity.claimedDate,
                claimingTransactionId: activity.claimingTransactionId,
                expirationDate: activity?.asyncStatus !== ActivityAsyncStatus.Claimed ? activity.expirationDate : null,
                timelockDate: activity.timelockDate,
                subject: activity?.subject,
            }
        }
    }

    function handleExplorerClick(): void {
        Platform.openUrl(`${explorerUrl}/block/${activity.transactionId}`)
    }

    function handleTransactionIdClick(): void {
        setClipboard(activity.transactionId)
    }

    async function claim(): Promise<void> {
        if (activity.type === ActivityType.Transaction) {
            await claimActivity(activity)
            openPopup({
                type: 'activityDetails',
                props: { activityId },
            })
        }
    }

    async function onClaimClick(): Promise<void> {
        await checkActiveProfileAuth(claim, { stronghold: true, ledger: false })
    }

    function reject(): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('actions.confirmRejection.title'),
                description: localize('actions.confirmRejection.description'),
                hint: localize('actions.confirmRejection.node'),
                info: true,
                confirmText: localize('actions.reject'),
                warning: true,
                onConfirm: () => {
                    rejectActivity(activityId)
                    closePopup()
                },
                onCancel: () =>
                    openPopup({
                        type: 'activityDetails',
                        props: { activityId },
                    }),
            },
        })
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            console.error(err)
        }
    })
</script>

<activity-details-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <div class="flex flex-col">
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
            {localize('popups.transactionDetails.title')}
        </Text>
        {#if explorerUrl && activity.transactionId}
            <button
                class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
                on:click={handleExplorerClick}
            >
                {localize('general.viewOnExplorer')}
            </button>
        {:else if activity.transactionId}
            <button
                class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
                on:click={handleTransactionIdClick}
            >
                {truncateString(activity.transactionId, 12, 12)}
            </button>
        {/if}
    </div>
    {#if activity?.type === ActivityType.Transaction}
        <TransactionDetails {...details} />
    {:else if activity?.type === ActivityType.Foundry}
        <FoundryDetails {...details} />
    {:else if activity?.type === ActivityType.Alias}
        <AliasDetails {...details} />
    {:else if activity?.type === ActivityType.Nft}
        <NftDetails {...details} />
    {/if}
    {#if !isTimelocked && (activity.type === ActivityType.Transaction || activity.type === ActivityType.Nft) && isActivityIncomingAndUnclaimed}
        <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
            <Button outline classes="w-full" disabled={activity.isClaiming || activity.isRejected} onClick={reject}>
                {localize('actions.reject')}
            </Button>
            <Button classes="w-full" disabled={activity.isClaiming} onClick={onClaimClick} isBusy={activity.isClaiming}>
                {localize('actions.claim')}
            </Button>
        </popup-buttons>
    {/if}
</activity-details-popup>

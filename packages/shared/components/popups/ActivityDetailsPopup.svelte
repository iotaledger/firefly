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
    $: asset = activity.data.type !== ActivityType.Nft ? getAssetFromPersistedAssets(activity.data.assetId) : undefined
    $: isTimelocked =
        activity.data.type === ActivityType.Transaction && activity.data.asyncStatus === ActivityAsyncStatus.Timelocked
    $: isActivityIncomingAndUnclaimed =
        activity.data.type === ActivityType.Transaction &&
        activity.data.isAsync &&
        (activity?.data.direction === ActivityDirection.Incoming || activity.data.isSelfTransaction) &&
        activity.data.asyncStatus === ActivityAsyncStatus.Unclaimed

    let details
    $: activity, (details = getActivityDetails())

    function getActivityDetails(): void {
        if (!activity) {
            return {}
        }
        const details = {
            transactionTime: activity.time,
            inclusionState: activity.inclusionState,
            formattedFiatValue: activity.getFiatAmount(
                $currencies[CurrencyTypes.USD],
                $exchangeRates[$activeProfile?.settings?.currency]
            ),
        }
        if (activity.data.type === ActivityType.Transaction) {
            return {
                ...details,
                type: activity.type,
                asset,
                storageDeposit: activity.data.storageDeposit,
                rawAmount: activity.data.rawAmount,
                unit: asset?.metadata?.unit,
                giftedStorageDeposit: activity.data.giftedStorageDeposit,
                asyncStatus: activity.data.asyncStatus,
                direction: activity.data.direction,
                isInternal: activity.data.isInternal,
                claimedDate: activity.data.claimedDate,
                claimingTransactionId: activity.data.claimingTransactionId,
                expirationDate:
                    activity.data?.asyncStatus !== ActivityAsyncStatus.Claimed ? activity.data.expirationDate : null,
                timelockDate: activity.data.timelockDate,
                subject: activity.data?.subject,
                tag: activity.data?.tag,
                metadata: activity.data?.metadata,
            }
        } else if (activity.data.type === ActivityType.Foundry) {
            return {
                ...details,
                asset,
                storageDeposit: activity.data.storageDeposit,
                rawAmount: activity.data.rawAmount,
                unit: asset?.metadata?.unit,
                giftedStorageDeposit: activity.data.giftedStorageDeposit,
            }
        } else if (activity.data.type === ActivityType.Alias) {
            return {
                ...details,
                storageDeposit: activity.data.storageDeposit,
                aliasId: activity.data.aliasId,
                governorAddress: activity.data.governorAddress,
                stateControllerAddress: activity.data.stateControllerAddress,
            }
        } else if (activity.data.type === ActivityType.Nft) {
            return {
                ...details,
                type: activity.type,
                storageDeposit: activity.data.storageDeposit,
                giftedStorageDeposit: activity.data.giftedStorageDeposit,
                metadata: activity.data.metadata,
                asyncStatus: activity.data.asyncStatus,
                direction: activity.data.direction,
                isInternal: activity.data.isInternal,
                claimedDate: activity.data.claimedDate,
                claimingTransactionId: activity.data.claimingTransactionId,
                expirationDate:
                    activity.data?.asyncStatus !== ActivityAsyncStatus.Claimed ? activity.data.expirationDate : null,
                timelockDate: activity.data.timelockDate,
                subject: activity.data?.subject,
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
        if (activity.data.type === ActivityType.Transaction) {
            await claimActivity(activity.id, activity.data)
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
    {#if activity?.data.type === ActivityType.Transaction}
        <TransactionDetails {...details} />
    {:else if activity?.data.type === ActivityType.Foundry}
        <FoundryDetails {...details} />
    {:else if activity?.data.type === ActivityType.Alias}
        <AliasDetails {...details} />
    {:else if activity?.data.type === ActivityType.Nft}
        <NftDetails {...details} />
    {/if}
    {#if !isTimelocked && activity.data.type === ActivityType.Transaction && isActivityIncomingAndUnclaimed}
        <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
            <Button
                outline
                classes="w-full"
                disabled={activity.data.isClaiming || activity.data.isRejected}
                onClick={reject}
            >
                {localize('actions.reject')}
            </Button>
            <Button
                classes="w-full"
                disabled={activity.data.isClaiming}
                onClick={onClaimClick}
                isBusy={activity.data.isClaiming}
            >
                {localize('actions.claim')}
            </Button>
        </popup-buttons>
    {/if}
</activity-details-popup>

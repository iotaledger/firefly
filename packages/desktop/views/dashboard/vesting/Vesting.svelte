<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { PopupId, openPopup } from '@auxiliary/popup'
    import { VestingSchedule, VestingModal } from '@components'
    import {
        IVestingPayout,
        VestingOutputStatus,
        VestingType,
        calculateAsmbEquivalence,
        selectedAccountVestingOutputs,
        selectedAccountVestingOverview,
        selectedAccountVestingPayouts,
        selectedAccountVestingUnclaimedFunds,
    } from '@contexts/vesting'
    import { selectedAccount } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { activeProfile } from '@core/profile'
    import { getBestTimeDuration } from '@core/utils'
    import {
        formatTokenAmountBestMatch,
        getRequiredStorageDepositForMinimalBasicOutput,
        selectedWalletAssets,
    } from '@core/wallet'
    import {
        Button,
        FontWeight,
        Height,
        Icon,
        Pane,
        Text,
        TextType,
        Tile,
        Modal,
        MeatballMenuButton,
        TooltipIcon,
    } from '@ui'
    import { onMount } from 'svelte'

    const DEFAULT_EMPTY_VALUE_STRING = '----'
    let modal: Modal
    let timeUntilNextPayout = DEFAULT_EMPTY_VALUE_STRING
    let minRequiredStorageDeposit: number | null
    let hasOutputsToConsolidate = false

    $: ({ baseCoin } = $selectedWalletAssets[$activeProfile?.network?.id])
    $: hasTransactionInProgress =
        $selectedAccount?.isTransferring || $selectedAccount.hasConsolidatingOutputsTransactionInProgress
    $: $selectedAccount, areOutputsReadyForConsolidation()
    $: vestingOverview = [
        {
            title: localize('views.vesting.overview.unlocked'),
            iotaAmount: $selectedAccountVestingOverview?.accumulatedPayout || 0,
        },
        {
            title: localize('views.vesting.overview.locked'),
            iotaAmount: $selectedAccountVestingOverview?.remainingPayout || 0,
        },
        {
            title: localize('views.vesting.overview.total'),
            iotaAmount: $selectedAccountVestingOverview?.totalRewards || 0,
            asmbAmount:
                $selectedAccountVestingOverview?.totalRewards &&
                $selectedAccountVestingOutputs.every((payout) => payout.type === VestingType.Staker)
                    ? calculateAsmbEquivalence($selectedAccountVestingOverview?.totalRewards, baseCoin.metadata)
                    : undefined,
        },
    ]
    $: $selectedAccountVestingPayouts, (timeUntilNextPayout = getTimeUntilNextPayout())
    $: canCollect =
        $selectedAccountVestingUnclaimedFunds > 0 &&
        !hasTransactionInProgress &&
        minRequiredStorageDeposit !== null &&
        $selectedAccount?.balances?.baseCoin?.available > minRequiredStorageDeposit &&
        hasOutputsToConsolidate

    onMount(() => {
        getMinRequiredStorageDeposit()
    })

    function areOutputsReadyForConsolidation(): void {
        $selectedAccount
            .prepareConsolidateOutputs({ force: false, outputThreshold: 2 })
            .then(() => (hasOutputsToConsolidate = true))
            .catch(() => (hasOutputsToConsolidate = false))
    }

    function getMinRequiredStorageDeposit() {
        getRequiredStorageDepositForMinimalBasicOutput()
            .then((deposit) => (minRequiredStorageDeposit = deposit))
            .catch(() => (minRequiredStorageDeposit = null))
    }

    function getFiatAmount(amount: number): string {
        return baseCoin ? formatCurrency(getMarketAmountFromAssetValue(amount, baseCoin)) : ''
    }

    function getTimeUntilNextPayout(): string {
        // Note: we can look at the time of the first output, since all outputs along the addresses are unlocked at the same time
        const upcomingPayout: IVestingPayout = $selectedAccountVestingPayouts?.find(
            (payout) => payout.status === VestingOutputStatus.Locked
        )
        if (!upcomingPayout) {
            return DEFAULT_EMPTY_VALUE_STRING
        }
        return getBestTimeDuration(upcomingPayout.unlockTime?.getTime() - new Date().getTime())
    }

    function onCollectClick(): void {
        openPopup({
            id: PopupId.VestingCollect,
        })
    }
</script>

{#if $selectedAccount}
    <vesting-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 space-x-4 justify-center"
    >
        <div class="flex space-x-4 max-w-7xl justify-center w-full">
            {#key $selectedAccount?.index}
                <left-pane class="flex flex-col w-1/3">
                    <Pane height={Height.Full}>
                        <left-pane-content class="flex flex-col justify-between h-full">
                            <div class="flex flex-col space-y-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex flex-row space-x-1 items-center">
                                        <Text type={TextType.h5} classes="text-left">
                                            {localize('views.vesting.title')}
                                        </Text>
                                        <TooltipIcon
                                            title={localize('views.vesting.infoTooltip.title')}
                                            text={localize('views.vesting.infoTooltip.body')}
                                            width={15}
                                            height={15}
                                            classes="ml-1"
                                        />
                                    </div>
                                    <div class="block relative">
                                        <MeatballMenuButton onClick={modal?.toggle} />
                                        <VestingModal bind:modal position={{ right: '0' }} classes="mt-1.5" />
                                    </div>
                                </div>
                                <div class="flex flex-col space-y-6">
                                    {#each vestingOverview as { title, iotaAmount, asmbAmount }}
                                        <div class="flex flex-col space-y-1">
                                            <Text fontWeight={FontWeight.medium} fontSize="12">{title}</Text>
                                            <Text type={TextType.h1} classes="mt-4 mb-2">
                                                {baseCoin
                                                    ? formatTokenAmountBestMatch(
                                                          Math.round(iotaAmount),
                                                          baseCoin.metadata
                                                      )
                                                    : DEFAULT_EMPTY_VALUE_STRING}
                                            </Text>
                                            <Text type={TextType.p} color="gray-600" darkColor="gray-500" fontSize="12">
                                                {getFiatAmount(iotaAmount) ?? DEFAULT_EMPTY_VALUE_STRING}
                                            </Text>
                                            {#if asmbAmount}
                                                <Text
                                                    type={TextType.p}
                                                    fontWeight={FontWeight.medium}
                                                    color="gray-600"
                                                    darkColor="gray-500"
                                                    fontSize="12"
                                                >
                                                    {asmbAmount}
                                                </Text>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            </div>
                            <div class="flex flex-col space-y-4">
                                <div class="flex flex-col space-y-2">
                                    <Text fontWeight={FontWeight.medium} fontSize="12">
                                        {localize('views.vesting.timeUntilNextUnlock')}
                                    </Text>
                                    <Tile classes="flex flex-row items-center space-x-2 py-3">
                                        <Icon icon={IconEnum.Timelock} classes="text-gray-800 dark:text-gray-100" />
                                        <Text color="gray-800" darkColor="gray-400" fontWeight={FontWeight.semibold}>
                                            {timeUntilNextPayout}
                                        </Text>
                                    </Tile>
                                </div>
                                <Button
                                    onClick={onCollectClick}
                                    classes="w-full"
                                    disabled={!canCollect}
                                    isBusy={hasTransactionInProgress}
                                >
                                    {localize('views.vesting.collect')}
                                </Button>
                            </div>
                        </left-pane-content>
                    </Pane>
                </left-pane>
                <right-pane class="w-full h-full min-h-96 flex-1 space-y-4 flex flex-col">
                    <Pane height={Height.Full}>
                        <Text type={TextType.h5} classes="text-left">{localize('views.vesting.payouts.title')}</Text>
                        <div class="h-full flex justify-center items-center">
                            <VestingSchedule payouts={$selectedAccountVestingPayouts} />
                        </div>
                    </Pane>
                </right-pane>
            {/key}
        </div>
    </vesting-container>
{/if}

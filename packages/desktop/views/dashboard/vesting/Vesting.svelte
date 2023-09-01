<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { VestingSchedule } from '@components'
    import {
        getLockedPayouts,
        getTotalPayouts,
        getUnlockedPayouts,
        selectedAccountVestingOutputs,
        selectedAccountVestingOverview,
    } from '@contexts/vesting'
    import { selectedAccount } from '@core/account/stores'
    import { time } from '@core/app'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { activeProfile } from '@core/profile'
    import { getBestTimeDuration } from '@core/utils'
    import {
        formatTokenAmountBestMatch,
        getTimelockDateFromOutput,
        isOutputTimeLocked,
        selectedAccountAssets,
    } from '@core/wallet'
    import { CommonOutput } from '@iota/sdk/out/types'
    import { Button, FontWeight, Icon, Pane, Text, TextType, Tile } from '@ui'

    const DEFAULT_EMPTY_VALUE_STRING = '----'

    $: ({ baseCoin } = $selectedAccountAssets[$activeProfile?.network?.id])

    $: totalPayouts = $selectedAccountVestingOverview ? getTotalPayouts() : 0
    $: lockedPayouts = $selectedAccountVestingOverview
        ? getLockedPayouts($selectedAccountVestingOverview.lockedOutputs, $selectedAccountVestingOverview.payoutAmount)
        : []
    $: unlockedPayouts = $selectedAccountVestingOverview
        ? getUnlockedPayouts(totalPayouts, lockedPayouts, $selectedAccountVestingOverview.payoutAmount)
        : []
    $: allPayouts = [...unlockedPayouts, ...lockedPayouts]
    $: vestingOverview = [
        {
            title: localize('views.vesting.overview.airdrop'),
            iotaAmount: $selectedAccountVestingOverview?.accumulatedPayout || 0,
        },
        {
            title: localize('views.vesting.overview.remaining'),
            iotaAmount: $selectedAccountVestingOverview?.remainingPayout || 0,
        },
        {
            title: localize('views.vesting.overview.totalRewards'),
            iotaAmount: $selectedAccountVestingOverview?.totalRewards || 0,
            asmbAmount: DEFAULT_EMPTY_VALUE_STRING,
        },
    ]

    // TODO: reduce to every minute or so
    let timeUntilNextAirdrop = DEFAULT_EMPTY_VALUE_STRING
    $: $time, (timeUntilNextAirdrop = getTimeUntilNextAirdrop())

    function getFiatAmount(amount: number): string {
        return baseCoin ? formatCurrency(getMarketAmountFromAssetValue(amount, baseCoin)) : ''
    }

    function getTimeUntilNextAirdrop(): string {
        // Note: we can look at the time of the first output, since all outputs along the addresses are unlocked at the same time
        const upComingPayoutOutput = $selectedAccountVestingOutputs
            ?.find((addressWithOutputs) => addressWithOutputs.outputs?.length)
            ?.outputs.filter(isOutputTimeLocked)?.[0]?.output
        if (!upComingPayoutOutput) {
            return DEFAULT_EMPTY_VALUE_STRING
        }
        return getBestTimeDuration(
            getTimelockDateFromOutput(upComingPayoutOutput as CommonOutput)?.getTime() - $time.getTime()
        )
    }
</script>

{#if $selectedAccount}
    <vesting-container class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccount?.index}
            <div class="h-full flex flex-row space-x-4">
                <Pane>
                    <div class="flex flex-col space-y-4">
                        <Text type={TextType.h1}>{localize('views.vesting.title')}</Text>
                        <div class="flex flex-col space-y-4">
                            {#each vestingOverview as { title, iotaAmount, asmbAmount }}
                                <div class="flex flex-col space-y-2">
                                    <Text color="gray-600" darkColor="gray-400" fontSize="12">{title}</Text>
                                    <Text type={TextType.h1} classes="mt-4 mb-2">
                                        {baseCoin
                                            ? formatTokenAmountBestMatch(Math.round(iotaAmount), baseCoin.metadata)
                                            : DEFAULT_EMPTY_VALUE_STRING}
                                    </Text>
                                    <Text darkColor="gray-100" fontSize="12">
                                        {getFiatAmount(iotaAmount) ?? DEFAULT_EMPTY_VALUE_STRING}
                                    </Text>
                                    {#if asmbAmount}
                                        <Text darkColor="gray-100" fontSize="12">{asmbAmount}</Text>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="flex flex-col space-y-4">
                        <div class="flex flex-col space-y-2">
                            <Text color="gray-600" darkColor="gray-400" fontSize="12">
                                {localize('views.vesting.timeUntilNextAirdrop')}
                            </Text>
                            <Tile classes="flex flex-row items-center space-x-2">
                                <Icon icon={IconEnum.Timelock} classes="text-gray-800 dark:text-gray-100" />
                                <Text color="gray-800" darkColor="gray-400" fontWeight={FontWeight.semibold}>
                                    {timeUntilNextAirdrop}
                                </Text>
                            </Tile>
                        </div>
                        <Button classes="w-full">{localize('views.vesting.collect')}</Button>
                    </div>
                </Pane>
                <Pane>
                    <Text type={TextType.h4}>{localize('views.vesting.airdrops.title')}</Text>
                    <div class="h-full flex justify-center items-center">
                        <VestingSchedule payouts={allPayouts} />
                    </div>
                </Pane>
            </div>
        {/key}
    </vesting-container>
{/if}

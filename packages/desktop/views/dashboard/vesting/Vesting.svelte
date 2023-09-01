<script lang="ts">
    import { VestingSchedule } from '@components'
    import { IVestingOutput, VestingOutputStatus, selectedAccountVestingOverview } from '@contexts/vesting'
    import { selectedAccount } from '@core/account/stores'
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { Button, Pane, Text, TextType } from '@ui'

    const MOCKED_OUTPUTS: IVestingOutput[] = Array.from({ length: 120 }, (_, i) => {
        const amount = Math.floor(Math.random() * 100)
        const unlockTime = new Date(Date.now() + Math.random() * (2 * 365 * 24 * 60 * 60 * 1000))
        return {
            outputId: `output ID ${i}`,
            status: VestingOutputStatus.Locked,
            unlockTime,
            amount,
        }
    })

    $: ({ baseCoin } = $selectedAccountAssets[$activeProfile?.network?.id])

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
            asmbAmount: '--- ASMB',
        },
    ]

    $: sortedVestingOutputsByUnlockTime = MOCKED_OUTPUTS.sort((a, b) => a.unlockTime.getTime() - b.unlockTime.getTime())

    function getFiatAmount(amount: number): string {
        return baseCoin ? formatCurrency(getMarketAmountFromAssetValue(amount, baseCoin)) : ''
    }
</script>

{#if $selectedAccount}
    <vesting-container class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccount?.index}
            <div class="h-full flex flex-row space-x-4">
                <Pane classes="flex flex-col p-6 w-1/3 justify-between">
                    <div class="flex flex-col space-y-4">
                        <Text type={TextType.h1}>{localize('views.vesting.title')}</Text>
                        <div class="flex flex-col space-y-4">
                            {#each vestingOverview as { title, iotaAmount, asmbAmount }}
                                <div class="flex flex-col space-y-2">
                                    <Text color="gray-600" darkColor="gray-400" fontSize="12">{title}</Text>
                                    <Text type={TextType.h1} classes="mt-4 mb-2">
                                        {baseCoin
                                            ? formatTokenAmountBestMatch(Math.round(iotaAmount), baseCoin.metadata)
                                            : '----'}
                                    </Text>
                                    <Text darkColor="gray-100" fontSize="12">
                                        {getFiatAmount(iotaAmount) ?? '----'}
                                    </Text>
                                    {#if asmbAmount}
                                        <Text darkColor="gray-100" fontSize="12">{asmbAmount}</Text>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="w-full flex space-x-4">
                        <Button classes="w-full">{localize('views.vesting.collect')}</Button>
                    </div>
                </Pane>
                <Pane classes="h-full min-h-96 flex-1 py-8 px-12 w-2/3">
                    <Text type={TextType.h4}>{localize('views.vesting.airdrops.title')}</Text>
                    <div class="h-full flex justify-center items-center">
                        <VestingSchedule outputs={sortedVestingOutputsByUnlockTime} />
                    </div>
                </Pane>
            </div>
        {/key}
    </vesting-container>
{/if}

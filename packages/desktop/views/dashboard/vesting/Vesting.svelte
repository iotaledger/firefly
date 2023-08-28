<script lang="ts">
    import { Pane, Text, TextType, Button } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { VestingSchedule } from '@components'
    import { IVestingOutput, getBestTimeDuration, VestingOutputStatus } from '@core/utils'

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

    $: sortedVestingOutputsByUnlockTime = MOCKED_OUTPUTS.sort((a, b) => a.unlockTime.getTime() - b.unlockTime.getTime())

    $: nextVestingDate =
        MOCKED_OUTPUTS?.filter((output) => output?.unlockTime.getTime() > Date.now())
            ?.sort((a, b) => a?.unlockTime?.getTime() - b?.unlockTime?.getTime())?.[0]
            ?.unlockTime?.getTime() - Date.now()
</script>

{#if $selectedAccount}
    <vesting-container class="w-full h-full flex flex-col flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900">
        {#key $selectedAccount?.index}
            <div class="h-full flex flex-row space-x-4">
                <Pane classes="flex flex-col p-6 w-1/4">
                    <Text type={TextType.h4} classes="mb-4">Pending vesting amount</Text>
                    <Text type={TextType.h1} classes="mb-4">200 SMR</Text>
                    <div class="mt-auto w-full">
                        {#if nextVestingDate}
                            <Text classes="mb-4">Next reward available in {getBestTimeDuration(nextVestingDate)}</Text>
                        {/if}
                        <div class="flex space-x-4">
                            <Button classes="w-full">Collect</Button>
                        </div>
                    </div>
                </Pane>
                <Pane classes="h-full min-h-96 flex-1 py-8 px-12">
                    <Text type={TextType.h4}>{localize('views.vesting.airdrops.title')}</Text>
                    <div class="h-full flex justify-center items-center">
                        <VestingSchedule outputs={sortedVestingOutputsByUnlockTime} />
                    </div>
                </Pane>
            </div>
        {/key}
    </vesting-container>
{/if}

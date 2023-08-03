<script lang="ts">
    import { Text, TextType, Tile, Pill, CopyableBox } from '@ui'
    import { truncateString } from '@core/utils'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { getFormattedTimeStamp } from '@core/i18n'
    import { localize } from '@core/i18n'

    enum OutputStatus {
        Locked = 'locked',
        Available = 'available',
    }

    interface IVestingOutput {
        outputId: string
        status: OutputStatus
        unlockTime: Date
        amount: string
    }
    const MOCKED_VESTING_OUTPUTS: IVestingOutput[] = []

    const TABLE_HEADERS = ['outputId', 'amount', 'unlockTime', 'status']

    $: sortedVestingOutputsByUnlockTime = MOCKED_VESTING_OUTPUTS.sort(
        (a, b) => a.unlockTime.getTime() - b.unlockTime.getTime()
    )

    function getStatusPillBackgroundColor(status: string): string {
        if (status === OutputStatus.Locked) {
            return 'blue-200'
        } else {
            return 'green-200'
        }
    }
</script>

<div class="vesting-list h-full p-6 flex flex-col flex-auto flex-grow shrink-0 space-y-4">
    <div class="relative grid grid-cols-4 px-4">
        {#each TABLE_HEADERS as header, index}
            <Text type={TextType.h5} classes={!index ? null : 'text-right'}
                >{localize(`views.vesting.tableHeaders.${header}`)}</Text
            >
        {/each}
    </div>
    <div class="flex-auto h-full pb-10">
        {#if sortedVestingOutputsByUnlockTime.length > 0}
            <VirtualList items={sortedVestingOutputsByUnlockTime} let:item>
                <div class="mb-2">
                    <Tile classes="grid grid-cols-4 hover:bg-gray-100 dark:hover:bg-gray-1000">
                        <div>
                            <CopyableBox value={item.outputId} isCopyable clearPadding clearBoxPadding clearBackground>
                                <Text>{truncateString(item.outputId, 14, 20)}</Text>
                            </CopyableBox>
                        </div>
                        <Text classes="text-right">{item.amount}</Text>
                        <Text classes="text-right">{getFormattedTimeStamp(item.unlockTime)}</Text>
                        <pill-wrapper class="flex items-center justify-end">
                            <Pill backgroundColor={getStatusPillBackgroundColor(item.status)}
                                >{localize(`views.vesting.status.${item.status}`)}</Pill
                            >
                        </pill-wrapper>
                    </Tile>
                </div>
            </VirtualList>
        {/if}
    </div>
</div>

<style lang="scss">
    .vesting-list :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
    }
    .vesting-list :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>

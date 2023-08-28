<script lang="ts">
    import { Text, Tooltip, Pill, TextType } from '@ui'
    import { IVestingOutput, VestingOutputStatus } from '@core/utils'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { formatDate, localize } from '@core/i18n'

    export let outputs: IVestingOutput[] = []

    let hoveredOutput: IVestingOutput | undefined = undefined
    let anchor: HTMLElement | undefined = undefined

    $: columnsAmount = calculateOptimalColumns(outputs.length)
    $: remainingSpaces = calculateRemainingGridSpaces(outputs.length, columnsAmount)
    $: baseCoin = ($selectedAccountAssets?.[$activeProfile?.network?.id] ?? {}).baseCoin

    const MAX_GRID_COLUMNS = 14

    function calculateOptimalColumns(totalElements: number): number {
        const columns = Math.ceil(Math.sqrt(totalElements))
        const rows = Math.ceil(totalElements / columns)

        const bestAmountOfColumns = columns * rows >= totalElements ? columns : columns - 1
        return Math.min(bestAmountOfColumns, MAX_GRID_COLUMNS)
    }

    function formatCoinAmount(amount: number): string {
        return baseCoin?.metadata ? formatTokenAmountBestMatch(amount, baseCoin?.metadata) : ''
    }

    function handleHoverEvent(output?: IVestingOutput): (e: MouseEvent) => void {
        return (e) => {
            if (output) {
                anchor = e.currentTarget as HTMLElement
                hoveredOutput = output
            } else {
                anchor = undefined
                hoveredOutput = undefined
            }
        }
    }

    function calculateRemainingGridSpaces(totalElements: number, totalColumns: number): number {
        const columns = Math.ceil(totalElements / totalColumns)
        const rows = Math.ceil(totalElements / columns)

        return columns * rows - totalElements
    }
</script>

{#if outputs.length}
    <vesting-outputs-grid style:--columns={columnsAmount}>
        {#if remainingSpaces > 0}
            {#each Array.from({ length: remainingSpaces }) as _}
                <output-placeholder />
            {/each}
        {/if}

        {#each outputs as output}
            {@const onMouseEnterOutput = handleHoverEvent(output)}
            {@const onMouseLeaveOutput = handleHoverEvent()}
            <vesting-output
                on:mouseleave={onMouseLeaveOutput}
                on:mouseenter={onMouseEnterOutput}
                class:unlocked={output.status === VestingOutputStatus.Unlocked}
            />
        {/each}
    </vesting-outputs-grid>
{/if}

{#if hoveredOutput && anchor}
    <Tooltip {anchor}>
        <div class="flex flex-row justify-between space-x-24">
            <Text type={TextType.h4}>{localize('views.vesting.airdrops.tooltip.title')}</Text>
            <Pill backgroundColor="gray-300" textColor="gray-600"
                >{localize(`pills.vesting.${hoveredOutput.status}`)}</Pill
            >
        </div>
        <div class="w-full flex flex-row justify-between mt-8">
            <div class="text-left">
                <Text bold>{formatCoinAmount(hoveredOutput.amount)}</Text>
                <Text>{localize('views.vesting.airdrops.tooltip.amount')}</Text>
            </div>
            <div class="text-left">
                <Text bold>{formatDate(hoveredOutput.unlockTime, { format: 'short' })}</Text>
                <Text>{localize('views.vesting.airdrops.tooltip.unlockDate')}</Text>
            </div>
        </div>
    </Tooltip>
{/if}

<style lang="scss">
    vesting-outputs-grid {
        @apply grid;
        @apply gap-3;
        @apply place-items-center;
        @apply overflow-auto;
        @apply max-h-[90%];
        grid-template-columns: repeat(var(--columns), minmax(0, 1fr));

        output-placeholder {
            @apply h-3 w-3;
            @apply rounded-4;
            @apply bg-gray-200 dark:bg-opacity-20;
        }

        vesting-output {
            @apply h-8 w-8;
            @apply bg-blue-500;
            @apply rounded-4;
            @apply cursor-pointer;

            &.unlocked {
                @apply bg-gray-300;
            }
            &:hover {
                @apply bg-blue-600;
            }
        }
    }
</style>

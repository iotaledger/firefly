<script lang="ts">
    import { IVestingPayout, VestingOutputStatus } from '@contexts/vesting'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { Pill, Text, TextType, Tooltip } from '@ui'

    export let payouts: IVestingPayout[] = []

    let hoveredPayout: IVestingPayout | undefined = undefined
    let anchor: HTMLElement | undefined = undefined

    $: columnsAmount = calculateOptimalColumns(payouts.length)
    $: remainingSpaces = calculateRemainingGridSpaces(payouts.length, columnsAmount)
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

    function handleHoverEvent(payout?: IVestingPayout): (e: MouseEvent) => void {
        return (e) => {
            if (payout) {
                anchor = e.currentTarget as HTMLElement
                hoveredPayout = payout
            } else {
                anchor = undefined
                hoveredPayout = undefined
            }
        }
    }

    function calculateRemainingGridSpaces(totalElements: number, totalColumns: number): number {
        const columns = Math.ceil(totalElements / totalColumns)
        const rows = Math.ceil(totalElements / columns)

        return columns * rows - totalElements
    }
</script>

{#if payouts.length}
    <vesting-outputs-grid style:--columns={columnsAmount}>
        {#if remainingSpaces > 0}
            {#each Array.from({ length: remainingSpaces }) as _}
                <output-placeholder />
            {/each}
        {/if}
        {#each payouts as payout}
            {@const onMouseEnterOutput = handleHoverEvent(payout)}
            {@const onMouseLeaveOutput = handleHoverEvent()}
            <vesting-output
                on:mouseleave={onMouseLeaveOutput}
                on:mouseenter={onMouseEnterOutput}
                class:unlocked={payout.status === VestingOutputStatus.Unlocked}
            />
        {/each}
    </vesting-outputs-grid>
{/if}

{#if hoveredPayout && anchor}
    <Tooltip {anchor}>
        <div class="flex flex-row justify-between space-x-24">
            <Text type={TextType.h4}>{localize('views.vesting.payouts.tooltip.title')}</Text>
            <Pill backgroundColor="gray-300" textColor="gray-600"
                >{localize(`pills.vesting.${hoveredPayout.status}`)}</Pill
            >
        </div>
        <div class="w-full flex flex-col justify-between space-y-1 mt-2">
            <div class="text-left">
                <Text color="gray-600" darkColor="gray-500">{localize('views.vesting.payouts.tooltip.amount')}</Text>
                <Text bold>{formatCoinAmount(hoveredPayout.amount)}</Text>
            </div>
            <div class="text-left">
                <Text color="gray-600" darkColor="gray-500">
                    {localize('views.vesting.payouts.tooltip.unlockDate')}
                </Text>
                <Text bold>{getFormattedTimeStamp(hoveredPayout.unlockTime)}</Text>
            </div>
        </div>
    </Tooltip>
{/if}

<style lang="scss">
    vesting-outputs-grid {
        @apply grid;
        @apply gap-3;
        @apply place-items-center;
        @apply overflow-y-auto;
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

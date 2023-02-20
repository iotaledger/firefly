<script lang="ts">
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { BalanceSummaryRow, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let key: string
    export let subBreakdown: { [key: string]: { amount: number } } = undefined
    export let amount: number

    let expanded = false

    $: hasChildren = !!Object.keys(subBreakdown ?? {}).length
    $: ({ baseCoin } = $selectedAccountAssets)
    $: formattedAmount = formatTokenAmountBestMatch(amount, baseCoin.metadata)
    $: convertedAmount = formatCurrency(getMarketAmountFromAssetValue(amount, baseCoin))
</script>

<div class="flex flex-col space-y-8">
    <div
        class="w-full flex flex-row grow justify-between space-x-2 {hasChildren ? 'cursor-pointer ' : ''}"
        on:click={() => (expanded = !expanded)}
        on:keydown={() => {}}
    >
        {#if hasChildren}
            <Icon
                icon={expanded ? IconEnum.ChevronUp : IconEnum.ChevronDown}
                width="12"
                height="12"
                classes="text-white mt-1"
            />
        {/if}
        <BalanceSummaryRow
            title={localize(`popups.balanceBreakdown.${key}.title`)}
            subtitle={localize(`popups.balanceBreakdown.${key}.subtitle`)}
            amount={formattedAmount}
            {convertedAmount}
        />
    </div>
    {#if expanded}
        {#each Object.keys(subBreakdown ?? {}) as breakdownKey}
            <BalanceSummaryRow
                title={localize(`popups.balanceBreakdown.${breakdownKey}.title`)}
                subtitle={localize(`popups.balanceBreakdown.${breakdownKey}.subtitle`)}
                amount={formatTokenAmountBestMatch(subBreakdown[breakdownKey].amount, baseCoin.metadata)}
                convertedAmount={formatCurrency(
                    getMarketAmountFromAssetValue(subBreakdown[breakdownKey].amount, baseCoin)
                )}
                classes="ml-8"
            />
        {/each}
    {/if}
</div>

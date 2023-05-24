<script lang="ts">
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { BalanceSummaryRow, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { NetworkId } from '@core/network'

    export let titleKey: string
    export let subtitleKey: string = ''
    export let subBreakdown: { [key: string]: { amount: number } } = undefined
    export let amount: number
    export let bold: boolean = false

    let expanded = false

    $: hasChildren = !!Object.keys(subBreakdown ?? {}).length
    // TODO: replace Testnet with profile network
    $: ({ baseCoin } = $selectedAccountAssets?.[NetworkId.Testnet] ?? {})

    function getAmount(amount: number): string {
        return formatTokenAmountBestMatch(amount, baseCoin.metadata)
    }

    function getCurrencyAmount(amount: number): string {
        return formatCurrency(getMarketAmountFromAssetValue(amount, baseCoin))
    }

    function toggleExpandedView(): void {
        expanded = !expanded
    }
</script>

<div class="flex flex-col space-y-8">
    <div
        class="w-full flex flex-row flex-grow justify-between space-x-2 {hasChildren ? 'cursor-pointer ' : ''}"
        on:click={toggleExpandedView}
        on:keydown={() => {}}
    >
        {#if hasChildren}
            <Icon
                icon={expanded ? IconEnum.ChevronUp : IconEnum.ChevronDown}
                width="12"
                height="12"
                classes="dark:text-white mt-1"
            />
        {/if}
        <BalanceSummaryRow
            title={titleKey ? localize(`popups.balanceBreakdown.${titleKey}.title`) : ''}
            subtitle={subtitleKey ? localize(`popups.balanceBreakdown.${subtitleKey}.subtitle`) : ''}
            amount={getAmount(amount)}
            convertedAmount={getCurrencyAmount(amount)}
            {bold}
        />
    </div>
    {#if expanded}
        {#each Object.keys(subBreakdown ?? {}) as breakdownKey}
            <BalanceSummaryRow
                title={localize(`popups.balanceBreakdown.${breakdownKey}.title`)}
                subtitle={localize(`popups.balanceBreakdown.${breakdownKey}.subtitle`)}
                amount={getAmount(subBreakdown[breakdownKey].amount)}
                convertedAmount={getCurrencyAmount(subBreakdown[breakdownKey].amount)}
                classes="ml-8"
            />
        {/each}
    {/if}
</div>

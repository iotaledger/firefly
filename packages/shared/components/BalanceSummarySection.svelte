<script lang="ts">
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { IAsset, TokenMetadata, formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { BalanceSummaryRow, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { activeProfile } from '@core/profile'

    export let titleKey: string
    export let subtitleKey: string = ''
    export let subBreakdown: { [key: string]: { amount: number } } = {}
    export let amount: number
    export let bold: boolean = false

    let expanded: boolean = false

    $: hasChildren = !!Object.keys(subBreakdown ?? {}).length
    $: ({ baseCoin } = $selectedAccountAssets?.[$activeProfile?.network?.id] ?? {})

    function getAmount(amount: number): string {
        return formatTokenAmountBestMatch(amount, baseCoin?.metadata as TokenMetadata)
    }

    function getCurrencyAmount(amount: number): string {
        return formatCurrency(getMarketAmountFromAssetValue(amount, baseCoin as IAsset))
    }

    function toggleExpandedView(): void {
        expanded = !expanded
    }
</script>

<div class="flex flex-col space-y-8">
    <div
        class="w-full flex flex-row flex-grow justify-between space-x-2"
        class:cursor-pointer={hasChildren}
        on:click={toggleExpandedView}
        on:keydown={toggleExpandedView}
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
            <balance-summary-row-expanded class="ml-8">
                <BalanceSummaryRow
                    title={localize(`popups.balanceBreakdown.${breakdownKey}.title`)}
                    subtitle={localize(`popups.balanceBreakdown.${breakdownKey}.subtitle`)}
                    amount={getAmount(subBreakdown[breakdownKey].amount)}
                    convertedAmount={getCurrencyAmount(subBreakdown[breakdownKey].amount)}
                />
            </balance-summary-row-expanded>
        {/each}
    {/if}
</div>

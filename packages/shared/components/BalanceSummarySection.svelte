<script lang="ts">
    import { formatCurrency, localize } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { formatTokenAmountBestMatch, selectedWalletAssets } from '@core/wallet'
    import { BalanceSummaryRow, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { activeProfile } from '@core/profile'
    import { DEFAULT_MANA } from 'shared/lib/core/network'

    export let titleKey: string
    export let subtitleKey: string = ''
    export let subBreakdown: { [key: string]: { amount: number } } = {}
    export let amount: number
    export let bold: boolean = false
    export let isAsset: boolean = true

    let expanded: boolean = false

    $: hasChildren = !!Object.keys(subBreakdown ?? {}).length
    $: ({ baseCoin } = $selectedWalletAssets?.[$activeProfile?.network?.id] ?? {})

    function getAmount(amount: number): string {
        return baseCoin?.metadata ? formatTokenAmountBestMatch(amount, baseCoin?.metadata) : ''
    }

    function getAmountMana(amount: number): string {
        return formatTokenAmountBestMatch(amount, DEFAULT_MANA)
    }

    function handleAmount(isAsset: boolean, amount: number) {
        return isAsset ? getAmount(amount) : getAmountMana(amount)
    }

    function handleCurrencyAmount(isAsset: boolean, amount: number) {
        return isAsset ? getCurrencyAmount(amount) : getAmountMana(amount)
    }

    function getCurrencyAmount(amount: number): string {
        return baseCoin ? formatCurrency(getMarketAmountFromAssetValue(amount, baseCoin)) : ''
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
            amount={handleAmount(isAsset, amount)}
            convertedAmount={handleCurrencyAmount(isAsset, amount)}
            {bold}
        />
    </div>
    {#if expanded}
        {#each Object.keys(subBreakdown ?? {}) as breakdownKey}
            <balance-summary-row-expanded class="ml-8">
                <BalanceSummaryRow
                    title={localize(`popups.balanceBreakdown.${breakdownKey}.title`)}
                    subtitle={localize(`popups.balanceBreakdown.${breakdownKey}.subtitle`)}
                    amount={handleAmount(isAsset, subBreakdown[breakdownKey].amount)}
                    convertedAmount={handleCurrencyAmount(isAsset, subBreakdown[breakdownKey].amount)}
                />
            </balance-summary-row-expanded>
        {/each}
    {/if}
</div>

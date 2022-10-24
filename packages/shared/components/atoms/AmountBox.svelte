<script lang="typescript">
    import { IPersistedAsset } from '@core/wallet'
    import { getDecimalSeparator, getGroupSeparator } from '@lib/currency'
    import { AssetIcon, Text, FontWeight, TextType, Tooltip } from 'shared/components'

    export let asset: IPersistedAsset
    export let unit: string
    export let amount: string = ''
    export let fiatAmount: string = ''

    let displayedAmount: string[] = [amount]
    let tokenAmountElement: HTMLElement = null
    let isTooltipVisible = false

    $: {
        if (amount.length > 12) {
            displayedAmount = breakAmountIntoLines(amount)
        } else {
            displayedAmount = [amount]
        }
    }

    function showTooltip(): void {
        const hasDecimal = amount.includes(getDecimalSeparator())
        const hasMoreThanTwoDecimalNumbers = hasDecimal && amount.split(getDecimalSeparator())[1].length > 2
        if (amount.length > 12 && hasDecimal && hasMoreThanTwoDecimalNumbers) {
            isTooltipVisible = true
        }
    }

    function hideTooltip(): void {
        isTooltipVisible = false
    }

    function breakAmountIntoLines(amount: string): string[] {
        const NUMBERS_PER_THOUSAND_GROUP = 3
        const LINES = 2

        const amountWithTwoDecimalNumbers = amount.slice(0, amount.indexOf(getDecimalSeparator()) + 3)
        const amountLengthWithoutSeparator = amountWithTwoDecimalNumbers.split(',').join('').length
        const thousandSeparatorsIndexes: number[] = Array.from(amountWithTwoDecimalNumbers).reduce(
            (acc, char, i) => (char === getGroupSeparator() ? [...acc, i] : acc),
            []
        )
        const thousandGroups = Math.ceil(amountLengthWithoutSeparator / NUMBERS_PER_THOUSAND_GROUP / LINES)

        const result: string[] = []
        result.push(amountWithTwoDecimalNumbers.substring(0, thousandSeparatorsIndexes[thousandGroups - 1] + 1))
        result.push(amountWithTwoDecimalNumbers.substring(result[0].length, amountWithTwoDecimalNumbers.length))

        return result
    }
</script>

<amount class="flex flex-col items-center">
    <token-amount
        bind:this={tokenAmountElement}
        class="flex flex-row space-x-3"
        on:mouseenter={showTooltip}
        on:mouseleave={hideTooltip}
    >
        <AssetIcon {asset} />
        <div class="flex flex-col flex-wrap justify-center items-baseline space-x-0.1">
            {#each displayedAmount as line, index}
                <div class="flex items-baseline">
                    <Text type={TextType.h1} fontWeight={FontWeight.semibold}>{line}</Text>
                    {#if unit && index === displayedAmount.length - 1}
                        <Text type={TextType.h4} classes="ml-1" fontWeight={FontWeight.medium}>{unit}</Text>
                    {/if}
                </div>
            {/each}
        </div>
        {#if isTooltipVisible}
            <Tooltip anchor={tokenAmountElement}><Text>{amount} {unit}</Text></Tooltip>
        {/if}
    </token-amount>
    {#if fiatAmount}
        <Text fontSize="md" color="gray-600" darkColor="gray-500">{fiatAmount}</Text>
    {/if}
</amount>

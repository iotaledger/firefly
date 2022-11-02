<script lang="typescript">
    import { AssetIcon, Text, FontWeight, TextType, Tooltip } from 'shared/components'
    import { getNthOccurrenceIndex } from '@core/utils'
    import { IPersistedAsset } from '@core/wallet'
    import { getDecimalSeparator, getGroupSeparator } from '@core/i18n'

    export let asset: IPersistedAsset
    export let unit: string
    export let amount: string = ''
    export let fiatAmount: string = ''

    const MAX_LENGTH_PER_LINE = 15

    let displayedAmount: string[] = [amount]
    let tokenAmountElement: HTMLElement = null
    let isTooltipVisible = false

    $: hasDecimal = amount.includes(getDecimalSeparator())
    $: amountWithoutDecimals = amount.split(getDecimalSeparator())[0]

    $: {
        if (amount.length > MAX_LENGTH_PER_LINE) {
            displayedAmount = breakAmountIntoLines(amount)
        } else {
            displayedAmount = [amount]
        }
    }

    function showTooltip(): void {
        const hasMoreThanTwoDecimalNumbers = hasDecimal && amount.split(getDecimalSeparator())[1].length > 2
        if (amount.length > MAX_LENGTH_PER_LINE && hasDecimal && hasMoreThanTwoDecimalNumbers) {
            isTooltipVisible = true
        }
    }

    function hideTooltip(): void {
        isTooltipVisible = false
    }

    function breakAmountIntoLines(amount: string): string[] {
        const decimals = trimDecimals(amount)
        const thousands = breakThousands(decimals)
        const result: string[] = [...thousands]
        result[result.length - 1] = result[result.length - 1] + decimals
        return result
    }

    function trimDecimals(amount: string): string {
        if (hasDecimal) {
            const TWO_DECIMALS_WITH_SEPARATOR_LENGTH = 3

            const decimalSeparatorIndex = amount.indexOf(getDecimalSeparator())
            const decimalsLength =
                amountWithoutDecimals.length >= MAX_LENGTH_PER_LINE - TWO_DECIMALS_WITH_SEPARATOR_LENGTH
                    ? TWO_DECIMALS_WITH_SEPARATOR_LENGTH
                    : MAX_LENGTH_PER_LINE - amountWithoutDecimals.length

            return amount.slice(decimalSeparatorIndex, decimalSeparatorIndex + decimalsLength)
        } else {
            return ''
        }
    }

    function breakThousands(decimals: string = ''): string[] {
        const thousandGroups: string[] = amountWithoutDecimals
            .split(getGroupSeparator())
            .map((val, idx, arr) => (idx === arr.length - 1 ? val : val + getGroupSeparator()))

        if (amountWithoutDecimals.includes(getGroupSeparator()) && thousandGroups.length > 3) {
            const lines: number = Math.ceil((amountWithoutDecimals.length + decimals.length) / MAX_LENGTH_PER_LINE)

            const brokenThousands: string[] = [amountWithoutDecimals]
            for (let index = 0; index < lines - 1; index++) {
                let thousandsToBeIncluded: number =
                    index === lines - 1
                        ? Math.floor(thousandGroups.length / lines)
                        : Math.ceil(thousandGroups.length / lines)

                if (index === 0) {
                    thousandsToBeIncluded =
                        thousandGroups[0].length < 4 ? thousandsToBeIncluded + 1 : thousandsToBeIncluded
                }

                const nthSeparatorIndex: number = getNthOccurrenceIndex(
                    brokenThousands[index],
                    getGroupSeparator(),
                    thousandsToBeIncluded
                )
                brokenThousands[index + 1] = brokenThousands[index].slice(nthSeparatorIndex + 1)
                brokenThousands[index] = brokenThousands[index].slice(0, nthSeparatorIndex + 1)
            }

            return brokenThousands
        } else {
            return [amountWithoutDecimals]
        }
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
        <Text type={TextType.h1} fontWeight={FontWeight.semibold} classes="whitespace-pre items-baseline">
            {displayedAmount.join('\n')}
            {#if unit}
                <Text type={TextType.h4} classes="inline" fontWeight={FontWeight.medium}>{unit}</Text>
            {/if}
        </Text>
        {#if isTooltipVisible}
            <Tooltip anchor={tokenAmountElement}><Text classes="break-all">{amount} {unit}</Text></Tooltip>
        {/if}
    </token-amount>
    {#if fiatAmount}
        <Text fontSize="md" color="gray-600" darkColor="gray-500">{fiatAmount}</Text>
    {/if}
</amount>

<script lang="ts">
    import { AssetIcon, Text, FontWeight, TextType, InformationTooltip } from 'shared/components'
    import { getNthOccurrenceIndex } from '@core/utils'
    import { IPersistedAsset, formatTokenAmountDefault } from '@core/wallet'
    import { getDecimalSeparator, getGroupSeparator } from '@core/i18n'

    export let asset: IPersistedAsset
    export let amount: number
    export let unit: string | undefined = undefined

    const MAX_LENGTH_PER_LINE = 15

    const formattedAmount = asset?.metadata ? formatTokenAmountDefault(amount, asset.metadata, unit) : ''
    let displayedAmount: string[] = [formattedAmount]
    let tokenAmountElement: HTMLElement | null = null
    let isTooltipVisible = false

    $: hasDecimal = formattedAmount.includes(getDecimalSeparator())
    $: amountWithoutDecimals = formattedAmount.split(getDecimalSeparator())[0]

    $: {
        if (formattedAmount.length > MAX_LENGTH_PER_LINE) {
            displayedAmount = breakAmountIntoLines(formattedAmount)
        } else {
            displayedAmount = [formattedAmount]
        }
    }

    function showTooltip(): void {
        const hasMoreThanTwoDecimalNumbers = hasDecimal && formattedAmount.split(getDecimalSeparator())[1].length > 2
        if (formattedAmount.length > MAX_LENGTH_PER_LINE && hasDecimal && hasMoreThanTwoDecimalNumbers) {
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

{#if asset}
    <amount class="flex flex-col items-center">
        <token-amount
            bind:this={tokenAmountElement}
            class="flex flex-row space-x-3"
            on:mouseenter={showTooltip}
            on:mouseleave={hideTooltip}
        >
            <AssetIcon {asset} />
            <Text type={TextType.h1} fontWeight={FontWeight.semibold} classes="whitespace-pre">
                {displayedAmount.join('\n')}
                {#if unit}
                    <Text type={TextType.h4} classes="inline" fontWeight={FontWeight.medium}>{unit}</Text>
                {/if}
            </Text>
            {#if isTooltipVisible}
                <InformationTooltip anchor={tokenAmountElement} body="{amount} {unit}" />
            {/if}
        </token-amount>
    </amount>
{/if}

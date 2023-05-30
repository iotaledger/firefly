<script lang="ts">
    import { formatCurrency, getDecimalSeparator } from '@core/i18n'
    import { getMaxDecimalsFromTokenMetadata } from '@core/token/utils'
    import { IAsset, convertToRawAmount, formatTokenAmountDefault, visibleSelectedAccountAssets } from '@core/wallet'
    import { AmountInput, FontWeight, InputContainer, Text } from '@ui'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { validateTokenAmount } from '@core/wallet/utils/validateTokenAmount'
    import { getBaseToken } from '@core/profile'

    export let asset: IAsset | undefined = $visibleSelectedAccountAssets?.baseCoin
    export let rawAmount: string | undefined = undefined
    export let unit: string | undefined = undefined
    export let availableBalance: number
    export let inputtedAmount: string | undefined =
        rawAmount && asset?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), asset.metadata, unit, false)
            : undefined

    let amountInputElement: HTMLInputElement | undefined
    let error: string | undefined
    let inputLength = 0
    let fontSize = 64
    let maxLength = 0

    $: inputtedAmount,
        (error = ''),
        (inputLength = getInputLength()),
        (fontSize = getFontSizeForInputLength()),
        (maxLength = getMaxAmountOfDigits())
    $: allowedDecimals = asset?.metadata && unit ? getMaxDecimalsFromTokenMetadata(asset.metadata, unit) : 0
    $: bigAmount = inputtedAmount && asset?.metadata ? convertToRawAmount(inputtedAmount, asset.metadata, unit) : 0
    $: marketAmount = asset ? getMarketAmountFromAssetValue(bigAmount, asset) : undefined
    $: rawAmount = bigAmount.toString()

    function getInputLength(): number {
        const length = inputtedAmount?.length || 1
        const isDecimal = inputtedAmount?.includes('.') || inputtedAmount?.includes(',')

        return length - (isDecimal ? 0.5 : 0)
    }

    function getMaxAmountOfDigits(): number {
        const baseCoin = getBaseToken()
        const decimalSeparator = getDecimalSeparator()

        const decimalPlacesAmount = inputtedAmount?.includes(decimalSeparator)
            ? inputtedAmount.split(decimalSeparator)[1].length || 1
            : 0
        const allowedDecimalAmount = Math.min(decimalPlacesAmount, baseCoin.decimals)

        const integerLengthOfBalance =
            formatTokenAmountDefault(availableBalance, baseCoin).split(decimalSeparator)?.[0]?.length ?? 0

        return (
            allowedDecimalAmount +
            integerLengthOfBalance +
            (baseCoin.decimals ? 1 : 0) +
            (inputtedAmount?.includes(decimalSeparator) ? 1 : 0)
        )
    }

    function getFontSizeForInputLength(): number {
        if (inputLength < 10) {
            return 64
        } else if (inputLength < 14) {
            return 48
        } else {
            return 32
        }
    }

    export async function validate(allowZeroOrNull = false): Promise<void> {
        if (inputtedAmount === undefined || asset === undefined || unit === undefined) {
            return Promise.reject()
        }
        try {
            rawAmount = await validateTokenAmount(inputtedAmount, asset, unit, allowZeroOrNull)
            return Promise.resolve()
        } catch (err) {
            error = err as string
            console.error(error)
            return Promise.reject()
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex flex-col items-center w-full" on:click={() => amountInputElement.focus()}>
    <InputContainer {error} clearBackground clearPadding clearBorder classes="w-full flex flex-col items-center">
        <div class="flex flex-row items-end space-x-0.5">
            <div class="flex flex-row w-full items-center">
                <amount-wrapper style:--max-width={`${(inputLength * fontSize * 2) / 3}px`}>
                    <AmountInput
                        bind:inputElement={amountInputElement}
                        bind:amount={inputtedAmount}
                        maxDecimals={allowedDecimals}
                        maxlength={maxLength}
                        isInteger={allowedDecimals === 0}
                        {fontSize}
                        clearBackground
                        clearPadding
                        clearBorder
                    />
                </amount-wrapper>
            </div>

            <Text fontWeight={FontWeight.semibold} classes={inputLength < 14 ? 'py-4' : 'py-2'}>
                {unit}
            </Text>
        </div>
    </InputContainer>
    <Text fontWeight={FontWeight.semibold} color="gray-600" darkColor="gray-600">
        {formatCurrency(marketAmount) || '--'}
    </Text>
</div>

<style lang="scss">
    amount-wrapper {
        max-width: var(--max-width);
        @apply flex;
    }
</style>

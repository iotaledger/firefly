<script lang="ts">
    import { formatCurrency, localize, parseCurrency } from '@core/i18n'
    import { getMaxDecimalsFromTokenMetadata } from '@core/token/utils'
    import {
        IAsset,
        TokenStandard,
        convertToRawAmount,
        formatTokenAmountDefault,
        visibleSelectedAccountAssets,
    } from '@core/wallet'
    import Big from 'big.js'
    import { AmountInput, FontWeight, InputContainer, Text } from '@ui'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'

    export let disabled = false
    export let asset: IAsset | undefined = $visibleSelectedAccountAssets?.baseCoin
    export let rawAmount: string | undefined = undefined
    export let unit: string | undefined = undefined
    export let inputtedAmount: string | undefined =
        rawAmount && asset?.metadata
            ? formatTokenAmountDefault(Number(rawAmount), asset.metadata, unit, false)
            : undefined

    let amountInputElement: HTMLInputElement
    let error: string

    $: inputtedAmount, (error = '')
    $: allowedDecimals = asset?.metadata && unit ? getMaxDecimalsFromTokenMetadata(asset.metadata, unit) : 0
    $: availableBalance = asset?.balance?.available ?? 0
    $: bigAmount = inputtedAmount && asset?.metadata ? convertToRawAmount(inputtedAmount, asset.metadata, unit) : 0
    $: marketAmount = asset ? getMarketAmountFromAssetValue(bigAmount, asset) : undefined
    $: rawAmount = bigAmount.toString()

    export function validate(allowZeroOrNull = false): Promise<void> {
        if (inputtedAmount === undefined || asset?.metadata === undefined) {
            return Promise.reject()
        }
        const amountAsFloat = parseCurrency(inputtedAmount)
        const isAmountZeroOrNull = !Number(amountAsFloat)
        const requiresRawAmount =
            (asset.metadata.standard === TokenStandard.BaseToken && unit === asset.metadata.subunit) ||
            asset.metadata.decimals === 0
        const bigAmount = convertToRawAmount(inputtedAmount, asset.metadata, unit)

        // Zero value transactions can still contain metadata/tags
        error = ''
        if (allowZeroOrNull && isAmountZeroOrNull) {
            rawAmount = Big(0).toString()
            return Promise.resolve()
        } else if (isAmountZeroOrNull) {
            error = localize('error.send.amountInvalidFormat')
        } else if (requiresRawAmount && Number.parseInt(inputtedAmount, 10).toString() !== inputtedAmount) {
            error = localize('error.send.amountNoFloat')
        } else if (bigAmount.gt(Big(availableBalance))) {
            error = localize('error.send.amountTooHigh')
        } else if (bigAmount.lte(Big(0))) {
            error = localize('error.send.amountZero')
        } else if (!bigAmount.mod(1).eq(Big(0))) {
            error = localize('error.send.amountSmallerThanSubunit')
        }

        if (error) {
            return Promise.reject(error)
        }
        rawAmount = bigAmount.toString()
        return Promise.resolve()
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex flex-col items-center w-full" on:click={() => amountInputElement.focus()}>
    <InputContainer {error} clearBackground clearPadding clearBorder classes="w-full flex flex-col items-center">
        <div class="flex flex-row items-end space-x-0.5">
            <div class="flex flex-row w-full">
                <amount-wrapper style:--max-width={`${Math.max((inputtedAmount ?? '0')?.length, 1) * 40}px`}>
                    <AmountInput
                        bind:inputElement={amountInputElement}
                        bind:amount={inputtedAmount}
                        maxDecimals={allowedDecimals}
                        isInteger={allowedDecimals === 0}
                        fontSize={64}
                        clearBackground
                        clearPadding
                        clearBorder
                        {disabled}
                    />
                </amount-wrapper>
            </div>

            <Text fontWeight={FontWeight.semibold} classes="py-4">
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

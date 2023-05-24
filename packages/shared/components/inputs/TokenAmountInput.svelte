<script lang="ts">
    import { formatCurrency } from '@core/i18n'
    import { getMaxDecimalsFromTokenMetadata } from '@core/token/utils'
    import { IAsset, convertToRawAmount, formatTokenAmountDefault, visibleSelectedAccountAssets } from '@core/wallet'
    import { AmountInput, FontWeight, InputContainer, Text } from '@ui'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { validateTokenAmount } from '@core/wallet/utils/validateTokenAmount'
    import { NetworkId } from '@core/network'

    // TODO: replace Testnet with profile network
    export let asset: IAsset | undefined = $visibleSelectedAccountAssets?.[NetworkId.Testnet]?.baseCoin
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
    $: bigAmount = inputtedAmount && asset?.metadata ? convertToRawAmount(inputtedAmount, asset.metadata, unit) : 0
    $: marketAmount = asset ? getMarketAmountFromAssetValue(bigAmount, asset) : undefined
    $: rawAmount = bigAmount.toString()

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

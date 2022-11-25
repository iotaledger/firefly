<script lang="typescript">
    import { Text, FontWeight, AssetIcon, InputContainer, AmountInput, SliderInput, UnitInput } from 'shared/components'
    import { convertToRawAmount, formatTokenAmountBestMatch, formatTokenAmountDefault, IAsset } from '@core/wallet'
    import { IOTA_UNIT_MAP } from '@core/utils'
    import { parseCurrency } from '@core/i18n/utils/parseCurrency'
    import { localize } from '@core/i18n'
    import Big from 'big.js'

    export let inputElement: HTMLInputElement = undefined
    export let disabled = false
    export let isFocused = false
    export let asset: IAsset
    export let rawAmount: string = undefined
    export let unit: string = undefined

    let amountInputElement: HTMLInputElement
    let error: string
    let amount: string = rawAmount
        ? formatTokenAmountDefault(Number(rawAmount), asset?.metadata, unit, false)
        : undefined
    $: isFocused && (error = '')

    let allowedDecimals = 0
    $: if (!asset?.metadata?.useMetricPrefix) {
        if (unit === asset?.metadata.unit) {
            allowedDecimals = Math.min(asset?.metadata.decimals, 18)
        } else if (unit === asset?.metadata?.subunit) {
            allowedDecimals = 0
        }
    } else if (asset?.metadata?.useMetricPrefix) {
        allowedDecimals = IOTA_UNIT_MAP?.[unit?.substring(0, 1)] ?? 0
    }

    $: bigAmount = convertToRawAmount(amount, unit, asset?.metadata)

    export function validate(): Promise<void> {
        const amountAsFloat = parseCurrency(amount)
        const isAmountZeroOrNull = !Number(amountAsFloat)

        // Zero value transactions can still contain metadata/tags
        error = ''
        if (isAmountZeroOrNull) {
            error = localize('error.send.amountInvalidFormat')
        } else if (
            (unit === asset?.metadata?.subunit ||
                (unit === asset?.metadata?.unit && asset?.metadata?.decimals === 0)) &&
            Number.parseInt(amount, 10).toString() !== amount
        ) {
            error = localize('error.send.amountNoFloat')
        } else if (bigAmount.gt(Big(asset?.balance?.available))) {
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
    }
</script>

<InputContainer
    bind:this={inputElement}
    bind:inputElement={amountInputElement}
    col
    {isFocused}
    {error}
    classes="space-y-5"
    on:clickOutside={() => (isFocused = false)}
>
    <div class="flex flex-row w-full items-center space-x-0.5 relative">
        <div
            class="flex flex-row items-center p-2 space-x-2 text-left bg-gray-100 dark:bg-gray-700 rounded-md cursor-default"
        >
            <AssetIcon small {asset} />
            <div class="w-full relative" style="max-width: 75px;">
                <Text
                    color="gray-600"
                    darkColor="white"
                    fontWeight={FontWeight.semibold}
                    fontSize="15"
                    classes="overflow-hidden whitespace-nowrap overflow-ellipsis"
                >
                    {asset?.metadata?.name ?? asset?.id}
                </Text>
            </div>
        </div>
        <AmountInput
            bind:inputElement={amountInputElement}
            bind:amount
            bind:hasFocus={isFocused}
            maxDecimals={allowedDecimals}
            isInteger={allowedDecimals === 0}
            clearBackground
            clearPadding
            clearBorder
            {disabled}
        />
        <UnitInput bind:unit bind:isFocused tokenMetadata={asset?.metadata} />
    </div>
    <div class="flex flex-col">
        <SliderInput
            bind:value={amount}
            max={formatTokenAmountDefault(asset?.balance?.available, asset.metadata)}
            decimals={asset.metadata.decimals}
        />
        <div class="flex flex-row justify-between">
            <Text color="gray-800" darkColor="gray-500" fontSize="xs"
                >{formatTokenAmountBestMatch(0, asset?.metadata)}</Text
            >
            <Text color="gray-800" darkColor="gray-500" fontSize="xs"
                >{formatTokenAmountBestMatch(asset?.balance?.available, asset?.metadata)}</Text
            >
        </div>
    </div>
</InputContainer>

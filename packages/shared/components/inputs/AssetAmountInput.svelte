<script lang="typescript">
    import { Text, AssetDropdown, InputContainer, AmountInput } from 'shared/components'
    import UnitInput from './UnitInput.svelte'
    import { parseCurrency } from '@lib/currency'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, generateRawAmount, IAsset, parseRawAmount } from '@core/wallet'
    import { UNIT_MAP } from '@lib/units'

    export let inputElement: HTMLInputElement
    export let disabled = false
    export let isFocused = false
    export let asset: IAsset
    export let amount: string
    export let unit: string

    let amountInputElement: HTMLInputElement
    let error: string
    let previousAsset: IAsset

    $: isFocused && (error = '')
    $: if (asset !== previousAsset) {
        previousAsset = asset
        amount = null
        unit = null
    }
    $: rawAmount = generateRawAmount(amount, unit, asset?.metadata)

    let allowedDecimals = 0
    $: if (!asset?.metadata?.useMetricPrefix) {
        if (unit === asset?.metadata.unit) {
            allowedDecimals = asset?.metadata.decimals
        } else if (unit === asset?.metadata?.subunit) {
            allowedDecimals = 0
        }
    } else if (asset?.metadata?.useMetricPrefix) {
        allowedDecimals = UNIT_MAP?.[unit?.substring(0, 1)] ?? 0
    }

    function onClickAvailableBalance(): void {
        const isRawAmount = asset?.metadata?.decimals && asset?.metadata?.unit
        if (isRawAmount) {
            const parsedAmount = parseRawAmount(asset?.balance.available ?? 0, asset?.metadata)
            amount = parsedAmount.amount
            unit = parsedAmount.unit
            return
        }
        amount = asset?.balance.available.toString() ?? '0'
        unit = undefined
    }

    export function validate(allowZeroOrNull = false): Promise<void> {
        const amountAsFloat = parseCurrency(amount)
        const isAmountZeroOrNull = !Number(amountAsFloat)
        // Zero value transactions can still contain metadata/tags
        if (allowZeroOrNull && isAmountZeroOrNull) {
            return
        } else if (isAmountZeroOrNull) {
            error = localize('error.send.amountInvalidFormat')
        } else if (
            (unit === asset?.metadata?.subunit ||
                (unit === asset?.metadata?.unit && asset?.metadata?.decimals === 0)) &&
            Number.parseInt(amount, 10).toString() !== amount
        ) {
            error = localize('error.send.amountNoFloat')
        } else if (rawAmount > asset?.balance?.available) {
            error = localize('error.send.amountTooHigh')
        } else if (rawAmount <= 0) {
            error = localize('error.send.amountZero')
        } else if (rawAmount % 1 !== 0) {
            error = localize('error.send.amountSmallerThanSubunit')
        }

        if (error) {
            return Promise.reject(error)
        }

        amount = amountAsFloat.toString()
    }
</script>

<InputContainer
    bind:this={inputElement}
    bind:inputElement={amountInputElement}
    col
    {disabled}
    {isFocused}
    {error}
    classes="space-y-2"
>
    <div class="flex flex-row w-full items-center space-x-0.5 relative">
        <AssetDropdown bind:asset />
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
        {#if asset?.metadata?.unit}
            <UnitInput bind:unit bind:isFocused tokenMetadata={asset?.metadata} />
        {/if}
    </div>
    <div class="flex flex-row w-full items-end justify-between">
        {#if asset}
            <button on:click={onClickAvailableBalance}>
                <Text color="gray-600" darkColor="gray-500" fontSize="xs" classes="cursor-pointer">
                    {localize('general.availableBalance', {
                        values: { balance: formatTokenAmountBestMatch(asset?.balance?.available, asset?.metadata) },
                    })}
                </Text>
            </button>
        {/if}
        <Text color="gray-600" darkColor="gray-500" fontSize="xs">-</Text>
    </div>
</InputContainer>

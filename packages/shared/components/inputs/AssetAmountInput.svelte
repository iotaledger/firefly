<script lang="typescript">
    import { Text, AssetDropdown, InputContainer, AmountInput } from 'shared/components'
    import UnitInput from './UnitInput.svelte'
    import { parseCurrency } from '@lib/currency'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, generateRawAmount, IAsset, parseRawAmount } from '@core/wallet'
    import { UNIT_MAP } from '@lib/units'

    export let inputElement
    export let disabled = false
    export let isFocused = false
    export let asset: IAsset
    export let amount: string
    export let unit: string

    let amountInputElement
    let error

    $: isFocused && (error = '')

    $: rawAmount = asset?.metadata ? generateRawAmount(amount, unit, asset.metadata) : 0

    let allowedDecimals = 0
    $: if (!asset?.metadata.useMetricPrefix) {
        if (unit === asset?.metadata.unit) {
            allowedDecimals = asset?.metadata.decimals
        } else if (unit === asset?.metadata.subunit) {
            allowedDecimals = 0
        }
    } else if (asset?.metadata.useMetricPrefix) {
        allowedDecimals = UNIT_MAP?.[unit?.substring(0, 1)] ?? 0
    }

    function onClickAvailableBalance(): void {
        /* eslint-disable no-extra-semi */
        /* eslint-disable @typescript-eslint/no-extra-semi */
        ;({ amount, unit } = parseRawAmount(asset?.balance?.available ?? 0, asset.metadata))
    }

    export function validate(allowZeroOrNull = false): Promise<void> {
        const isAmountZeroOrNull = !Number(amount)
        if (allowZeroOrNull && isAmountZeroOrNull) {
            return Promise.resolve()
        } else if (isAmountZeroOrNull) {
            error = localize('error.send.amountInvalidFormat')
        } else if (
            (unit === asset?.metadata.subunit || (unit === asset?.metadata.unit && asset?.metadata.decimals === 0)) &&
            Number.parseInt(amount, 10).toString() !== amount
        ) {
            error = localize('error.send.amountNoFloat')
        } else if (rawAmount % 1 !== 0) {
            error = localize('error.send.amountSmallerThanSubunit')
        } else {
            const amountAsFloat = parseCurrency(amount)
            if (Number.isNaN(amountAsFloat)) {
                error = localize('error.send.amountInvalidFormat')
            } else {
                if (rawAmount > asset?.balance?.available) {
                    error = localize('error.send.amountTooHigh')
                } else if (rawAmount <= 0) {
                    error = localize('error.send.amountZero')
                }
            }
        }

        if (error) {
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
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
        <UnitInput bind:unit bind:isFocused tokenMetadata={asset?.metadata} />
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

<script lang="typescript">
    import { Text, AssetDropdown, InputContainer, AmountInput } from 'shared/components'
    import UnitInput from './UnitInput.svelte'
    import { parseCurrency } from '@lib/currency'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { getUnit, UNIT_MAP } from '@lib/units'

    export let inputElement
    export let disabled = false
    export let isFocused = false
    export let asset: IAsset
    export let rawAmount: number
    export let amount: string
    export let unit: string

    let amountInputElement
    let error

    $: isFocused && (error = '')

    $: if (!asset?.metadata.useMetricPrefix) {
        if (unit === asset?.metadata.unit) {
            rawAmount = Number(amount) * 10 ** asset?.metadata.decimals
        } else if (unit === asset?.metadata.subunit) {
            rawAmount = Number(amount)
        }
    } else if (asset?.metadata.useMetricPrefix) {
        rawAmount = Number(amount) * UNIT_MAP?.[unit?.substring(0, 1)] ?? 0
    }

    function onClickAvailableBalance(): void {
        if (!asset?.metadata.useMetricPrefix) {
            const balance = (asset?.balance?.available ?? 0) / 10 ** asset?.metadata.decimals
            amount = balance.toString()
            unit = asset.metadata.unit
        } else if (asset?.metadata.useMetricPrefix) {
            const metricUnit = getUnit(asset?.balance?.available ?? 0)
            const balance = (asset?.balance?.available ?? 0) / UNIT_MAP[metricUnit].val
            amount = balance.toString()
            unit = metricUnit + asset.metadata.unit
        }
    }

    export function validate(): Promise<void> {
        if (!amount) {
            error = localize('error.send.amountInvalidFormat')
        } else if (
            (unit === asset?.metadata.subunit || (unit === asset?.metadata.unit && asset?.metadata.decimals === 0)) &&
            Number.parseInt(amount, 10).toString() !== amount
        ) {
            error = localize('error.send.amountNoFloat')
        } else {
            const amountAsFloat = parseCurrency(amount)
            if (Number.isNaN(amountAsFloat)) {
                error = localize('error.send.amountInvalidFormat')
            } else {
                if (rawAmount > asset?.balance.available) {
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
    <div class="flex flex-row w-full items-center space-x-0.5">
        <AssetDropdown bind:asset />
        <AmountInput
            bind:inputElement={amountInputElement}
            bind:amount
            bind:hasFocus={isFocused}
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
                    Available balance: {formatTokenAmountBestMatch(asset?.balance?.available, asset?.metadata)}
                </Text>
            </button>
        {/if}
        <Text color="gray-600" darkColor="gray-500" fontSize="xs">-</Text>
    </div>
</InputContainer>

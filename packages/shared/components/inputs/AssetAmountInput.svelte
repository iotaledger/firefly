<script lang="typescript">
    import Big from 'big.js'
    import { Text, AssetDropdown, InputContainer, AmountInput, TooltipIcon } from 'shared/components'
    import UnitInput from './UnitInput.svelte'
    import { parseCurrency } from '@lib/currency'
    import { localize } from '@core/i18n'
    import {
        formatTokenAmountBestMatch,
        convertToRawAmount,
        IAsset,
        formatTokenAmountDefault,
        visibleSelectedAccountAssets,
    } from '@core/wallet'
    import { UNIT_MAP } from '@lib/units'

    export let inputElement: HTMLInputElement = undefined
    export let disabled = false
    export let isFocused = false
    export let asset: IAsset = $visibleSelectedAccountAssets?.baseCoin
    export let rawAmount: string = undefined
    export let unit: string = undefined

    let amount: string = rawAmount ? formatTokenAmountDefault(Number(rawAmount), asset?.metadata) : undefined
    let amountInputElement: HTMLInputElement
    let error: string

    $: isFocused && (error = '')

    let allowedDecimals = 0
    $: if (!asset?.metadata?.useMetricPrefix) {
        if (unit === asset?.metadata.unit) {
            allowedDecimals = Math.min(asset?.metadata.decimals, 18)
        } else if (unit === asset?.metadata?.subunit) {
            allowedDecimals = 0
        }
    } else if (asset?.metadata?.useMetricPrefix) {
        allowedDecimals = UNIT_MAP?.[unit?.substring(0, 1)] ?? 0
    }

    function onClickAvailableBalance(): void {
        const isRawAmount = asset?.metadata?.decimals && asset?.metadata?.unit
        if (isRawAmount) {
            const parsedAmount = formatTokenAmountDefault(asset?.balance?.available, asset?.metadata)
            amount = parsedAmount
            unit = asset?.metadata?.unit
            return
        }
        amount = asset?.balance.available.toString() ?? '0'
        unit = undefined
    }

    export function validate(allowZeroOrNull = false): Promise<void> {
        const amountAsFloat = parseCurrency(amount)
        const isAmountZeroOrNull = !Number(amountAsFloat)
        const bigAmount = convertToRawAmount(amount, unit, asset?.metadata)
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
    classes="space-y-2"
    on:clickOutside={() => (isFocused = false)}
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
            <div class="flex flex-row items-center">
                <button on:click={onClickAvailableBalance}>
                    <Text color="gray-600" darkColor="gray-500" fontSize="xs" classes="cursor-pointer">
                        {localize('general.availableBalanceWithValue', {
                            values: { balance: formatTokenAmountBestMatch(asset?.balance?.available, asset?.metadata) },
                        })}
                    </Text>
                </button>
                <TooltipIcon
                    title={localize('general.availableBalance')}
                    text={localize('general.availableBalanceTooltip')}
                    width={15}
                    height={15}
                    classes="ml-1"
                />
            </div>
        {/if}
        <!-- Placeholder for asset USD value  -->
        <Text color="gray-600" darkColor="gray-500" fontSize="xs">-</Text>
    </div>
</InputContainer>

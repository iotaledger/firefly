<script lang="typescript">
    import { Text, AssetDropdown, InputContainer, AmountInput } from 'shared/components'

    import { Unit } from '@iota/unit-converter'
    import UnitInput from './UnitInput.svelte'
    import { convertToFiat, currencies, exchangeRates, formatCurrency, parseCurrency } from '@lib/currency'
    import { CurrencyTypes } from '@lib/typings/currency'
    import { activeProfile } from '@lib/profile'
    import { UNIT_MAP } from '@lib/units'
    import { localize } from '@core/i18n'

    export let inputElement

    export let disabled = false
    export let isFocused = false

    export let asset
    export let amount: string
    export let unit = Unit.Mi

    let rawAmount = 0

    let amountInputElement
    let error

    $: rawAmount = Number(amount) * UNIT_MAP[unit].val
    $: formattedFiatValue = formatCurrency(
        convertToFiat(rawAmount, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings.currency])
    )

    $: isFocused && (error = '')

    function onClickAvailableBalance(): void {
        const balance = asset?.balance ?? '0 Mi'
        const rawBalance = asset?.rawBalance ?? 0
        const parts = balance?.split(' ')
        const _unit = parts[parts?.length - 1]
        amount = (rawBalance / UNIT_MAP[_unit].val).toString()
        unit = Unit[_unit]
    }

    export function validate(): Promise<void> {
        if (!amount) {
            error = localize('error.send.amountInvalidFormat')
        } else if (unit === Unit.i && Number.parseInt(amount, 10).toString() !== amount) {
            error = localize('error.send.amountNoFloat')
        } else {
            const amountAsFloat = parseCurrency(amount)

            if (Number.isNaN(amountAsFloat)) {
                error = localize('error.send.amountInvalidFormat')
            } else {
                if (rawAmount > asset?.rawBalance) {
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
            {...$$restProps}
        />
        <UnitInput bind:unit bind:isFocused {asset} />
    </div>
    <div class="flex flex-row w-full items-end justify-between">
        <button on:click={onClickAvailableBalance}>
            <Text color="gray-600" darkColor="gray-500" fontSize="xs" classes="cursor-pointer">
                Available balance: {asset?.balance}
            </Text>
        </button>
        <Text color="gray-600" darkColor="gray-500" fontSize="xs">{formattedFiatValue}</Text>
    </div>
</InputContainer>

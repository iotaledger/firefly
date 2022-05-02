<script lang="typescript">
    import { Text, AssetDropdown, InputContainer, TextInput } from 'shared/components'
    import AmountInput from './AmountInput.svelte'
    import { Unit } from '@iota/unit-converter'
    import UnitInput from './UnitInput.svelte'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from '@lib/currency'
    import { CurrencyTypes } from '@lib/typings/currency'
    import { activeProfile } from '@lib/profile'
    import { UNIT_MAP } from '@lib/units'

    export let disabled = false
    export let isFocused = false

    export let asset
    export let amount
    export let unit = Unit.Mi
    let rawAmount = 0
    const fiatValue = 0

    let error

    $: rawAmount = amount * UNIT_MAP[unit].val

    $: formattedFiatValue = formatCurrency(
        convertToFiat(rawAmount, $currencies[CurrencyTypes.USD], $exchangeRates[$activeProfile?.settings.currency])
    )

    function onClickAvailableBalance() {
        const balance: string = asset?.balance ?? '0 Mi'
        const rawBalance: number = asset?.rawBalance ?? 0
        const parts = balance?.split(' ')
        const _unit = parts[parts.length - 1]
        amount = rawBalance / UNIT_MAP[_unit].val
        unit = Unit[_unit]
    }
</script>

<InputContainer col {disabled} {isFocused} {error} classes="space-y-2">
    <div class="flex flex-row w-full items-center space-x-0.5">
        <AssetDropdown bind:asset />
        <AmountInput clearBackground clearPadding clearBorder bind:amount bind:isFocused {disabled} {...$$restProps} />
        <UnitInput bind:unit bind:isFocused {asset} />
    </div>
    <div class="flex flex-row w-full items-end justify-between">
        <button on:click={onClickAvailableBalance}>
            <Text color="gray-600" darkColor="gray-500" fontSize="xs" classes="cursor-pointer"
                >Available balance: {asset?.balance}</Text
            >
        </button>
        <Text color="gray-600" darkColor="gray-500" fontSize="xs">{formattedFiatValue}</Text>
    </div>
</InputContainer>

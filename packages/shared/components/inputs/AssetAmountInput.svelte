<script lang="typescript">
    import { Text, AssetDropdown, InputContainer, TextInput } from 'shared/components'
    import AmountInput from './AmountInput.svelte'
    import { Unit } from '@iota/unit-converter'
    import UnitInput from './UnitInput.svelte'

    export let disabled = false
    export let isFocused = false

    export let asset
    export let amount
    export let unit = Unit.Mi

    let error

    function onClickAvailableBalance() {
        const balance: string = asset?.balance ?? '0 Mi'
        const parts = balance?.split(' ')
        const _unit = parts[parts.length - 1]
        amount = parseFloat(balance)
        unit = Unit[_unit]
    }
</script>

<InputContainer col {disabled} {isFocused} {error} classes="space-y-2">
    <div class="flex flex-row w-full items-center">
        <AssetDropdown bind:asset />
        <AmountInput clearBackground clearPadding clearBorder bind:amount bind:isFocused {disabled} {...$$restProps} />
        <UnitInput bind:unit bind:isFocused {asset} />
    </div>
    <div class="flex flex-row w-full items-end justify-between">
        <button on:click={onClickAvailableBalance}>
            <Text color="gray-600" fontSize="xs" classes="cursor-pointer">Available balance: {asset?.balance}</Text>
        </button>
        <Text color="gray-600" fontSize="xs">0.00</Text>
    </div>
</InputContainer>

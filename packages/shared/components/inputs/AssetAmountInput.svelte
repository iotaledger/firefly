<script lang="typescript">
    import { Text, AssetDropdown, InputContainer, TextInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import AmountInput from './AmountInput.svelte'

    export let disabled = false
    export let isFocused = false

    let asset
    let amount
    let error
</script>

<InputContainer col {disabled} {isFocused} {error} classes="space-y-3">
    <div class="flex flex-row w-full">
        <AssetDropdown bind:asset />
        <AmountInput clearBackground bind:amount bind:isFocused {disabled} {...$$restProps} />
    </div>
    <div class="flex flex-row w-full justify-between">
        <Text classes="font-semibold">{asset?.balance}</Text>
        <Text secondary>{asset?.fiatPrice}</Text>
    </div>
</InputContainer>

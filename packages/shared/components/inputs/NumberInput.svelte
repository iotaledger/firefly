<script lang="ts">
    import { TextInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import { createEventDispatcher } from 'svelte'

    export let inputElement: HTMLInputElement = undefined

    export let disabled = false
    export let hasFocus = false
    export let value: string
    export let isInteger: boolean

    const dispatch = createEventDispatcher()
</script>

<TextInput
    bind:inputElement
    bind:value
    bind:hasFocus
    {disabled}
    placeholder={localize('general.amount')}
    float={!isInteger}
    integer={isInteger}
    on:blur={() => dispatch('blur')}
    {...$$restProps}
>
    <slot name="right-full-h" slot="right-full-h" />
</TextInput>

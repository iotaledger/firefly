<script lang="typescript">
    import { TextInput } from 'shared/components'
    import { localize } from '@core/i18n'

    export let inputElement: HTMLInputElement

    export let disabled = false
    export let hasFocus = false
    export let value: string
    export let isInteger: boolean
</script>

<TextInput
    bind:inputElement
    bind:value
    bind:hasFocus
    {disabled}
    placeholder={localize('general.amount')}
    float={!isInteger}
    integer={isInteger}
    {...$$restProps}
>
    <slot />
</TextInput>

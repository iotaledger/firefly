<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Modal, TextInput } from 'shared/components'

    export let value: string = ''
    export let error: string = ''
    export let disabled: boolean = false
    export let labelLocale: string = ''
    export let modal: Modal = undefined
    export let inputElement: HTMLInputElement = undefined

    let hasFocus: boolean

    $: hasFocus && (error = '')

    $: if (hasFocus) {
        setTimeout(() => modal?.open(), 100)
    }
</script>

<selector-input class="w-full relative">
    <TextInput
        bind:inputElement
        bind:value
        bind:hasFocus
        {error}
        {disabled}
        label={localize(labelLocale)}
        placeholder={localize(labelLocale)}
        fontSize="sm"
        {...$$restProps}
    />
    <slot onClose={() => inputElement.blur()}>
        <!-- Contains Custom Selector -->
    </slot>
</selector-input>

<script type="typescript">
    import { Icon, TextInput, InputContainer } from 'shared/components'

    export let value: string
    export let icon: string
    export let inputElement: HTMLInputElement
    export let isFocused = true
</script>

<InputContainer bind:this={inputElement} bind:inputElement row classes="w-full items-center space-x-0.5">
    <Icon {icon} classes="left-2 text-gray-500" />
    <TextInput bind:value bind:inputElement bind:hasFocus={isFocused} clearBackground clearPadding clearBorder />
</InputContainer>

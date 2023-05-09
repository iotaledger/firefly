<script lang="ts">
    import { FontWeight, Icon, TextInput } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let value: string
    export let placeholder: string
    export let icon: IconEnum
</script>

<TextInput
    bind:value
    {placeholder}
    fontSize="15"
    clearPadding
    containerClasses="py-2 px-3"
    fontWeight={FontWeight.medium}
    color="gray-500"
>
    <Icon slot="left" {icon} classes="text-gray-500 dark:text-white mr-2" />
</TextInput>

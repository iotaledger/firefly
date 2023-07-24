<script lang="ts">
    import { Icon, Text } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let message: string = ''
    export let size: number = 24
    export let color: string = 'text-gray-500 dark:text-white'
</script>

<spinner-container class="flex flex-row items-center justify-center">
    <Icon icon={IconEnum.Refresh} width={size} height={size} classes="animate-spin-reverse {color}" />
    {#if message}
        <Text type="p" classes="ml-2" secondary>{message}</Text>
    {/if}
</spinner-container>

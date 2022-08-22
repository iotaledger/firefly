<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let busy = false
    export let message = ''
    export let classes = ''
</script>

{#if busy || message}
    <div class={`flex flex-row items-center ${classes}`}>
        {#if busy}
            <Icon icon="refresh" classes="animate-spin-reverse text-gray-500 dark:text-white" />
        {/if}
        {#if message}
            <Text type="p" classes="ml-2" secondary>{message}</Text>
        {/if}
    </div>
{/if}

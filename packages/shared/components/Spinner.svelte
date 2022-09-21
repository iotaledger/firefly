<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let busy = false
    export let message = ''
    export let width = 24
    export let height = 24
    export let color = 'gray-500'
    export let darkColor = 'white'
    export let classes = ''
</script>

{#if busy || message}
    <spinner-container class={`flex flex-row items-center ${classes}`}>
        {#if busy}
            <Icon
                icon="refresh"
                {width}
                {height}
                classes={`animate-spin-reverse text-${color} dark:text-${darkColor}`}
            />
        {/if}
        {#if message}
            <Text type="p" classes="ml-2" secondary>{message}</Text>
        {/if}
    </spinner-container>
{/if}

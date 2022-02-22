<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let classes: string = ''
    export let icon: 'info' | 'exclamation' | 'none' = 'none'
    export let hint: string = ''
</script>

{#if hint}
    <div class="flex flex-row items-center {classes}">
        {#if icon !== 'none'}
            <Icon {icon} classes="mr-3 fill-current text-black dark:text-white" />
        {/if}
        <Text type="p" classes="text-black dark:text-white">{hint}</Text>
    </div>
{/if}

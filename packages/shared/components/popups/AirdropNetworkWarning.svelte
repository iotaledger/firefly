<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let title: string
    export let body: string[]
</script>

<div class="mb-5 text-center">
    <Text type="h4">{title}</Text>
</div>
{#if body?.length}
    <div class="px-2 py-4 rounded-lg flex flex-row space-x-4 items-center bg-yellow-50 dark:bg-opacity-10">
        <Icon icon="exclamation" classes="fill-current text-yellow-600" />
        <div class="flex flex-col flex-wrap space-y-3">
            {#each body as paragraph}
                <Text type="p">
                    {paragraph}
                </Text>
            {/each}
        </div>
    </div>
{/if}

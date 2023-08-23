<script lang="ts">
    import { Text, NodeListRow } from '@ui'
    import { localize } from '@core/i18n'
    import { getOfficialNodes, isOfficialNetwork } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let nodesContainer: HTMLElement | undefined = undefined

    $: clientOptions = $activeProfile?.clientOptions
    $: nodeList =
        clientOptions?.nodes?.length && clientOptions?.nodes?.length > 0
            ? clientOptions?.nodes
            : getOfficialNodes($activeProfile?.network?.id)
</script>

<div
    class="max-h-80 flex flex-col border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
    bind:this={nodesContainer}
>
    {#if clientOptions?.nodes}
        {#if clientOptions?.nodes?.length < 1 && !isOfficialNetwork($activeProfile?.network?.id)}
            <Text classes="p-3">
                {localize('views.settings.configureNodeList.noNodes')}
            </Text>
        {:else}
            {#each nodeList as node}
                <NodeListRow {node} />
            {/each}
        {/if}
    {/if}
</div>

<script lang="ts">
    import { localize } from '@core/i18n'
    import { getOfficialNodes, INode, isOfficialNetwork } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { Pill, Text } from '@ui'

    export let onNodeClick: (node: INode) => void

    $: clientOptions = $activeProfile?.clientOptions

    let nodesList: INode[] = []
    $: nodesList =
        clientOptions.nodes.length === 0
            ? getOfficialNodes($activeProfile.networkProtocol, $activeProfile.networkType)
            : clientOptions.nodes

    function isPrimary(node: INode): boolean {
        return node.url === clientOptions?.primaryNode?.url
    }
</script>

<div
    class="max-h-80 flex flex-col border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
>
    {#if clientOptions.nodes.length === 0 && !isOfficialNetwork($activeProfile.networkType)}
        <Text classes="p-3">
            {localize('views.settings.configureNodeList.noNodes')}
        </Text>
    {:else}
        {#each nodesList as node}
            <button
                class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                on:click={() => onNodeClick(node)}
            >
                <div class="flex flex-row items-center space-x-4 overflow-hidden">
                    <Text classes={'self-start overflow-hidden whitespace-nowrap overflow-ellipsis'}>
                        {node.url}
                    </Text>
                    {#if isPrimary(node)}
                        <Pill
                            data={localize('views.settings.configureNodeList.primaryNode').toLowerCase()}
                            textColor="blue-500"
                        />
                    {/if}
                    {#if node?.disabled}
                        <Pill data={localize('general.excluded').toLowerCase()} textColor="red-500" />
                    {/if}
                </div>
            </button>
        {/each}
    {/if}
</div>

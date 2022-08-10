<script lang="typescript">
    import { localize } from '@core/i18n'
    import { getOfficialNodes, INode, isOfficialNetwork } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { openPopup } from '@lib/popup'
    import { Text, NodeActionsButton } from 'shared/components'

    export let nodesContainer: HTMLElement

    $: clientOptions = $activeProfile?.clientOptions

    function handleViewNodeInfoClick(node: INode): void {
        openPopup({
            type: 'nodeInfo',
            props: {
                node,
            },
        })
    }
</script>

<div
    class="max-h-80 flex flex-col border border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-2xl overflow-auto"
    bind:this={nodesContainer}
>
    {#if clientOptions.nodes.length === 0 && !isOfficialNetwork($activeProfile.networkType)}
        <Text classes="p-3">
            {localize('views.settings.configureNodeList.noNodes')}
        </Text>
    {:else}
        {#each clientOptions.nodes.length === 0 ? getOfficialNodes($activeProfile.networkProtocol, $activeProfile.networkType) : clientOptions.nodes as node}
            <button
                class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                on:click={() => handleViewNodeInfoClick(node)}
            >
                <div class="flex flex-row items-center space-x-4 overflow-hidden">
                    <Text classes={'self-start overflow-hidden whitespace-nowrap overflow-ellipsis'}>
                        {node.url}
                    </Text>
                </div>
                <NodeActionsButton {node} {clientOptions} />
            </button>
        {/each}
    {/if}
</div>

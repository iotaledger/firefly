<script lang="ts">
    import { NodeActionsButton, Pill, Text } from '@ui'
    import { localize } from '@core/i18n'
    import { getOfficialNodes, INode, isOfficialNetwork } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { openPopup, PopupId } from '../../desktop/lib/auxiliary/popup'

    export let nodesContainer: HTMLElement | undefined = undefined

    $: clientOptions = $activeProfile?.clientOptions

    function isPrimary(node: INode): boolean {
        return node.url === clientOptions?.primaryNode?.url
    }

    function onViewNodeInfoClick(node: INode): void {
        openPopup({
            id: PopupId.NodeInfo,
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
    {#if clientOptions?.nodes}
        {#if clientOptions?.nodes?.length < 1 && !isOfficialNetwork($activeProfile?.network?.id)}
            <Text classes="p-3">
                {localize('views.settings.configureNodeList.noNodes')}
            </Text>
        {:else}
            {#each clientOptions?.nodes?.length > 0 ? clientOptions?.nodes : getOfficialNodes($activeProfile?.network?.id) as node}
                <button
                    class="flex flex-row items-center justify-between py-4 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20"
                    on:click={() => onViewNodeInfoClick(node)}
                >
                    <div class="flex flex-row items-center space-x-4 overflow-hidden">
                        <Text classes={'self-start overflow-hidden whitespace-nowrap text-ellipsis'}>
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
                    <NodeActionsButton {node} {clientOptions} />
                </button>
            {/each}
        {/if}
    {/if}
</div>

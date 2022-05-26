<script lang="typescript">
    import { Text, NodeConfigurationForm, Button, Spinner } from 'shared/components'
    import SwitchNetwork from './SwitchNetwork.svelte'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import { INode, INetwork, IAuth } from '@core/network'
    import { localize } from '@core/i18n'
    import { closePopup } from '@lib/popup'

    export let node: INode = { url: '' }
    export let nodes: INode[] = []
    export let network: INetwork
    export let isAddingNode: boolean = true
    export let onSuccess = (..._: any[]): void => {}

    const nodeUrl: string = node?.url || ''
    const optNodeAuth: IAuth = node?.auth || { username: '', password: '', jwt: '' }
    const isNetworkSwitch = false

    let newNetwork: INetwork
    let nodeConfigurationForm: NodeConfigurationForm
    let isBusy = false

    $: {
        node.url = stripSpaces(node.url)
    }

    const cleanNodeUrl = (_url: string): string => stripTrailingSlash(stripSpaces(_url))
</script>

{#if isNetworkSwitch}
    <SwitchNetwork network={newNetwork} node={{ url: cleanNodeUrl(nodeUrl), auth: optNodeAuth }} />
{:else}
    <Text type="h4" classes="mb-6">{localize(`popups.node.title${isAddingNode ? 'Add' : 'Update'}`)}</Text>
    <NodeConfigurationForm bind:this={nodeConfigurationForm} bind:isBusy {node} {nodes} {network} {onSuccess} />
    <div class="flex flex-row justify-between space-x-4 w-full">
        <Button secondary classes="w-1/2" onClick={closePopup} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!nodeUrl || isBusy}
            type="submit"
            form="node-config-form"
            classes="w-1/2"
            onClick={nodeConfigurationForm?.handleAddNode}
        >
            {#if isBusy}
                <Spinner
                    busy={isBusy}
                    message={localize(`popups.node.${isAddingNode ? 'addingNode' : 'updatingNode'}`)}
                    classes="justify-center"
                />
            {:else}
                {localize(`actions.${isAddingNode ? 'addNode' : 'updateNode'}`)}
            {/if}
        </Button>
    </div>
{/if}
